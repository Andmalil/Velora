package store

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Database owns the connection pool used by catalog, session, cart, and order queries.
type Database struct{ db *pgxpool.Pool }

// New wraps an existing pool. Close releases the pool.
func New(pool *pgxpool.Pool) *Database { return &Database{db: pool} }

// Open creates a pool and verifies connectivity before the server starts accepting requests.
func Open(ctx context.Context, url string) (*Database, error) {
	db, err := pgxpool.New(ctx, url)
	if err != nil {
		return nil, err
	}
	pingCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	if err = db.Ping(pingCtx); err != nil {
		db.Close()
		return nil, err
	}
	return New(db), nil
}

// Close releases database connections after HTTP requests have finished.
func (d *Database) Close() { d.db.Close() }

// Ping checks whether the database can be reached within the caller's deadline.
func (d *Database) Ping(ctx context.Context) error { return d.db.Ping(ctx) }
