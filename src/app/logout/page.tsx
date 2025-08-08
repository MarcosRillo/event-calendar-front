"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    try {
      await logout();
      logger.info('User logout successful');
      router.push('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'primary.light',
          backgroundColor: 'background.paper',
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Header with Logo */}
          <Stack spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                opacity: 0.9,
              }}
            >
              <Image
                src="/globe.svg"
                alt="Logo Ente de Turismo Tucumán"
                width={32}
                height={32}
              />
            </Avatar>
            
            <Stack spacing={0.5} alignItems="center">
              <Typography
                variant="h5"
                component="h1"
                fontWeight="bold"
                color="primary.main"
                textAlign="center"
              >
                Cerrar sesión
              </Typography>
              <Typography
                variant="caption"
                color="primary.dark"
                fontWeight="medium"
                textAlign="center"
              >
                Ente de Turismo de Tucumán
              </Typography>
            </Stack>
          </Stack>

          {/* Content */}
          <Box textAlign="center">
            <Typography variant="body1" color="text.secondary">
              ¿Estás seguro que deseas cerrar sesión?
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleLogout}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LogoutIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}