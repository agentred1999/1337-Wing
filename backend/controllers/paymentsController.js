import Stripe from 'stripe';
import pool from '../database/pool.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Works for both logged-in users and guest orders. req.user is only present
// when the request went through the `authenticate` middleware; guest checkout
// hits this route without it, so ownership is checked differently per case.
export async function createPaymentIntent(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id ?? null;

    const orderResult = await pool.query(
      'SELECT id, user_id, total, status FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.user_id !== null) {
      if (!userId || order.user_id !== userId) {
        return res.status(403).json({ error: 'Not authorized for this order' });
      }
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not payable in its current state' });
    }

    const amountInCents = Math.round(parseFloat(order.total) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: { order_id: String(order.id), user_id: userId ? String(userId) : 'guest' },
      automatic_payment_methods: { enabled: true },
    });

    await pool.query(
      'UPDATE orders SET stripe_payment_intent_id = $1 WHERE id = $2',
      [paymentIntent.id, order.id]
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
}

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    try {
      await pool.query(
        `UPDATE orders SET status = 'paid' WHERE stripe_payment_intent_id = $1`,
        [paymentIntent.id]
      );
    } catch (err) {
      console.error('Failed to update order status after payment:', err);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    try {
      await pool.query(
        `UPDATE orders SET status = 'cancelled' WHERE stripe_payment_intent_id = $1 AND status = 'pending'`,
        [paymentIntent.id]
      );
    } catch (err) {
      console.error('Failed to update order status after payment failure:', err);
    }
  }

  res.json({ received: true });
}
