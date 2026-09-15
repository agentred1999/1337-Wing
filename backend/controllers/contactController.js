import pool from '../database/pool.js';

export async function submitContact(req, res, next) {
  try {
    const { name, email, message } = req.body;
    const result = await pool.query(
      `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)
       RETURNING id, name, email, timestamp`,
      [name, email, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}
