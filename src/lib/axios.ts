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

// Función para obtener el CSRF token
const getCsrfToken = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Error obteniendo CSRF token:', error);
  }
};

// Interceptor para obtener CSRF token antes de peticiones protegidas
axiosClient.interceptors.request.use(
  async (config) => {
    // Para métodos que modifican datos, obtener CSRF token primero
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      await getCsrfToken();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
