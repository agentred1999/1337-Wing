-- Adds the columns needed to fully drive the shop page from Postgres
-- instead of the static frontend products.ts array.
-- image_url already exists in the base schema; short_description and specs are new.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_description VARCHAR(500),
  ADD COLUMN IF NOT EXISTS specs JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.short_description IS 'Short teaser shown on shop grid cards';
COMMENT ON COLUMN products.specs IS 'Array of {label, value} objects shown on product detail view';

ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'apparel';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'computer';
