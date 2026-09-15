ALTER TABLE orders ADD COLUMN stripe_payment_intent_id VARCHAR(255);
CREATE INDEX idx_orders_stripe_pi ON orders(stripe_payment_intent_id);
