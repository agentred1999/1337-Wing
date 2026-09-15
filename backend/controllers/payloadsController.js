import pool from '../database/pool.js';

export async function getPayloads(req, res, next) {
  try {
    const { device_target, category } = req.query;
    const conditions = ['approved = true'];
    const params = [];

    if (device_target) {
      params.push(device_target);
      conditions.push(`device_target = $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    const query = `
      SELECT p.*, u.username AS author_username
      FROM payloads p
      JOIN users u ON u.id = p.author_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY p.upvotes DESC, p.created_at DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function submitPayload(req, res, next) {
  try {
    const { title, description, device_target, category, code_snippet } = req.body;
    const authorId = req.user.id;

    const result = await pool.query(
      `INSERT INTO payloads (title, description, device_target, category, code_snippet, author_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, device_target, category, code_snippet, authorId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function approvePayload(req, res, next) {
  try {
    const result = await pool.query(
      'UPDATE payloads SET approved = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payload not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function upvotePayload(req, res, next) {
  try {
    const result = await pool.query(
      'UPDATE payloads SET upvotes = upvotes + 1 WHERE id = $1 AND approved = true RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payload not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}
