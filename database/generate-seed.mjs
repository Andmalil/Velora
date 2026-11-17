import fs from 'node:fs';
import { categories, products } from '../frontend/src/data/products.ts';

const sql = (value) => value == null ? 'NULL' : typeof value === 'number' ? String(value) : `'${String(value).replaceAll("'", "''")}'`;
const categoryRows = categories.filter(category => category !== 'All products').map((name, index) => `    (${sql(name)}, ${index})`).join(',\n');
const productRows = products.map((product, index) => `    (${[
  product.id, product.name, product.brand, product.category, product.kind,
  product.price, product.previousPrice, product.specs, product.rating,
  product.reviews, product.badge, product.color, product.description, index,
].map(sql).join(', ')})`).join(',\n');

fs.writeFileSync(new URL('./seed.sql', import.meta.url), `-- Exact demonstration catalog from frontend/src/data/products.ts.
-- Existing records with the same primary key are left unchanged.
-- Ratings and review counts are sample values, not individual review records.
BEGIN;

INSERT INTO categories (name, sort_order) VALUES
${categoryRows}
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (
    id, name, brand, category, kind, price, previous_price, specs,
    rating, reviews, badge, color, description, sort_order
) VALUES
${productRows}
ON CONFLICT (id) DO NOTHING;

COMMIT;
`, 'utf8');
console.log(`Generated seed.sql: ${categories.length - 1} categories, ${products.length} products.`);
