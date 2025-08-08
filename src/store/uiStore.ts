'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
}

interface UIState {
  // Loading states
  isGlobalLoading: boolean;
  loadingMessage?: string;
  
  // Page loading states
  pageLoading: Record<string, boolean>;
  
  // Notifications
  notifications: Notification[];
  
  // Theme preferences
  darkMode: boolean;
  sidebarCollapsed: boolean;
  
  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setPageLoading: (page: string, loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      isGlobalLoading: false,
      loadingMessage: undefined,
      pageLoading: {},
      notifications: [],
      darkMode: false,
      sidebarCollapsed: false,

      // Actions
      setGlobalLoading: (loading, message) => 
        set({ isGlobalLoading: loading, loadingMessage: message }),

      setPageLoading: (page, loading) =>
        set((state) => ({
          pageLoading: {
            ...state.pageLoading,
            [page]: loading,
          }
        })),

      addNotification: (notification) => {
        const id = crypto.randomUUID();
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));

        // Auto remove after duration (unless persistent)
        if (!notification.persistent && notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),

      clearNotifications: () => set({ notifications: [] }),

      toggleDarkMode: () => 
        set((state) => ({ darkMode: !state.darkMode })),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
