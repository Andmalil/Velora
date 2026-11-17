package store

import (
	"context"
	"encoding/json"
)

// Products preserves catalog order and maps SQL column names to the public JSON fields.
func (s *Database) Products(ctx context.Context) ([]json.RawMessage, error) {
	rows, err := s.db.Query(ctx, `SELECT json_build_object('id',id,'name',name,'brand',brand,'category',category,'kind',kind,'price',price,'previousPrice',previous_price,'specs',specs,'rating',rating,'reviews',reviews,'badge',badge,'color',color,'description',description,'stock',stock) FROM products ORDER BY sort_order`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := []json.RawMessage{}
	for rows.Next() {
		var p json.RawMessage
		if err := rows.Scan(&p); err != nil {
			return nil, err
		}
		result = append(result, p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}
