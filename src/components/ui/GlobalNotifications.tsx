'use client';

import { Snackbar, Alert, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useUIStore } from '@/store/uiStore';

export default function GlobalNotifications() {
  const { notifications, removeNotification } = useUIStore();

  // Only show the most recent notification
  const currentNotification = notifications[notifications.length - 1];

  const handleClose = (id: string) => {
    removeNotification(id);
  };

  if (!currentNotification) {
    return null;
  }

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }} // Account for app bar
    >
      <Alert
        severity={currentNotification.type}
        variant="filled"
        onClose={() => handleClose(currentNotification.id)}
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 500,
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
        action={
          !currentNotification.persistent ? undefined : (
            <IconButton
              size="small"
              color="inherit"
              onClick={() => handleClose(currentNotification.id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        <Box>
          {currentNotification.message}
          {notifications.length > 1 && (
            <Box
              component="span"
              sx={{
                ml: 1,
                px: 1,
                py: 0.5,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 1,
                fontSize: '0.75rem',
              }}
            >
              +{notifications.length - 1} más
            </Box>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
}

// Hook for easy notification usage
export const useNotifications = () => {
  const { addNotification } = useUIStore();

  return {
    success: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ message, type: 'success', ...options }),
      
    error: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ message, type: 'error', duration: 8000, ...options }),
      
    warning: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ message, type: 'warning', duration: 6000, ...options }),
      
    info: (message: string, options?: { duration?: number; persistent?: boolean }) =>
      addNotification({ message, type: 'info', ...options }),
  };
};
