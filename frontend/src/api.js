import axios from 'axios';

// Backend address. Change VITE_API_URL in frontend/.env if the server isn't on localhost:5000.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' });

// Send the login token with every request (set after a successful login).
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A readable message for alerts, even when the server is down.
export function errorMessage(err) {
  return err.response?.data?.message || 'Cannot reach the server. Is the backend running?';
}

export default api;
