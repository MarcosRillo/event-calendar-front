import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean; // Nuevo: indica si ya se hidrato desde localStorage
  // Solo acciones que modifican estado
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      hydrated: false,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      reset: () => set({ user: null, loading: false, error: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Solo persistir el usuario
      onRehydrateStorage: () => (state) => {
        // Marcar como hidratado cuando termine la rehidratación
        state?.setHydrated();
      },
    }
  )
);
