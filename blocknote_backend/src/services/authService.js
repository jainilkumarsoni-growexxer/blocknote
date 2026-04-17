import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';

export const registerUser = async (email, password) => {
  const existing = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('EMAIL_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO "user" (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, hashedPassword]
  );
  return result.rows[0];
};

export const loginUser = async (email, password) => {
  const result = await pool.query('SELECT id, email, password_hash FROM "user" WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const tokens = generateTokens(user.id);
  return { user: { id: user.id, email: user.email }, tokens };
};

export const refreshTokens = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  // Optionally verify user still exists
  const result = await pool.query('SELECT id FROM "user" WHERE id = $1', [payload.userId]);
  if (result.rows.length === 0) {
    throw new Error('USER_NOT_FOUND');
  }

  const tokens = generateTokens(payload.userId);
  return tokens;
};