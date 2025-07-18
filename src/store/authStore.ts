import { create } from 'zustand';
import { AxiosError } from 'axios';
import axiosClient from '@/lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string | null;
  is_super_admin: boolean;
  is_organization_admin: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosClient.post('/login', { email, password });
      
      set({ 
        user: response.data.user, 
        loading: false, 
        isAuthenticated: true,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Login failed'
        : 'Login failed';
      set({ 
        loading: false, 
        error: errorMessage,
        isAuthenticated: false 
      });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axiosClient.post('/logout');
      
      set({ 
        user: null, 
        loading: false, 
        isAuthenticated: false, 
        error: null 
      });
    } catch {
      // Incluso si el logout falla en el servidor, limpiamos el estado local
      set({ 
        user: null, 
        loading: false, 
        isAuthenticated: false, 
        error: null 
      });
    }
  },

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosClient.get('/user');
      
      set({ 
        user: response.data.user, 
        loading: false, 
        isAuthenticated: true,
        error: null
      });
    } catch {
      set({ 
        user: null, 
        loading: false, 
        isAuthenticated: false, 
        error: null 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
