import axios from 'axios';

// Vercel Production-এর জন্য লাইভ ব্যাকএন্ড URL
// Local Development-এর জন্য '/api' (Vite Proxy)
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL 
    : '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pes_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pes_token');
      localStorage.removeItem('pes_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(err);
  }
);

export default api;