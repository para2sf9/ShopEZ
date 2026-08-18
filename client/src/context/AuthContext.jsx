import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);
const USER_KEY = 'stocktrade_user';
const TOKEN_KEY = 'stocktrade_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null);
  }, []);

  const persist = useCallback(({ token, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(nextUser)); setUser(nextUser);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials); persist(data.data); return data.data.user;
  }, [persist]);

  const register = useCallback(async (form) => {
    const { data } = await api.post('/auth/register', form); persist(data.data); return data.data.user;
  }, [persist]);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem(USER_KEY, JSON.stringify(data.data)); setUser(data.data);
    } catch { logout(); }
  }, [logout]);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [refreshUser, logout]);

  const value = useMemo(() => ({ user, setUser, loading, login, register, logout, refreshUser, isAdmin: user?.role === 'ADMIN' }), [user, loading, login, register, logout, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
