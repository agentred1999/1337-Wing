import pool from '../database/pool.js';

// Shared order-creation logic used by both the authenticated and guest paths.
// userId is null for guest orders.
async function createOrderInternal({ items, userId, guest }) {
  const client = await pool.connect();
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw { status: 400, message: 'Order must include at least one item' };
    }

    await client.query('BEGIN');

    let total = 0;
    const lineItems = [];

    for (const item of items) {
      const productResult = await client.query(
        'SELECT id, price, stock FROM products WHERE id = $1',
        [item.product_id]
      );
      if (productResult.rows.length === 0) {
        throw { status: 400, message: `Product ${item.product_id} not found` };
      }
      const product = productResult.rows[0];
      if (product.stock < item.quantity) {
        throw { status: 400, message: `Insufficient stock for product ${item.product_id}` };
      }
      const lineTotal = parseFloat(product.price) * item.quantity;
      total += lineTotal;
      lineItems.push({ product_id: product.id, quantity: item.quantity, price: product.price });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (
         user_id, status, total,
         guest_name, guest_email,
         shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country
       )
       VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        total.toFixed(2),
        guest?.name ?? null,
        guest?.email ?? null,
        guest?.street ?? null,
        guest?.city ?? null,
        guest?.state ?? null,
        guest?.zip ?? null,
        guest?.country ?? null,
      ]
    );
    const order = orderResult.rows[0];

    for (const li of lineItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, li.product_id, li.quantity, li.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [li.quantity, li.product_id]
      );
    }

    await client.query('COMMIT');
    return { ...order, items: lineItems };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function createOrder(req, res, next) {
  try {
    const { items } = req.body;
    const order = await createOrderInternal({ items, userId: req.user.id, guest: null });
    res.status(201).json(order);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

// Basic email format check — good enough to catch typos/garbage without being a full RFC validator.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createGuestOrder(req, res, next) {
  try {
    const { items, guest } = req.body;

    if (!guest || typeof guest !== 'object') {
      return res.status(400).json({ error: 'Guest contact and shipping info is required' });
    }

    const { name, email, street, city, state, zip, country } = guest;

    if (!name || !email || !street || !city || !zip || !country) {
      return res.status(400).json({ error: 'Name, email, and full shipping address are required' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const order = await createOrderInternal({
      items,
      userId: null,
      guest: { name, email, street, city, state: state ?? null, zip, country },
    });

    res.status(201).json(order);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
         'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price_at_purchase
       )) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT o.*, u.username, u.email
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const valid = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}
