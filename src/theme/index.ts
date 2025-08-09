import { createTheme, Theme } from '@mui/material/styles';

// Colores inspirados en Tucumán Turismo
const tucumanColors = {
  // Azul principal - institucional
  primary: {
    main: '#1565C0', // Azul institucional
    light: '#42A5F5',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },
  // Verde tucumano - naturaleza
  secondary: {
    main: '#2E7D32', // Verde naturaleza
    light: '#66BB6A',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  // Colores adicionales
  accent: {
    golden: '#FFB300', // Dorado para highlights
    orange: '#FF8A65', // Naranja cálido
    teal: '#26A69A', // Verde azulado
  },
  // Grises y neutros
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    mediumGray: '#E0E0E0',
    darkGray: '#424242',
    charcoal: '#212121',
  },
  // Estados y feedback
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
};

// Tipografía inspirada en el sitio de Tucumán
const tucumanTypography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  // Títulos principales
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  // Texto de cuerpo
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  // Elementos especiales
  subtitle1: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    letterSpacing: '0.03333em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08333em',
  },
};

// Espaciado y layout
const tucumanSpacing = {
  unit: 8, // Base unit for spacing
};

// Sombras inspiradas en las cards de Tucumán
// Array de sombras personalizado inspirado en el diseño de Tucumán (exactamente 25 elementos)
const tucumanShadows: ["none", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = [
  'none',
  '0px 2px 1px -1px rgba(21,101,192,0.2),0px 1px 1px 0px rgba(21,101,192,0.14),0px 1px 3px 0px rgba(21,101,192,0.12)',
  '0px 3px 1px -2px rgba(21,101,192,0.2),0px 2px 2px 0px rgba(21,101,192,0.14),0px 1px 5px 0px rgba(21,101,192,0.12)',
  '0px 3px 3px -2px rgba(21,101,192,0.2),0px 3px 4px 0px rgba(21,101,192,0.14),0px 1px 8px 0px rgba(21,101,192,0.12)',
  '0px 2px 4px -1px rgba(21,101,192,0.2),0px 4px 5px 0px rgba(21,101,192,0.14),0px 1px 10px 0px rgba(21,101,192,0.12)',
  '0px 3px 5px -1px rgba(21,101,192,0.2),0px 5px 8px 0px rgba(21,101,192,0.14),0px 1px 14px 0px rgba(21,101,192,0.12)',
  '0px 3px 5px -1px rgba(21,101,192,0.2),0px 6px 10px 0px rgba(21,101,192,0.14),0px 1px 18px 0px rgba(21,101,192,0.12)',
  '0px 4px 5px -2px rgba(21,101,192,0.2),0px 7px 10px 1px rgba(21,101,192,0.14),0px 2px 16px 1px rgba(21,101,192,0.12)',
  '0px 5px 5px -3px rgba(21,101,192,0.2),0px 8px 10px 1px rgba(21,101,192,0.14),0px 3px 14px 2px rgba(21,101,192,0.12)',
  '0px 5px 6px -3px rgba(21,101,192,0.2),0px 9px 12px 1px rgba(21,101,192,0.14),0px 3px 16px 2px rgba(21,101,192,0.12)',
  '0px 6px 6px -4px rgba(21,101,192,0.2),0px 10px 14px 1px rgba(21,101,192,0.14),0px 4px 18px 3px rgba(21,101,192,0.12)',
  '0px 6px 7px -4px rgba(21,101,192,0.2),0px 11px 15px 1px rgba(21,101,192,0.14),0px 4px 20px 3px rgba(21,101,192,0.12)',
  '0px 7px 8px -4px rgba(21,101,192,0.2),0px 12px 17px 2px rgba(21,101,192,0.14),0px 5px 22px 4px rgba(21,101,192,0.12)',
  '0px 7px 8px -4px rgba(21,101,192,0.2),0px 13px 19px 2px rgba(21,101,192,0.14),0px 5px 24px 4px rgba(21,101,192,0.12)',
  '0px 7px 9px -4px rgba(21,101,192,0.2),0px 14px 21px 2px rgba(21,101,192,0.14),0px 5px 26px 4px rgba(21,101,192,0.12)',
  '0px 8px 9px -5px rgba(21,101,192,0.2),0px 15px 22px 2px rgba(21,101,192,0.14),0px 6px 28px 5px rgba(21,101,192,0.12)',
  '0px 8px 10px -5px rgba(21,101,192,0.2),0px 16px 24px 2px rgba(21,101,192,0.14),0px 6px 30px 5px rgba(21,101,192,0.12)',
  '0px 8px 11px -5px rgba(21,101,192,0.2),0px 17px 26px 2px rgba(21,101,192,0.14),0px 6px 32px 5px rgba(21,101,192,0.12)',
  '0px 9px 11px -5px rgba(21,101,192,0.2),0px 18px 28px 2px rgba(21,101,192,0.14),0px 7px 34px 6px rgba(21,101,192,0.12)',
  '0px 9px 12px -6px rgba(21,101,192,0.2),0px 19px 29px 2px rgba(21,101,192,0.14),0px 7px 36px 6px rgba(21,101,192,0.12)',
  '0px 10px 13px -6px rgba(21,101,192,0.2),0px 20px 31px 3px rgba(21,101,192,0.14),0px 8px 38px 7px rgba(21,101,192,0.12)',
  '0px 10px 13px -6px rgba(21,101,192,0.2),0px 21px 33px 3px rgba(21,101,192,0.14),0px 8px 40px 7px rgba(21,101,192,0.12)',
  '0px 10px 14px -6px rgba(21,101,192,0.2),0px 22px 35px 3px rgba(21,101,192,0.14),0px 8px 42px 7px rgba(21,101,192,0.12)',
  '0px 11px 14px -7px rgba(21,101,192,0.2),0px 23px 36px 3px rgba(21,101,192,0.14),0px 9px 44px 8px rgba(21,101,192,0.12)',
  '0px 11px 15px -7px rgba(21,101,192,0.2),0px 24px 38px 3px rgba(21,101,192,0.14),0px 9px 46px 8px rgba(21,101,192,0.12)',
];

// Crear el tema principal
export const tucumanTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: tucumanColors.primary,
    secondary: tucumanColors.secondary,
    success: tucumanColors.success,
    error: tucumanColors.error,
    warning: tucumanColors.warning,
    info: tucumanColors.info,
    background: {
      default: tucumanColors.neutral.white,
      paper: tucumanColors.neutral.white,
    },
    text: {
      primary: tucumanColors.neutral.charcoal,
      secondary: tucumanColors.neutral.darkGray,
    },
    divider: tucumanColors.neutral.mediumGray,
    // Colores personalizados
    grey: {
      50: '#FAFAFA',
      100: tucumanColors.neutral.lightGray,
      200: tucumanColors.neutral.mediumGray,
      300: '#BDBDBD',
      400: '#9E9E9E',
      500: '#757575',
      600: '#616161',
      700: tucumanColors.neutral.darkGray,
      800: '#303030',
      900: tucumanColors.neutral.charcoal,
    },
  },
  typography: tucumanTypography,
  spacing: tucumanSpacing.unit,
  shadows: tucumanShadows,
  shape: {
    borderRadius: 8, // Border radius moderno
  },
  components: {
    // Card component - inspirado en las tarjetas de Tucumán
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    // Button component - estilo Tucumán
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(21, 101, 192, 0.04)',
          },
        },
      },
    },
    // AppBar - navegación estilo Tucumán
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: tucumanColors.primary.main,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    // Paper component
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
    // Chip component - para tags y categorías
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorSecondary: {
          backgroundColor: tucumanColors.secondary.light,
          color: tucumanColors.neutral.white,
        },
      },
    },
    // TextField - formularios
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tucumanColors.primary.light,
            },
          },
        },
      },
    },
    // Typography
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: tucumanColors.neutral.charcoal,
        },
        h2: {
          color: tucumanColors.neutral.charcoal,
        },
        h3: {
          color: tucumanColors.neutral.charcoal,
        },
        h4: {
          color: tucumanColors.neutral.charcoal,
        },
        h5: {
          color: tucumanColors.neutral.charcoal,
        },
        h6: {
          color: tucumanColors.neutral.charcoal,
        },
      },
    },
    // Table - para las DataTable
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            backgroundColor: tucumanColors.neutral.lightGray,
            '& .MuiTableCell-root': {
              fontWeight: 600,
              color: tucumanColors.neutral.charcoal,
            },
          },
        },
      },
    },
  },
});

// Tema oscuro (opcional)
export const tucumanDarkTheme: Theme = createTheme({
  ...tucumanTheme,
  palette: {
    ...tucumanTheme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
});

// Export del tema por defecto
export default tucumanTheme;

// Colores adicionales para uso directo en componentes
export const TucumanColors = tucumanColors;

// Utilidades de tema
export const getThemeColor = (color: keyof typeof tucumanColors) => tucumanColors[color];

// Breakpoints personalizados para responsive design
export const tucumanBreakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px', 
  lg: '1280px',
  xl: '1920px',
};
