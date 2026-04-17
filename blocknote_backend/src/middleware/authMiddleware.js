
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }

  req.userId = payload.userId;
  next();
};