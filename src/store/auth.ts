import { create } from 'zustand';

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
  fetchUser: () => Promise<void>;
}


export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }
      await getUser(set);
    } catch (e) {
      if (e instanceof Error) {
        set({ error: e.message, user: null });
      } else {
        set({ error: 'Unknown error', user: null });
      }
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      set({ user: null });
    } catch (e) {
      if (e instanceof Error) {
        set({ error: e.message });
      } else {
        set({ error: 'Unknown error' });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    await getUser(set);
  },
}));

type SetState = (partial: Partial<AuthState>) => void;

async function getUser(set: SetState) {
  try {
    const res = await fetch('http://localhost:8000/api/user', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('No authenticated user');
    const user = await res.json();
    set({ user, error: null });
  } catch (e) {
    if (e instanceof Error) {
      set({ user: null, error: e.message });
    } else {
      set({ user: null, error: 'Unknown error' });
    }
  }
}
