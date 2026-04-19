import { NODE_ENV } from '../config/env.js';

const isProduction = NODE_ENV === 'production';

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none",
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none",
  };

  res.clearCookie('accessToken', { ...cookieOptions, path: '/' });
  res.clearCookie('refreshToken', { ...cookieOptions, path: '/api/auth/refresh' });
};
