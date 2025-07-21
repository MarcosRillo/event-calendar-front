import { useCallback, useEffect } from 'react';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, loading, error, hydrated, setUser, setLoading, setError, clearError, reset } = useAuthStore();

  const checkAuth = useCallback(async (force = false) => {
    // No hacer nada si no se ha hidratado aún
    if (!hydrated) return;
    
    // Si ya hay usuario guardado y no es forzado, no necesitamos verificar nuevamente
    if (user && !force) return;
    
    // Solo verificar si no está cargando
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosClient.get('/user');
      setUser(response.data.user);
    } catch {
      reset(); // Clear user data on auth failure
    } finally {
      setLoading(false);
    }
  }, [user, loading, hydrated, setUser, setLoading, setError, reset]);

  // Check auth automatically only if we have user data in storage (hydrated state)
  useEffect(() => {
    // Solo verificar automáticamente si ya tenemos un usuario en el storage
    // Esto evita requests innecesarios en páginas públicas como /login
    if (hydrated && user) {
      checkAuth();
    }
  }, [hydrated, user, checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosClient.post('/login', { email, password });
      setUser(response.data.user);
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Login failed'
        : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await axiosClient.post('/logout');
    } catch (error) {
      // Log error but don't throw - we still want to clear local state
      console.warn('Logout request failed:', error);
    } finally {
      reset(); // Always clear local state
    }
  }, [setLoading, setError, reset]);

  return {
    // Estado
    user,
    loading: loading || !hydrated, // Considerar loading si no está hidratado
    error,
    hydrated,
    isAuthenticated: !!user,
    
    // Acciones
    login,
    logout,
    checkAuth,
    clearError,
  };
}
