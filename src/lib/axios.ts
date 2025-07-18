import axios from 'axios';

// Crear instancia de axios con configuración global
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Interceptor para manejar errores globalmente si es necesario
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podríamos manejar errores globales como tokens expirados
    return Promise.reject(error);
  }
);

export default axiosClient;
