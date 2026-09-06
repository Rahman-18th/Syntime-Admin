import axios from 'axios';

const apiUrl =
  import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    'VITE_API_URL is not configured',
  );
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type':
      'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        'syntime_admin_token',
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
);

export default api;