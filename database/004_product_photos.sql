BEGIN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
UPDATE products
SET image_url = '/products/' || id || '.webp'
WHERE image_url IS NULL AND id IN (
    'studio-14', 'forge', 'vision', 'keys', 'graphics', 'air', 'mouse', 'ultrawide'
);
COMMIT;
