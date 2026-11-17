package store

import (
	"context"

	"github.com/jackc/pgx/v5"
)

// Session reuses an unexpired token or creates a new one.
// The boolean reports whether the caller needs to set a new session cookie.
func (d *Database) Session(ctx context.Context, token string) (string, bool, error) {
	var valid bool
	if len(token) == 64 {
		if err := d.db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM guest_sessions WHERE id=$1 AND expires_at>now())", token).Scan(&valid); err != nil {
			return "", false, err
		}
	}
	if valid {
		return token, false, nil
	}
	token = newID()
	_, err := d.db.Exec(ctx, "INSERT INTO guest_sessions(id) VALUES($1)", token)
	return token, true, err
}

// lockSession serializes cart changes and checkout for the same visitor.
// PostgreSQL releases the row lock when the transaction commits or rolls back.
func lockSession(ctx context.Context, tx pgx.Tx, session string) error {
	_, err := tx.Exec(ctx, "SELECT id FROM guest_sessions WHERE id=$1 FOR UPDATE", session)
	return err
}
