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

// Interceptor para manejar errores globalmente
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar token expirado o no autorizado
    if (error.response?.status === 401) {
      // Limpiar estado de autenticación
      if (typeof window !== 'undefined') {
        // Solo en el cliente
        import('@/store/authStore').then(({ useAuthStore }) => {
          useAuthStore.getState().reset();
        });
        // Redirigir a login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
