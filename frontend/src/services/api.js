import axios from 'axios';

const API = axios.create({
  baseURL: 'https://royalchef-production.up.railway.app/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT admin token into protected queries
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('restaurant_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically handle 401 Unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('restaurant_admin_token');
      localStorage.removeItem('restaurant_admin_info');

      if (
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;