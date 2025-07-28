'use client';

import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  severity?: 'error' | 'warning' | 'info';
}

export default function ErrorDisplay({ 
  title = 'Error',
  message, 
  onRetry,
  retryLabel = 'Reintentar',
  severity = 'error'
}: ErrorDisplayProps) {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Alert 
        severity={severity}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={onRetry}
            >
              {retryLabel}
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}
