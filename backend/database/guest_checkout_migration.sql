-- Enables guest checkout: orders no longer require a logged-in user.
-- Guest orders store name/email/shipping address directly on the order
-- since there's no user account to look them up from.

ALTER TABLE orders
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS guest_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS shipping_street VARCHAR(255),
  ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(120),
  ADD COLUMN IF NOT EXISTS shipping_state VARCHAR(120),
  ADD COLUMN IF NOT EXISTS shipping_zip VARCHAR(30),
  ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(120);

-- An order must belong to either a logged-in user or a guest (with contact info) — never neither.
ALTER TABLE orders
  ADD CONSTRAINT orders_owner_check
  CHECK (
    user_id IS NOT NULL
    OR (guest_name IS NOT NULL AND guest_email IS NOT NULL)
  );

COMMENT ON COLUMN orders.guest_name IS 'Set for guest checkouts only (user_id IS NULL)';
COMMENT ON COLUMN orders.guest_email IS 'Set for guest checkouts only (user_id IS NULL)';
