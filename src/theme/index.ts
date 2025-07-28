import { createTheme } from '@mui/material/styles';

// Event Calendar Custom Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',      // Azul Event Calendar
      light: '#42A5F5',     // Azul claro
      dark: '#0D47A1',      // Azul oscuro
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF7043',      // Naranja para acciones
      light: '#FFAB91',     // Naranja claro
      dark: '#D84315',      // Naranja oscuro
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#F57C00',
      light: '#FFB74D',
      dark: '#E65100',
    },
    info: {
      main: '#1976D2',
      light: '#64B5F6',
      dark: '#1565C0',
    },
    success: {
      main: '#388E3C',
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#F5F5F5',    // Gris claro para fondo general
      paper: '#FFFFFF',      // Blanco para cards/modals
    },
    text: {
      primary: '#212121',    // Texto principal
      secondary: '#757575',  // Texto secundario
      disabled: '#BDBDBD',   // Texto deshabilitado
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',     // 40px
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',       // 32px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',    // 28px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',     // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',    // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',       // 16px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',       // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',       // 16px
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: 'none',  // No uppercase automático
    },
    caption: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 400,
      lineHeight: 2,
      textTransform: 'uppercase',
    },
  },
  spacing: 8, // Base unit 8px
  shape: {
    borderRadius: 8, // Bordes redondeados estándar
  },
  components: {
    // AppBar personalizado
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1565C0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    // Drawer (Sidebar)
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B', // Gris azulado oscuro
          color: '#F1F5F9',           // Texto claro
          borderRight: 'none',
          '& .MuiListItemIcon-root': {
            color: '#94A3B8',          // Iconos gris claro
          },
          '& .MuiListItemButton-root': {
            borderRadius: '8px',
            margin: '2px 8px',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              '& .MuiListItemIcon-root': {
                color: '#60A5FA',
              },
              '& .MuiListItemText-primary': {
                color: '#FFFFFF',
                fontWeight: 600,
              },
            },
          },
        },
      },
    },
    // Botones
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    // Cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    // Chip (para badges de estado)
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
