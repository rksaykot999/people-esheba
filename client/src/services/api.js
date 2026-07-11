import axios from 'axios';

// যদি অ্যাপটি Vercel লাইভে (Production) থাকে তবে লাইভ ব্যাকএন্ড লিঙ্ক নিবে, 
// আর লোকালহোস্টে (Development) থাকলে Vite প্রক্সি ব্যবহারের জন্য '/api' নিবে।
const api = axios.create({
  baseURL: '/api',
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