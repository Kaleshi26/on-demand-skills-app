// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuth } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On load: if a token exists, fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    async function boot() {
      try {
        if (token) {
          setAuth(token);
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        }
      } catch {
        // invalid token -> clear
        setAuth(null);
        setUser(null);
      } finally {
        setReady(true);
      }
    }
    boot();
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setAuth(data.token);
    setUser(data.user);
    return data;
  }

  async function signup({ name, email, password, role }) {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    setAuth(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    setAuth(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}