'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Button,
  Box,
  Chip,
} from '@mui/material';
import {
  People,
  Business,
  Event,
  Assignment,
} from '@mui/icons-material';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import type { SuperAdminDashboardData, DashboardResponse } from '@/types';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<SuperAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosClient.get<DashboardResponse>('/super-admin/dashboard');
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Error fetching dashboard data'
        : 'Error fetching dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Cargando dashboard..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error al cargar el dashboard"
        message={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  if (!dashboardData) {
    return (
      <ErrorDisplay
        title="Sin datos"
        message="No hay datos disponibles para mostrar"
        severity="warning"
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard Super Admin
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido, {dashboardData.user.name}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3, 
          mb: 4 
        }}
      >
        <StatsCard
          title="Total de Usuarios"
          value={dashboardData.stats.total_users}
          icon={<People />}
          color="primary"
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Organizaciones"
          value={dashboardData.stats.total_organizations}
          icon={<Business />}
          color="success"
          trend={{
            value: 8,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Total de Eventos"
          value={dashboardData.stats.total_events}
          icon={<Event />}
          color="secondary"
          trend={{
            value: 5,
            isPositive: false,
          }}
        />
      </Box>

      {/* Recent Activity */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            lg: 'repeat(2, 1fr)' 
          }, 
          gap: 3, 
          mb: 4 
        }}
      >
        {/* Recent Users */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Usuarios Recientes
            </Typography>
            <List>
              {dashboardData.stats.recent_users.map((user) => (
                <ListItem key={user.id} divider>
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Chip
                      label={user.role}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Recent Organizations */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Organizaciones Recientes
            </Typography>
            <List>
              {dashboardData.stats.recent_organizations.map((org) => (
                <ListItem key={org.id} divider>
                  <ListItemText
                    primary={org.name}
                    secondary={org.slug}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(org.created_at).toLocaleDateString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Action Buttons */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Assignment />}
              onClick={() => router.push('/super-admin/organization-requests')}
            >
              Solicitudes de Organizaciones
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<People />}
              onClick={() => router.push('/super-admin/users')}
            >
              Gestionar Usuarios
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<Business />}
              onClick={() => router.push('/super-admin/organizations')}
            >
              Gestionar Organizaciones
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Event />}
              onClick={() => router.push('/super-admin/events')}
            >
              Gestionar Eventos
            </Button>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
