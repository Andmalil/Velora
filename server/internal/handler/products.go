package handler

import "github.com/gin-gonic/gin"

// Products returns the catalog in the field format expected by the React client.
func (h *Handler) Products(c *gin.Context) {
	products, err := h.db.Products(c.Request.Context())
	if err != nil {
		Fail(c, err)
		return
	}
	c.JSON(200, products)
}
