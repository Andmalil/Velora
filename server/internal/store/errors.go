package store

import "errors"

var ErrProductNotFound = errors.New("Product not found")
var ErrNotEnoughStock = errors.New("Not enough stock")
var ErrEmptyCart = errors.New("Your cart is empty")

type StockError struct{ Product string }

func (e *StockError) Error() string { return "Insufficient stock for " + e.Product }
