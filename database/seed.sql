-- Exact demonstration catalog from frontend/src/data/products.ts.
-- Existing records with the same primary key are left unchanged.
-- Ratings and review counts are sample values, not individual review records.
BEGIN;

INSERT INTO categories (name, sort_order) VALUES
    ('Laptops', 0),
    ('Desktops', 1),
    ('Components', 2),
    ('Monitors', 3),
    ('Accessories', 4)
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (
    id, name, brand, category, kind, price, previous_price, specs,
    rating, reviews, badge, color, description, sort_order
) VALUES
    ('studio-14', 'StudioBook Pro 14', 'VELORA', 'Laptops', 'laptop', 1499, 1699, 'Core Ultra 7 · 32GB · 1TB SSD', 4.9, 128, 'Bestseller', 'blue', 'A lightweight creative powerhouse with a brilliant 14-inch display, an aluminum chassis, and the performance to take your next big idea anywhere.', 0),
    ('forge', 'Forge Gaming Desktop', 'VELORA', 'Desktops', 'desktop', 1899, NULL, 'Ryzen 7 · RTX 4070 · 32GB', 4.8, 86, 'New arrival', 'purple', 'Built for immersive play and demanding work. A balanced gaming tower with quiet cooling, spacious storage, and room for your next upgrade.', 1),
    ('vision', 'Vision 27” 4K Monitor', 'VELORA', 'Monitors', 'monitor', 449, 529, '27-inch · 4K IPS · USB-C', 4.8, 214, 'Save $80', 'green', 'More space for your ideas. Enjoy a crisp 4K IPS panel, a clean adjustable stand, and convenient USB-C connectivity for your everyday setup.', 2),
    ('keys', 'Keys Mechanical 75', 'VELORA', 'Accessories', 'keyboard', 129, NULL, 'Wireless · Hot-swappable · RGB', 4.9, 173, NULL, 'cream', 'Make every keystroke count. A compact wireless mechanical keyboard with tactile switches, a comfortable profile, and customizable lighting.', 3),
    ('graphics', 'GeForce RTX 4070', 'NVIDIA', 'Components', 'gpu', 549, 599, '12GB GDDR6X · Dual fan', 4.8, 96, 'Save $50', 'green', 'Bring your games and creative projects to life with a capable dual-fan graphics card and 12GB of dedicated graphics memory.', 4),
    ('air', 'AirBook 13', 'VELORA', 'Laptops', 'laptop', 899, NULL, 'Core Ultra 5 · 16GB · 512GB SSD', 4.7, 64, NULL, 'cream', 'Your everyday companion for work, study, and everything in between. A portable 13-inch laptop with a clean design and fast solid-state storage.', 5),
    ('mouse', 'Arc Wireless Mouse', 'VELORA', 'Accessories', 'mouse', 69, NULL, 'Wireless · 8,000 DPI · USB-C', 4.8, 112, NULL, 'blue', 'A precise, comfortable wireless mouse that fits naturally into your day. Adjustable sensitivity and convenient USB-C charging.', 6),
    ('ultrawide', 'Horizon 34” Ultrawide', 'VELORA', 'Monitors', 'monitor', 649, NULL, '34-inch · 144Hz · Curved', 4.9, 78, 'New arrival', 'purple', 'See the bigger picture with an expansive ultrawide display. Smooth motion and a panoramic workspace for gaming, editing, and multitasking.', 7)
ON CONFLICT (id) DO NOTHING;

COMMIT;
