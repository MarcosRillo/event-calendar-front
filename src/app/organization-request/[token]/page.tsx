"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import axiosClient from '@/lib/axios';

interface OrganizationData {
  name: string;
  slug: string;
  website_url: string;
  address: string;
  phone: string;
  email: string;
}

interface AdminData {
  first_name: string;
  last_name: string;
  email: string;
}

interface FormData {
  organization: OrganizationData;
  admin: AdminData;
}

export default function OrganizationRequestForm() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [formData, setFormData] = useState<FormData>({
    organization: {
      name: '',
      slug: '',
      website_url: '',
      address: '',
      phone: '',
      email: ''
    },
    admin: {
      first_name: '',
      last_name: '',
      email: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Verificar token al cargar la página
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      setLoading(true);
      try {
        const response = await axiosClient.get(`/organization-request/verify/${token}`);
        if (response.data.success) {
          setTokenValid(true);
        } else {
          setError('Token inválido o expirado');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al verificar el token';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Generar slug automáticamente desde el nombre
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        name: value,
        slug: slug
      }
    }));
  };

  const handleOrganizationChange = (field: keyof OrganizationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        [field]: value
      }
    }));
  };

  const handleAdminChange = (field: keyof AdminData, value: string) => {
    setFormData(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axiosClient.post(`/organization-request/submit/${token}`, formData);
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al enviar la solicitud';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Verificando invitación...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error && !tokenValid) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
        }}
      >
        <Container maxWidth="sm">
          <Card elevation={6}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'error.main',
                }}
              >
                <WarningIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom color="error">
                Invitación Inválida
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/')}
                size="large"
              >
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
        }}
      >
        <Container maxWidth="sm">
          <Card elevation={6}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'success.main',
                }}
              >
                <CheckIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom color="success.main">
                ¡Solicitud Enviada!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Tu solicitud de organización ha sido enviada exitosamente. 
                Recibirás una respuesta por email en breve.
              </Typography>
              <Button
                variant="contained" 
                onClick={() => router.push('/')}
                size="large"
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={8} sx={{ overflow: 'hidden' }}>
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <BusinessIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Solicitud de Organización
            </Typography>
            <Typography variant="subtitle1">
              Complete el formulario para solicitar la creación de su organización
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ p: 3 }}>
            <Stepper activeStep={0} alternativeLabel>
              <Step>
                <StepLabel>Información de la Organización</StepLabel>
              </Step>
              <Step>
                <StepLabel>Información del Administrador</StepLabel>
              </Step>
              <Step>
                <StepLabel>Confirmación</StepLabel>
              </Step>
            </Stepper>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            {/* Información de la Organización */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <BusinessIcon color="primary" />
                  <Typography variant="h6">
                    Información de la Organización
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <TextField
                      fullWidth
                      label="Nombre de la Organización"
                      placeholder="Ej: Cámara de Turismo de Tafí del Valle"
                      value={formData.organization.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <TextField
                      fullWidth
                      label="Slug (identificador único)"
                      value={formData.organization.slug}
                      onChange={(e) => handleOrganizationChange('slug', e.target.value)}
                      required
                      InputProps={{
                        readOnly: true,
                      }}
                      helperText="Se genera automáticamente basado en el nombre"
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Sitio Web"
                    type="url"
                    placeholder="https://ejemplo.com"
                    value={formData.organization.website_url}
                    onChange={(e) => handleOrganizationChange('website_url', e.target.value)}
                    InputProps={{
                      startAdornment: <WebsiteIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Teléfono"
                    type="tel"
                    placeholder="+54 381 123-4567"
                    value={formData.organization.phone}
                    onChange={(e) => handleOrganizationChange('phone', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />

                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      multiline
                      rows={2}
                      placeholder="Dirección completa de la organización"
                      value={formData.organization.address}
                      onChange={(e) => handleOrganizationChange('address', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <LocationIcon color="action" sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }} />,
                      }}
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <TextField
                      fullWidth
                      label="Email de Contacto"
                      type="email"
                      placeholder="contacto@organizacion.com"
                      value={formData.organization.email}
                      onChange={(e) => handleOrganizationChange('email', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Información del Administrador */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6">
                    Información del Administrador
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Nombre"
                    placeholder="Juan"
                    value={formData.admin.first_name}
                    onChange={(e) => handleAdminChange('first_name', e.target.value)}
                    required
                  />

                  <TextField
                    fullWidth
                    label="Apellido"
                    placeholder="Pérez"
                    value={formData.admin.last_name}
                    onChange={(e) => handleAdminChange('last_name', e.target.value)}
                    required
                  />

                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <TextField
                      fullWidth
                      label="Email del Administrador"
                      type="email"
                      placeholder="admin@organizacion.com"
                      value={formData.admin.email}
                      onChange={(e) => handleAdminChange('email', e.target.value)}
                      required
                      helperText="Este será el usuario principal de la organización"
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Enviando solicitud...
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
