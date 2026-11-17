package handler

import (
	"errors"
	"log"

	"github.com/gin-gonic/gin"

	"github.com/Andmalil/Velora/server/internal/store"
)

// Handler translates HTTP requests into store operations and JSON responses.
type Handler struct{ db *store.Database }

// New shares the application's database connection pool across handlers.
func New(db *store.Database) *Handler { return &Handler{db: db} }

// Fail maps expected store errors to HTTP statuses and hides internal failures.
func Fail(c *gin.Context, err error) {
	status := 503
	var stockError *store.StockError
	switch {
	case errors.Is(err, store.ErrProductNotFound):
		status = 404
	case errors.Is(err, store.ErrNotEnoughStock), errors.As(err, &stockError):
		status = 409
	case errors.Is(err, store.ErrEmptyCart):
		status = 400
	}
	message := err.Error()
	if status == 503 {
		log.Print(err)
		message = "Service temporarily unavailable. Please try again."
	}
	c.AbortWithStatusJSON(status, gin.H{"error": message})
}

// Health checks database connectivity rather than just HTTP server availability.
func (h *Handler) Health(c *gin.Context) {
	if err := h.db.Ping(c.Request.Context()); err != nil {
		Fail(c, err)
		return
	}
	c.JSON(200, gin.H{"status": "ok"})
}
