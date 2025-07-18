import { create } from 'zustand';
import axios from 'axios';

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

// Configuración global de axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/login', { email, password });
      
      set({ 
        user: response.data.user, 
        loading: false, 
        isAuthenticated: true,
        error: null
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
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
      await axios.post('/api/logout');
      
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
      const response = await axios.get('/api/user');
      
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
