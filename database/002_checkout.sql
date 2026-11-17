BEGIN;
ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 50 CHECK(stock >= 0);
CREATE TABLE guest_sessions (
 id TEXT PRIMARY KEY,
 expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '30 days'
);
CREATE TABLE guest_cart_items (
 session_id TEXT NOT NULL REFERENCES guest_sessions(id) ON DELETE CASCADE,
 product_id TEXT NOT NULL REFERENCES products(id),
 quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 99),
 PRIMARY KEY(session_id,product_id)
);
CREATE TABLE orders (
 id TEXT PRIMARY KEY,
 session_id TEXT NOT NULL REFERENCES guest_sessions(id),
 request_id TEXT NOT NULL,
 customer_name TEXT NOT NULL,
 email TEXT NOT NULL,
 address TEXT NOT NULL,
 total_cents BIGINT NOT NULL CHECK(total_cents > 0),
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(session_id,request_id)
);
CREATE TABLE order_items (
 order_id TEXT NOT NULL REFERENCES orders(id),
 product_id TEXT NOT NULL REFERENCES products(id),
 name TEXT NOT NULL,
 unit_price_cents BIGINT NOT NULL CHECK(unit_price_cents > 0),
 quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 99),
 PRIMARY KEY(order_id,product_id)
);
COMMIT;
