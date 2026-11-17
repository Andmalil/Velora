package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Andmalil/Velora/server/internal/handler"
	"github.com/Andmalil/Velora/server/internal/store"
)

// Session resolves the guest cookie and exposes its token to downstream handlers.
// Set secure to true when the application is served over HTTPS.
func Session(db *store.Database, secure bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, _ := c.Cookie("velora_session")
		token, created, err := db.Session(c.Request.Context(), token)
		if err != nil {
			handler.Fail(c, err)
			return
		}
		// HttpOnly prevents JavaScript access; SameSite restricts cross-site cookie use.
		if created {
			http.SetCookie(c.Writer, &http.Cookie{Name: "velora_session", Value: token, Path: "/api", HttpOnly: true, Secure: secure, SameSite: http.SameSiteStrictMode, MaxAge: 30 * 86400})
		}
		c.Set("session", token)
		c.Next()
	}
}
