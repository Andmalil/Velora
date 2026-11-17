package middleware

import (
	"context"
	"net/http"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"
)

// Request limits payload size and processing time and rejects foreign browser origins.
func Request() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Cache-Control", "no-store")
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 16<<10)
		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()
		c.Request = c.Request.WithContext(ctx)
		// Mutation requests from browsers must use the same host, including its port.
		// Reverse proxies must preserve the original Host header for this comparison.
		if c.Request.Method != http.MethodGet && c.Request.Method != http.MethodHead {
			origin := c.GetHeader("Origin")
			if origin != "" {
				u, err := url.Parse(origin)
				if err != nil || u.Host != c.Request.Host {
					c.AbortWithStatusJSON(403, gin.H{"error": "Cross-origin request rejected"})
					return
				}
			}
		}
		c.Next()
	}
}
