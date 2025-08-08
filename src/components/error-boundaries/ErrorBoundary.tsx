'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert, Container } from '@mui/material';
import { Refresh as RefreshIcon, Error as ErrorIcon } from '@mui/icons-material';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log to our structured logging system
    logger.error(`ErrorBoundary caught an error: ${error.message}`);

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, etc.
      console.error('Production error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
              
              <Typography variant="h4" gutterBottom color="error">
                ¡Ups! Algo salió mal
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y está trabajando para solucionarlo.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left', width: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Error Details (Development):
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '0.75rem',
                    mb: 1 
                  }}>
                    {this.state.error.message}
                  </Typography>
                  {this.state.error.stack && (
                    <Typography variant="body2" component="pre" sx={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '0.7rem',
                      opacity: 0.8 
                    }}>
                      {this.state.error.stack}
                    </Typography>
                  )}
                </Alert>
              )}

              <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleReset}
                  startIcon={<RefreshIcon />}
                >
                  Intentar Nuevamente
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={this.handleReload}
                  startIcon={<RefreshIcon />}
                >
                  Recargar Página
                </Button>
              </Box>

              <Typography variant="caption" sx={{ mt: 3, opacity: 0.7 }}>
                Si el problema persiste, contacta a soporte técnico
              </Typography>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
