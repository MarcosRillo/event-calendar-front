import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;  // AÑADIDO: Para almacenar el token
  loading: boolean;
  error: string | null;
  hydrated: boolean; // Nuevo: indica si ya se hidrato desde localStorage
  // Solo acciones que modifican estado
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;  // AÑADIDO: Para manejar el token
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
      token: null,  // AÑADIDO
      loading: false,
      error: null,
      hydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),  // AÑADIDO
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      reset: () => set({ user: null, token: null, loading: false, error: null }),  // MODIFICADO
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }), // MODIFICADO: Persistir token también
      onRehydrateStorage: () => (state) => {
        // Marcar como hidratado cuando termine la rehidratación
        state?.setHydrated();
      },
    }
  )
);
