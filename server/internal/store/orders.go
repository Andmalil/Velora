package store

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
)

// CheckoutInput contains delivery details and a client-generated retry identifier.
// Prices and totals are deliberately excluded: they are read from the database.
type CheckoutInput struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Address   string `json:"address"`
	RequestID string `json:"requestId"`
}

// Order is the checkout response; Total is expressed in USD dollars.
type Order struct {
	ID    string  `json:"id"`
	Total float64 `json:"total"`
}

// Checkout atomically saves an order, reduces stock, and clears the guest cart.
// It returns the order and whether it was newly created.
func (s *Database) Checkout(ctx context.Context, session string, b CheckoutInput) (Order, bool, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return Order{}, false, err
	}
	// Rollback covers every early return and is harmless after a successful commit.
	defer tx.Rollback(ctx)
	if err = lockSession(ctx, tx, session); err != nil {
		return Order{}, false, err
	}
	var orderID string
	var total int64
	// Check retries under the session lock so concurrent requests cannot duplicate an order.
	err = tx.QueryRow(ctx, "SELECT id,total_cents FROM orders WHERE session_id=$1 AND request_id=$2", session, b.RequestID).Scan(&orderID, &total)
	if err == nil {
		return Order{ID: orderID, Total: float64(total) / 100}, false, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return Order{}, false, err
	}
	// Lock products in a consistent order to avoid overselling and reduce deadlock risk.
	// Convert NUMERIC prices to integer cents before calculating totals.
	rows, err := tx.Query(ctx, `SELECT p.id,p.name,(p.price*100)::bigint,p.stock,c.quantity FROM guest_cart_items c JOIN products p ON p.id=c.product_id WHERE c.session_id=$1 ORDER BY p.id FOR UPDATE OF p,c`, session)
	if err != nil {
		return Order{}, false, err
	}
	type line struct {
		id, name        string
		price           int64
		stock, quantity int
	}
	items := []line{}
	for rows.Next() {
		var item line
		if err = rows.Scan(&item.id, &item.name, &item.price, &item.stock, &item.quantity); err != nil {
			rows.Close()
			return Order{}, false, err
		}
		items = append(items, item)
	}
	err = rows.Err()
	rows.Close()
	if err != nil {
		return Order{}, false, err
	}
	if len(items) == 0 {
		return Order{}, false, ErrEmptyCart
	}
	for _, item := range items {
		if item.stock < item.quantity {
			return Order{}, false, &StockError{Product: item.name}
		}
		total += item.price * int64(item.quantity)
	}
	// Shipping is free for orders of $100 or more; otherwise $9.90.
	if total < 10000 {
		total += 990
	}
	orderID = newID()[:24]
	_, err = tx.Exec(ctx, "INSERT INTO orders(id,session_id,request_id,customer_name,email,address,total_cents) VALUES($1,$2,$3,$4,$5,$6,$7)", orderID, session, b.RequestID, b.Name, b.Email, b.Address, total)
	if err != nil {
		return Order{}, false, err
	}
	// Snapshot names and prices so later catalog edits do not change past orders.
	for _, item := range items {
		_, err = tx.Exec(ctx, "INSERT INTO order_items(order_id,product_id,name,unit_price_cents,quantity) VALUES($1,$2,$3,$4,$5)", orderID, item.id, item.name, item.price, item.quantity)
		if err != nil {
			return Order{}, false, err
		}
		_, err = tx.Exec(ctx, "UPDATE products SET stock=stock-$1 WHERE id=$2", item.quantity, item.id)
		if err != nil {
			return Order{}, false, err
		}
	}
	_, err = tx.Exec(ctx, "DELETE FROM guest_cart_items WHERE session_id=$1", session)
	if err != nil {
		return Order{}, false, err
	}
	if err = tx.Commit(ctx); err != nil {
		return Order{}, false, err
	}
	return Order{ID: orderID, Total: float64(total) / 100}, true, nil
}
