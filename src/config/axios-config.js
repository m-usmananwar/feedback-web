import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://feedback-backend.local/api',
  timeout: 5000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

export default axiosInstance;
