import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;
const isMockToken = (token) => typeof token === 'string' && token.startsWith('mock-token-');
const isMockSession = () => {
  if (!storage) return false;
  return isMockToken(storage.getItem('yaydoom_token'));
};

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = storage?.getItem('yaydoom_token');
    if (token && !isMockToken(token)) {
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
    if (error.response?.status === 401 && !isMockSession()) {
      // Token expired or invalid - clear auth and redirect
      storage?.removeItem('yaydoom_token');
      storage?.removeItem('yaydoom_user');
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
