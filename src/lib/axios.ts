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

// Función para obtener el token del storage de forma segura
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('auth-storage');
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    const token = parsed.state?.token;
    
    // Validar que el token existe y tiene formato JWT válido
    if (token && typeof token === 'string' && token.split('.').length === 3) {
      // Opcional: Verificar que el token no esté expirado
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        
        // Si el token tiene exp y está expirado, no lo devolvemos
        if (payload.exp && payload.exp < now) {
          console.warn('Token expired, removing from storage');
          localStorage.removeItem('auth-storage');
          return null;
        }
        
        return token;
      } catch {
        // Si no se puede parsear el token, lo consideramos válido por retrocompatibilidad
        return token;
      }
    }
  } catch (error) {
    console.warn('Token parsing error:', error);
    // Limpiar datos corruptos automáticamente
    localStorage.removeItem('auth-storage');
  }
  return null;
};

// Interceptor para obtener CSRF token y añadir Bearer token
axiosClient.interceptors.request.use(
  async (config) => {
    // Para métodos que modifican datos, obtener CSRF token primero
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      await getCsrfToken();
    }
    
    // AÑADIDO: Agregar token de autenticación si está disponible
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        // Limpiar localStorage
        localStorage.removeItem('auth-storage');
        
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
