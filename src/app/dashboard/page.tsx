"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,  
  CardContent,
  Typography,
  Button,
  Avatar,
  Alert,
  Container,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';
import { TucumanDesignDemo } from '@/components/demo/TucumanDesignDemo';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTucumanDemo, setShowTucumanDemo] = useState(false);
  const router = useRouter();
  const { logout, user } = useAuth();

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

  const handleGoToSuperAdmin = () => {
    router.push('/super-admin');
  };

  // Si se está mostrando la demo, renderizar solo la demo
  if (showTucumanDemo) {
    return (
      <Box>
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 1300,
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => setShowTucumanDemo(false)}
            sx={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.9)',
              },
            }}
          >
            Volver al Dashboard
          </Button>
        </Box>
        <TucumanDesignDemo />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'grey.50',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* Header con Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                boxShadow: 3,
              }}
            >
              <Image
                src="/globe.svg"
                alt="Logo Ente de Turismo Tucumán"
                width={48}
                height={48}
              />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textAlign: 'center',
              }}
            >
              Panel de Eventos
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Ente de Turismo de Tucumán
            </Typography>
            {user && (
              <Typography variant="body2" color="text.secondary">
                Bienvenido, {user.name}
              </Typography>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ mb: 3 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <EventIcon color="primary" />
                  <Typography variant="h6">
                    Sistema de Gestión de Eventos
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  Bienvenido al panel de eventos. Aquí podrás gestionar y visualizar 
                  los eventos del Ente de Turismo de Tucumán.
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Action Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            <Card sx={{ cursor: 'pointer' }} onClick={handleGoToSuperAdmin}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <DashboardIcon 
                  sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} 
                />
                <Typography variant="h6" gutterBottom>
                  Panel de Administración
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accede al panel completo de administración del sistema
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ cursor: 'pointer' }} onClick={() => setShowTucumanDemo(true)}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PaletteIcon 
                  sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} 
                />
                <Typography variant="h6" gutterBottom>
                  Demo Diseño Tucumán
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explora el nuevo diseño inspirado en Tucumán Turismo
                </Typography>
                <Chip 
                  label="¡Nuevo!" 
                  size="small" 
                  color="secondary" 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <LogoutIcon 
                  sx={{ fontSize: 48, color: 'error.main', mb: 2 }} 
                />
                <Typography variant="h6" gutterBottom>
                  Cerrar Sesión
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Salir del sistema de forma segura
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </Button>
              </CardContent>
            </Card>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
