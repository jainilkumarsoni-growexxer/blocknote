import api from './api';

export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data; // { message, user }
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // Cookies are set automatically by browser via Set-Cookie header
  return response.data; // { message, user }
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

export const getCurrentUser = async () => {
  // You'll need a /auth/me endpoint on backend that returns user info from access token
  const response = await api.get('/auth/me');
  return response.data;
};