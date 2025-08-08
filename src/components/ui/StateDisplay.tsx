'use client';

import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import { 
  ErrorOutline, 
  HelpOutline, 
  CheckCircle, 
  Refresh,
  Home
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface StateDisplayProps {
  state: 'loading' | 'error' | 'empty' | 'success';
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  fullHeight?: boolean;
}

const stateConfig = {
  loading: {
    icon: <CircularProgress size={60} />,
    title: 'Cargando...',
    message: 'Por favor espera mientras procesamos tu solicitud.',
    color: 'primary' as const,
  },
  error: {
    icon: <ErrorOutline color="error" sx={{ fontSize: 60 }} />,
    title: 'Error',
    message: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
    color: 'error' as const,
  },
  empty: {
    icon: <HelpOutline color="disabled" sx={{ fontSize: 60 }} />,
    title: 'Sin datos',
    message: 'No hay información disponible en este momento.',
    color: 'text.secondary' as const,
  },
  success: {
    icon: <CheckCircle color="success" sx={{ fontSize: 60 }} />,
    title: '¡Éxito!',
    message: 'La operación se completó correctamente.',
    color: 'success' as const,
  },
};

export default function StateDisplay({ 
  state, 
  title, 
  message, 
  action, 
  icon,
  showHomeButton = false,
  fullHeight = true
}: StateDisplayProps) {
  const router = useRouter();
  const config = stateConfig[state];
  
  const handleHomeClick = () => {
    router.push('/dashboard');
  };

  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={fullHeight ? 400 : 200}
      textAlign="center"
      p={3}
    >
      {/* Icon */}
      <Box mb={2}>
        {icon || config.icon}
      </Box>

      {/* Title */}
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ color: config.color }}
      >
        {title || config.title}
      </Typography>

      {/* Message */}
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {message || config.message}
      </Typography>

      {/* Actions */}
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        {action && (
          <Button
            variant="contained"
            color={config.color === 'text.secondary' ? 'primary' : config.color}
            onClick={action.onClick}
            startIcon={state === 'error' ? <Refresh /> : undefined}
          >
            {action.label}
          </Button>
        )}

        {showHomeButton && (
          <Button
            variant="outlined"
            onClick={handleHomeClick}
            startIcon={<Home />}
          >
            Ir al Dashboard
          </Button>
        )}
      </Box>

      {/* Loading specific content */}
      {state === 'loading' && (
        <Typography 
          variant="caption" 
          sx={{ mt: 2, opacity: 0.7 }}
        >
          Esto puede tomar unos segundos...
        </Typography>
      )}
    </Box>
  );

  // For non-loading states, wrap in Paper for better visual hierarchy
  if (state !== 'loading') {
    return (
      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        {content}
      </Paper>
    );
  }

  return content;
}

// Convenience components for common states
export const LoadingState = (props: Omit<StateDisplayProps, 'state'>) => (
  <StateDisplay {...props} state="loading" />
);

export const ErrorState = (props: Omit<StateDisplayProps, 'state'>) => (
  <StateDisplay {...props} state="error" showHomeButton />
);

export const EmptyState = (props: Omit<StateDisplayProps, 'state'>) => (
  <StateDisplay {...props} state="empty" />
);

export const SuccessState = (props: Omit<StateDisplayProps, 'state'>) => (
  <StateDisplay {...props} state="success" />
);
