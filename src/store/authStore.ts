import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  // agrega más campos según tu modelo User
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
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

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/login', { email, password });
      set({ user: response.data.user, loading: false });
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Login failed'
        : 'Login failed';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post('/api/logout');
      set({ user: null, loading: false });
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Logout failed'
        : 'Logout failed';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/user');
      set({ user: response.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
