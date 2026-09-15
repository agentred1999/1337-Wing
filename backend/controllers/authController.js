import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database/pool.js';

const SALT_ROUNDS = 12;
const DUMMY_HASH = '$2b$12$CwTycUXWue0Thq9StjUM0uJ8i8mF.p8f5oW3ZKAYqE4tKQK7z5.Fu';

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, keep in sync with JWT_EXPIRES_IN
    path: '/',
  });
}

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, username, email, role, created_at`,
      [username, email, passwordHash]
    );
    const user = result.rows[0];
    const token = signToken(user);
    setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
      [username]
    );
    const user = result.rows[0];
    const hashToCheck = user ? user.password_hash : DUMMY_HASH;
    const match = await bcrypt.compare(password, hashToCheck);
    if (!user || !match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user);
    delete user.password_hash;
    setAuthCookie(res, token);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie('token', { path: '/' });
  res.json({ success: true });
}

export function me(req, res) {
  res.json({ user: req.user });
}
