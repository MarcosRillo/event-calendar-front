'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '@/theme';
import AppThemeProvider from './theme/AppThemeProvider';
import GlobalNotifications from './ui/GlobalNotifications';
import { PWAInstallPrompt, ConnectivityStatus } from './pwa';
import ErrorBoundary from './error-boundaries/ErrorBoundary';
import { PerformanceMonitor } from '../lib/performance/PerformanceMonitor';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Provider principal que envuelve toda la aplicación con los contextos necesarios
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <AppThemeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          
          {/* Componentes globales */}
          <PerformanceMonitor />
          <GlobalNotifications />
          <PWAInstallPrompt />
          <ConnectivityStatus />
        </ThemeProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
}
