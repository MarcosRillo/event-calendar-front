import { useCallback } from 'react';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, loading, error, setUser, setLoading, setError, clearError, reset } = useAuthStore();

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

  const checkAuth = useCallback(async () => {
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
  }, [setUser, setLoading, setError, reset]);

  return {
    // Estado
    user,
    loading,
    error,
    isAuthenticated: !!user,
    
    // Acciones
    login,
    logout,
    checkAuth,
    clearError,
  };
}
