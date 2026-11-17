package handler

import "github.com/gin-gonic/gin"

// Cart returns quantities for the session established by the middleware.
func (h *Handler) Cart(c *gin.Context) {
	cart, err := h.db.Cart(c.Request.Context(), c.GetString("session"))
	if err != nil {
		Fail(c, err)
		return
	}
	c.JSON(200, cart)
}

// SetQuantity accepts an absolute quantity; zero removes the cart item.
func (h *Handler) SetQuantity(c *gin.Context) {
	// A pointer distinguishes a missing quantity from an explicit zero.
	var body struct {
		Quantity *int `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Quantity == nil || *body.Quantity < 0 || *body.Quantity > 99 {
		c.JSON(400, gin.H{"error": "Quantity must be an integer between 0 and 99"})
		return
	}
	if err := h.db.SetQuantity(c.Request.Context(), c.GetString("session"), c.Param("id"), *body.Quantity); err != nil {
		Fail(c, err)
		return
	}
	c.JSON(200, gin.H{"quantity": *body.Quantity})
}
