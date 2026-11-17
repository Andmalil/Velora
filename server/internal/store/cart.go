package store

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
)

// Cart returns product IDs and quantities without trusting client-side cart state.
func (s *Database) Cart(ctx context.Context, session string) (map[string]int, error) {
	rows, err := s.db.Query(ctx, "SELECT product_id,quantity FROM guest_cart_items WHERE session_id=$1", session)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := map[string]int{}
	for rows.Next() {
		var id string
		var n int
		if err := rows.Scan(&id, &n); err != nil {
			return nil, err
		}
		items[id] = n
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

// SetQuantity updates a validated quantity within a session-locked transaction.
// Adding an item does not reserve stock; checkout checks availability again.
func (s *Database) SetQuantity(ctx context.Context, session, id string, n int) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	if err = lockSession(ctx, tx, session); err != nil {
		return err
	}
	if n == 0 {
		_, err = tx.Exec(ctx, "DELETE FROM guest_cart_items WHERE session_id=$1 AND product_id=$2", session, id)
	} else {
		var stock int
		err = tx.QueryRow(ctx, "SELECT stock FROM products WHERE id=$1", id).Scan(&stock)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrProductNotFound
		}
		if err != nil {
			return err
		}
		if n > stock {
			return ErrNotEnoughStock
		}
		_, err = tx.Exec(ctx, "INSERT INTO guest_cart_items(session_id,product_id,quantity) VALUES($1,$2,$3) ON CONFLICT(session_id,product_id) DO UPDATE SET quantity=EXCLUDED.quantity", session, id, n)
	}
	if err != nil {
		return err
	}
	if err = tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}
