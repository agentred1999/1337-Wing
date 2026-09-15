import pool from '../database/pool.js';

export async function getProducts(req, res, next) {
  try {
    const { category } = req.query;
    const params = [];
    let query = 'SELECT * FROM products';

    if (category) {
      params.push(category);
      query += ' WHERE category = $1';
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, stock, image_url } = req.body;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, category, stock || 0, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { name, description, price, category, stock, image_url } = req.body;
    const result = await pool.query(
      `UPDATE products SET name = $1, description = $2, price = $3,
       category = $4, stock = $5, image_url = $6 WHERE id = $7 RETURNING *`,
      [name, description, price, category, stock, image_url, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
