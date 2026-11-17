package tests

import (
	"testing"

	"github.com/Andmalil/Velora/server/internal/handler"
)

func TestCheckoutValidation(t *testing.T) {
	valid := handler.CheckoutRequest{Name: "Test Buyer", Email: "buyer@example.com", Address: "10 Example Street", RequestID: "0123456789abcdef"}
	if !valid.Valid() {
		t.Fatal("valid request rejected")
	}
	for _, mutate := range []func(*handler.CheckoutRequest){
		func(b *handler.CheckoutRequest) { b.Email = "invalid" },
		func(b *handler.CheckoutRequest) { b.Name = " " },
		func(b *handler.CheckoutRequest) { b.Address = "short" },
		func(b *handler.CheckoutRequest) { b.RequestID = "" },
	} {
		b := valid
		mutate(&b)
		if b.Valid() {
			t.Fatal("invalid request accepted")
		}
	}
}
