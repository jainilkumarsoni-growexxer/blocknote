// to import all individual exports into single authService Object
import * as authService from '../services/authService.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.js';


export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser(email, password);
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.loginUser(email, password);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const tokens = await authService.refreshTokens(refreshToken);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({ message: 'Tokens refreshed' });
  } catch (error) {
    if (error.message === 'INVALID_REFRESH_TOKEN') {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    next(error);
  }
};

export const logout = async (req, res) => {
  clearAuthCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

