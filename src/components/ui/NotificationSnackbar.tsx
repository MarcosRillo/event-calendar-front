'use client';

import { 
  Snackbar, 
  Alert, 
  AlertColor,
  Slide,
  SlideProps,
  IconButton,
  AlertTitle,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { forwardRef, SyntheticEvent } from 'react';

// Slide transition component
const SlideTransition = forwardRef<HTMLDivElement, SlideProps>(
  function SlideTransition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export interface NotificationData {
  id: string;
  message: string;
  type: AlertColor;
  title?: string;
  autoHideDuration?: number;
  action?: React.ReactNode;
  persistent?: boolean;
}

export interface NotificationSnackbarProps {
  notification: NotificationData | null;
  open: boolean;
  onClose: (event?: SyntheticEvent | Event, reason?: string) => void;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

export default function NotificationSnackbar({
  notification,
  open,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
}: NotificationSnackbarProps) {
  if (!notification) return null;

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    // Prevent closing on clickaway if notification is persistent
    if (reason === 'clickaway' && notification.persistent) {
      return;
    }
    onClose(event, reason);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={notification.persistent ? null : (notification.autoHideDuration || 6000)}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0,
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        variant="filled"
        action={
          <>
            {notification.action}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
        sx={{
          minWidth: 300,
          maxWidth: 500,
          '& .MuiAlert-message': {
            padding: '8px 0',
          },
        }}
      >
        {notification.title && (
          <AlertTitle>{notification.title}</AlertTitle>
        )}
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

// Notification types for convenience
export const createNotification = {
  success: (message: string, options?: Partial<NotificationData>): NotificationData => ({
    id: Date.now().toString(),
    message,
    type: 'success',
    ...options,
  }),
  
  error: (message: string, options?: Partial<NotificationData>): NotificationData => ({
    id: Date.now().toString(),
    message,
    type: 'error',
    persistent: true, // Errors should be persistent by default
    ...options,
  }),
  
  warning: (message: string, options?: Partial<NotificationData>): NotificationData => ({
    id: Date.now().toString(),
    message,
    type: 'warning',
    ...options,
  }),
  
  info: (message: string, options?: Partial<NotificationData>): NotificationData => ({
    id: Date.now().toString(),
    message,
    type: 'info',
    ...options,
  }),
};

// Hook for managing notifications queue
import { useState, useCallback } from 'react';

export interface UseNotificationsReturn {
  notification: NotificationData | null;
  open: boolean;
  showNotification: (notification: NotificationData) => void;
  showSuccess: (message: string, options?: Partial<NotificationData>) => void;
  showError: (message: string, options?: Partial<NotificationData>) => void;
  showWarning: (message: string, options?: Partial<NotificationData>) => void;
  showInfo: (message: string, options?: Partial<NotificationData>) => void;
  closeNotification: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [open, setOpen] = useState(false);

  const currentNotification = notifications[0] || null;

  const showNotification = useCallback((notification: NotificationData) => {
    setNotifications(prev => [...prev, notification]);
    if (!open) {
      setOpen(true);
    }
  }, [open]);

  const closeNotification = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
      if (notifications.length > 1) {
        setOpen(true);
      }
    }, 200); // Wait for transition to complete
  }, [notifications.length]);

  const showSuccess = useCallback((message: string, options?: Partial<NotificationData>) => {
    showNotification(createNotification.success(message, options));
  }, [showNotification]);

  const showError = useCallback((message: string, options?: Partial<NotificationData>) => {
    showNotification(createNotification.error(message, options));
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: Partial<NotificationData>) => {
    showNotification(createNotification.warning(message, options));
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: Partial<NotificationData>) => {
    showNotification(createNotification.info(message, options));
  }, [showNotification]);

  return {
    notification: currentNotification,
    open,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
  };
}
