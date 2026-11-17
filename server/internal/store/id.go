package store

import (
	"crypto/rand"
	"encoding/hex"
)

// newID generates an unpredictable 256-bit token encoded as 64 hexadecimal characters.
func newID() string {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	return hex.EncodeToString(b)
}
