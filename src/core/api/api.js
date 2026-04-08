import axios from 'axios';
import { clearStoredSession, getStoredSessionToken } from '../session';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://yaaydoom-backend-latest.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStoredSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect
      clearStoredSession();
      const browserWindow = typeof globalThis !== 'undefined' ? globalThis.window : undefined;
      if (browserWindow) {
        browserWindow.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export as both default and named export
export { api };

// Generic CRUD methods
export const apiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url),
};

export default api;
