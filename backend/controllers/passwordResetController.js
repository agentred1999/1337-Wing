import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import pool from '../database/pool.js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SALT_ROUNDS = 12;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;

    const userResult = await pool.query('SELECT id, username, email FROM users WHERE email = $1', [email]);

    // Always respond the same way whether or not the email exists,
    // so this endpoint can't be used to enumerate registered accounts.
    if (userResult.rows.length === 0) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const user = userResult.rows[0];
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await pool.query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    if (!resend) {
      console.error('RESEND_API_KEY not configured — cannot send password reset email');
      return res.status(500).json({ error: 'Password reset is temporarily unavailable' });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: user.email,
      subject: '1337 Wing — Password Reset',
      html: `
        <p>Someone requested a password reset for your 1337 Wing account.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
      `,
    });

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const tokenHash = hashToken(token);

    const resetResult = await pool.query(
      `SELECT id, user_id, expires_at, used FROM password_resets WHERE token_hash = $1`,
      [tokenHash]
    );

    if (resetResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    const reset = resetResult.rows[0];

    if (reset.used || new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, reset.user_id]);
    await pool.query('UPDATE password_resets SET used = true WHERE id = $1', [reset.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}
