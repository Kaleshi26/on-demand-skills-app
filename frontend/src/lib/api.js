// frontend/src/lib/api.js
import axios from 'axios';

// Same-origin via Nginx proxy (frontend container proxies /api -> backend:5000)
const api = axios.create({ baseURL: '/api' });

export function setAuth(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
  }
}

const saved = localStorage.getItem('token');
if (saved) setAuth(saved);

export default api;