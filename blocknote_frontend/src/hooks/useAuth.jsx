

import { useState, useEffect, useContext, createContext } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from '../services/authService';

const AuthContext = createContext();
const AUTH_STORAGE_KEY = 'blocknote_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) {
          setUser(parsed.user);
        }
      }
    } catch (error) {
      // Invalid storage, ignore
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await apiLogin(credentials.email, credentials.password);
      setUser(data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: data.user }));
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await apiRegister(credentials.email, credentials.password);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);