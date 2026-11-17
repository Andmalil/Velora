-- Run against an existing database, for example: psql -d velora -f database/schema.sql
-- This creates a fresh schema; it is not a migration for pre-existing tables.
BEGIN;

CREATE TABLE categories (
    name TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL UNIQUE CHECK (sort_order >= 0)
);

CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    brand TEXT NOT NULL,
    category TEXT NOT NULL REFERENCES categories(name),
    kind TEXT NOT NULL CHECK (kind IN ('laptop', 'desktop', 'gpu', 'monitor', 'keyboard', 'mouse')),
    -- USD amounts in dollars, matching the React Product.price field.
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    previous_price NUMERIC(12, 2) CHECK (previous_price > price),
    specs TEXT NOT NULL,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
    reviews INTEGER NOT NULL DEFAULT 0 CHECK (reviews >= 0),
    badge TEXT,
    color TEXT NOT NULL CHECK (color IN ('blue', 'purple', 'green', 'cream')),
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL UNIQUE CHECK (sort_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX products_category_idx ON products(category);

CREATE TABLE cart_items (
    -- Verified JWT subject. The current project has no users table.
    user_id TEXT NOT NULL CHECK (length(trim(user_id)) > 0),
    product_id TEXT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (user_id, product_id)
);

CREATE INDEX cart_items_product_id_idx ON cart_items(product_id);

COMMIT;
