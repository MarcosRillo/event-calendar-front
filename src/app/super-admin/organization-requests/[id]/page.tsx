"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axiosClient from '@/lib/axios';

interface OrganizationRequest {
  id: number;
  email: string;
  token: string;
  status_id: number;
  corrections_notes?: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  updated_by?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  organization_id?: number;
  rejected_reason?: string;
  status: {
    id: number;
    name: string;
  };
  organization_data?: {
    name: string;
    slug: string;
    website_url?: string;
    address: string;
    phone: string;
    email: string;
  };
  admin_data?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

type ActionType = 'approve' | 'reject' | 'request_corrections';

export default function OrganizationRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [request, setRequest] = useState<OrganizationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('approve');
  const [actionMessage, setActionMessage] = useState('');
  const [correctionsNotes, setCorrectionsNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get(`/super-admin/organization-requests/${requestId}`);
      setRequest(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la solicitud');
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const getStatusColor = (status: string): 'warning' | 'success' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'corrections_requested':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'corrections_requested':
        return 'Correcciones Solicitadas';
      default:
        return status;
    }
  };

  const openActionModal = (type: ActionType) => {
    setActionType(type);
    setActionMessage('');
    setCorrectionsNotes('');
    setActionError(null);
    setShowActionModal(true);
  };

  const handleAction = async () => {
    if (actionType === 'request_corrections' && !correctionsNotes.trim()) {
      setActionError('Las notas de corrección son requeridas');
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const endpoint = `/super-admin/organization-requests/${requestId}/${actionType}`;
      const data: Record<string, string> = {};

      if (actionMessage.trim()) {
        data.message = actionMessage;
      }

      if (actionType === 'request_corrections' && correctionsNotes.trim()) {
        data.corrections_notes = correctionsNotes;
      }

      await axiosClient.post(endpoint, data);
      setShowActionModal(false);
      await fetchRequest();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al procesar la acción');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !request) {
    return (
      <DashboardLayout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Solicitud no encontrada'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/super-admin/organization-requests')}
        >
          Volver a Solicitudes
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Tooltip title="Volver a Solicitudes">
            <IconButton onClick={() => router.push('/super-admin/organization-requests')}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="h1">
            Detalle de Solicitud
          </Typography>
          <Chip
            label={getStatusLabel(request.status.name)}
            color={getStatusColor(request.status.name)}
            variant="filled"
          />
        </Stack>
        <Typography variant="body1" color="text.secondary">
          ID: {request.id} • Solicitud de organización
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        {/* Main Content */}
        <Stack spacing={3}>
          {/* Organization Info */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <BusinessIcon color="primary" />
                <Typography variant="h6">
                  Información de la Organización
                </Typography>
              </Stack>

              {request.organization_data ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Nombre
                    </Typography>
                    <Typography variant="body1">
                      {request.organization_data.name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Slug
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                      {request.organization_data.slug}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {request.organization_data.email}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Teléfono
                    </Typography>
                    <Typography variant="body1">
                      {request.organization_data.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Dirección
                    </Typography>
                    <Typography variant="body1">
                      {request.organization_data.address}
                    </Typography>
                  </Box>

                  {request.organization_data.website_url && (
                    <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <WebsiteIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                        Sitio Web
                      </Typography>
                      <Link
                        href={request.organization_data.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                      >
                        {request.organization_data.website_url}
                      </Link>
                    </Box>
                  )}
                </Box>
              ) : (
                <Alert severity="info">
                  No hay datos de organización disponibles
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Admin Info */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">
                  Información del Administrador
                </Typography>
              </Stack>

              {request.admin_data ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Nombre
                    </Typography>
                    <Typography variant="body1">
                      {request.admin_data.first_name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Apellido
                    </Typography>
                    <Typography variant="body1">
                      {request.admin_data.last_name}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {request.admin_data.email}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info">
                  No hay datos del administrador disponibles
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Corrections Notes */}
          {request.corrections_notes && (
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <EditIcon color="warning" />
                  <Typography variant="h6" color="warning.main">
                    Correcciones Solicitadas
                  </Typography>
                </Stack>
                <Alert severity="warning">
                  {request.corrections_notes}
                </Alert>
              </CardContent>
            </Card>
          )}
        </Stack>

        {/* Sidebar */}
        <Stack spacing={3}>
          {/* Actions */}
          {request.status.name === 'pending' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Acciones
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={() => openActionModal('approve')}
                    fullWidth
                  >
                    Aprobar Solicitud
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<EditIcon />}
                    onClick={() => openActionModal('request_corrections')}
                    fullWidth
                  >
                    Solicitar Correcciones
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => openActionModal('reject')}
                    fullWidth
                  >
                    Rechazar Solicitud
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Request Details */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalles de la Solicitud
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estado
                  </Typography>
                  <Chip
                    label={getStatusLabel(request.status.name)}
                    color={getStatusColor(request.status.name)}
                    variant="filled"
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <DateIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body2">
                    {new Date(request.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>

                {request.created_by && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Invitado por
                    </Typography>
                    <Typography variant="body2">
                      {request.created_by.first_name} {request.created_by.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.created_by.email}
                    </Typography>
                  </Box>
                )}

                {request.updated_by && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Última actualización por
                    </Typography>
                    <Typography variant="body2">
                      {request.updated_by.first_name} {request.updated_by.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.updated_by.email}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Expira el
                  </Typography>
                  <Typography variant="body2">
                    {new Date(request.expires_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Action Modal */}
      <Dialog
        open={showActionModal}
        onClose={() => setShowActionModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'approve' ? 'Aprobar Solicitud' :
           actionType === 'reject' ? 'Rechazar Solicitud' :
           'Solicitar Correcciones'}
        </DialogTitle>
        <DialogContent>
          {actionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {actionError}
            </Alert>
          )}

          {actionType === 'request_corrections' && (
            <TextField
              fullWidth
              label="Notas de Corrección"
              multiline
              rows={4}
              value={correctionsNotes}
              onChange={(e) => setCorrectionsNotes(e.target.value)}
              placeholder="Describe las correcciones necesarias..."
              required
              error={!correctionsNotes.trim() && actionError !== null}
              helperText={!correctionsNotes.trim() && actionError !== null ? 'Este campo es requerido' : ''}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Mensaje adicional (Opcional)"
            multiline
            rows={3}
            value={actionMessage}
            onChange={(e) => setActionMessage(e.target.value)}
            placeholder="Mensaje adicional para el usuario..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowActionModal(false)}
            disabled={actionLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAction}
            disabled={actionLoading || (actionType === 'request_corrections' && !correctionsNotes.trim())}
            variant="contained"
            color={
              actionType === 'approve' ? 'success' :
              actionType === 'reject' ? 'error' :
              'warning'
            }
          >
            {actionLoading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            {actionLoading ? 'Procesando...' : 
             actionType === 'approve' ? 'Aprobar' :
             actionType === 'reject' ? 'Rechazar' :
             'Solicitar Correcciones'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
