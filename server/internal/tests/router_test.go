package tests

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"os"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Andmalil/Velora/server/internal/app"
	"github.com/Andmalil/Velora/server/internal/store"
)

func TestStoreIntegration(t *testing.T) {
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("Set TEST_DATABASE_URL to run PostgreSQL integration tests")
	}
	ctx := context.Background()
	admin, err := pgxpool.New(ctx, dsn)
	if err != nil {
		t.Fatal(err)
	}
	defer admin.Close()
	schema := fmt.Sprintf("test_%d", time.Now().UnixNano())
	if _, err = admin.Exec(ctx, "CREATE SCHEMA "+schema); err != nil {
		t.Fatal(err)
	}
	defer admin.Exec(ctx, "DROP SCHEMA "+schema+" CASCADE")
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		t.Fatal(err)
	}
	config.ConnConfig.RuntimeParams["search_path"] = schema
	db, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	for _, path := range []string{"../../../database/schema.sql", "../../../database/002_checkout.sql", "../../../database/seed.sql"} {
		sql, err := os.ReadFile(path)
		if err != nil {
			t.Fatal(err)
		}
		if _, err = db.Exec(ctx, string(sql)); err != nil {
			t.Fatal(err)
		}
	}
	ts := httptest.NewServer(app.Router(store.New(db), false))
	defer ts.Close()
	newClient := func() *http.Client { jar, _ := cookiejar.New(nil); return &http.Client{Jar: jar} }
	buyer, other := newClient(), newClient()
	request := func(client *http.Client, method, path, body string, want int) map[string]json.RawMessage {
		t.Helper()
		req, _ := http.NewRequest(method, ts.URL+path, strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()
		var result map[string]json.RawMessage
		json.NewDecoder(resp.Body).Decode(&result)
		if resp.StatusCode != want {
			t.Fatalf("%s %s: got %d want %d: %v", method, path, resp.StatusCode, want, result)
		}
		return result
	}
	request(buyer, "GET", "/api/cart", "", 200)
	request(other, "GET", "/api/cart", "", 200)
	request(buyer, "PUT", "/api/cart/studio-14", `{"quantity":2}`, 200)
	request(buyer, "PUT", "/api/cart/studio-14", `{"quantity":100}`, 400)
	request(buyer, "PUT", "/api/cart/missing", `{"quantity":1}`, 404)
	isolated := request(other, "GET", "/api/cart", "", 200)
	if len(isolated) != 0 {
		t.Fatal("cart leaked between sessions")
	}
	checkout := `{"name":"Test Buyer","email":"test@example.com","address":"10 Example Street","requestId":"0123456789abcdef"}`
	order := request(buyer, "POST", "/api/orders", checkout, 201)
	again := request(buyer, "POST", "/api/orders", checkout, 200)
	if string(order["id"]) != string(again["id"]) {
		t.Fatal("retry created a duplicate order")
	}
	if string(order["total"]) != "2998" {
		t.Fatalf("wrong server total: %s", order["total"])
	}
	if len(request(buyer, "GET", "/api/cart", "", 200)) != 0 {
		t.Fatal("cart was not cleared")
	}
	var stock int
	db.QueryRow(ctx, "SELECT stock FROM products WHERE id='studio-14'").Scan(&stock)
	if stock != 48 {
		t.Fatalf("stock=%d", stock)
	}
	request(other, "POST", "/api/orders", checkout, 400)
	// Two buyers compete for the last unit. Exactly one must succeed.
	db.Exec(ctx, "UPDATE products SET stock=1 WHERE id='studio-14'")
	request(buyer, "PUT", "/api/cart/studio-14", `{"quantity":1}`, 200)
	request(other, "PUT", "/api/cart/studio-14", `{"quantity":1}`, 200)
	results := make(chan int, 2)
	var wg sync.WaitGroup
	for i, client := range []*http.Client{buyer, other} {
		wg.Add(1)
		go func(i int, client *http.Client) {
			defer wg.Done()
			body := fmt.Sprintf(`{"name":"Test Buyer","email":"test@example.com","address":"10 Example Street","requestId":"concurrent-order-%d"}`, i)
			resp, err := client.Post(ts.URL+"/api/orders", "application/json", strings.NewReader(body))
			if err != nil {
				results <- 0
				return
			}
			defer resp.Body.Close()
			results <- resp.StatusCode
		}(i, client)
	}
	wg.Wait()
	close(results)
	counts := map[int]int{}
	for code := range results {
		counts[code]++
	}
	if counts[201] != 1 || counts[409] != 1 {
		t.Fatalf("oversell protection failed: %v", counts)
	}
	req, _ := http.NewRequest("PUT", ts.URL+"/api/cart/studio-14", strings.NewReader(`{"quantity":1}`))
	req.Header.Set("Origin", "https://other.example")
	resp, err := buyer.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 403 {
		t.Fatal("cross-origin mutation accepted")
	}
}
