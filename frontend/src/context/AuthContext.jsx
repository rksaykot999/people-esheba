import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('pes_user')); } catch { return null; } });
  const [token,   setToken]   = useState(() => localStorage.getItem('pes_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.data);
        localStorage.setItem('pes_user', JSON.stringify(data.data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const login = useCallback(async (creds) => {
    const { data } = await api.post('/auth/login', creds);
    const { token: jwt, user: u } = data.data;
    localStorage.setItem('pes_token', jwt);
    localStorage.setItem('pes_user', JSON.stringify(u));
    setToken(jwt); setUser(u);
    return u;
  }, []);

  const register = useCallback(async (body) => {
    const { data } = await api.post('/auth/register', body);
    const { token: jwt, user: u } = data.data;
    localStorage.setItem('pes_token', jwt);
    localStorage.setItem('pes_user', JSON.stringify(u));
    setToken(jwt); setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pes_token');
    localStorage.removeItem('pes_user');
    setToken(null); setUser(null);
  }, []);

  const updateUser = useCallback((u) => {
    setUser(u);
    localStorage.setItem('pes_user', JSON.stringify(u));
  }, []);

  return (
    <AuthCtx.Provider value={{
      user, token, loading,
      isAuth: !!token && !!user,
      isAdmin: user?.role === 'admin',
      login, register, logout, updateUser,
    }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
