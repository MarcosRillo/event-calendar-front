import { create } from 'zustand';
import { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  // Solo acciones que modifican estado
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ user: null, loading: false, error: null }),
}));
