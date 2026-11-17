package app

import (
	"github.com/gin-gonic/gin"

	"github.com/Andmalil/Velora/server/internal/handler"
	"github.com/Andmalil/Velora/server/internal/middleware"
	"github.com/Andmalil/Velora/server/internal/store"
)

// Router connects HTTP handlers to shared middleware and database access.
func Router(db *store.Database, secureCookie bool) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), middleware.Request())
	h := handler.New(db)
	r.GET("/api/health", h.Health)
	r.GET("/api/products", h.Products)
	// Only cart and order routes need a persistent guest session.
	guest := r.Group("/api", middleware.Session(db, secureCookie))
	guest.GET("/cart", h.Cart)
	guest.PUT("/cart/:id", h.SetQuantity)
	guest.POST("/orders", h.Checkout)
	return r
}
