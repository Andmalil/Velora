package handler

import (
	"net/mail"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/Andmalil/Velora/server/internal/store"
)

type CheckoutRequest store.CheckoutInput

// valid trims contact fields and checks input bounds before starting a transaction.
func (b *CheckoutRequest) Valid() bool {
	b.Name = strings.TrimSpace(b.Name)
	b.Email = strings.TrimSpace(b.Email)
	b.Address = strings.TrimSpace(b.Address)
	// Require a plain email address, not a display-name mailbox such as "Name <email>".
	addr, err := mail.ParseAddress(b.Email)
	return err == nil && addr.Address == b.Email && len(b.Name) >= 2 && len(b.Name) <= 120 && len(b.Email) <= 254 && len(b.Address) >= 8 && len(b.Address) <= 500 && len(b.RequestID) >= 16 && len(b.RequestID) <= 100
}

// Checkout creates an order or returns the existing order for a repeated request ID.
func (h *Handler) Checkout(c *gin.Context) {
	var body CheckoutRequest
	if err := c.ShouldBindJSON(&body); err != nil || !body.Valid() {
		c.JSON(400, gin.H{"error": "Enter a valid name, email and delivery address"})
		return
	}
	order, created, err := h.db.Checkout(c.Request.Context(), c.GetString("session"), store.CheckoutInput(body))
	if err != nil {
		Fail(c, err)
		return
	}
	status := 200
	if created {
		status = 201
	}
	c.JSON(status, order)
}
