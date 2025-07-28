'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  type?: 'warning' | 'error' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const iconMap = {
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
};

const colorMap = {
  warning: 'warning.main',
  error: 'error.main',
  info: 'info.main',
  success: 'success.main',
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  maxWidth = 'sm',
}: ConfirmDialogProps) {
  const IconComponent = iconMap[type];

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in confirm action:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 1,
        }}
      >
        <IconComponent 
          sx={{ 
            color: colorMap[type],
            fontSize: 28,
          }} 
        />
        <Typography variant="h6" component="span">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color={type === 'error' ? 'error' : 'primary'}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? 'Procesando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
