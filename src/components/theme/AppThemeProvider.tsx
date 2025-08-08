'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useUIStore } from '@/store/uiStore';
import { useMemo } from 'react';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  const { darkMode } = useUIStore();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
          },
          secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
          },
          success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
          },
          error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
          },
          warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
          },
          info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
          },
          background: {
            default: darkMode ? '#121212' : '#fafafa',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: darkMode ? '#ffffff' : '#000000',
            secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              contained: {
                boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.15)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(0,0,0,0.3)' 
                  : '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: darkMode 
                    ? '0 4px 16px rgba(0,0,0,0.4)' 
                    : '0 4px 16px rgba(0,0,0,0.15)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
