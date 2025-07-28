'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Stack,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  FormInput, 
  FormSelect, 
  FormDatePicker, 
  FormPhoneInput,
  FormSwitch,
  ConfirmDialog,
  SelectOption 
} from '@/components/forms';
import NotificationSnackbar, { useNotifications } from '@/components/ui/NotificationSnackbar';

export default function FormComponentsDemo() {
  const {
    notification,
    open: notificationOpen,
    showSuccess,
    showError,
    closeNotification,
  } = useNotifications();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    organization: '',
    phone: '',
    birthDate: null as Date | null,
    isActive: true,
    notifications: false,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample options
  const roleOptions: SelectOption[] = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
    { value: 'viewer', label: 'Visualizador' },
  ];

  const organizationOptions: SelectOption[] = [
    { value: 'org1', label: 'Organización 1' },
    { value: 'org2', label: 'Organización 2' },
    { value: 'org3', label: 'Organización 3' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess('¡Formulario enviado correctamente!');
      setShowConfirm(false);
    } catch {
      showError('Error al enviar el formulario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Demo de Form Components
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Demostración de los componentes de formulario de Material UI
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Ejemplo de Formulario
        </Typography>
        
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3 
          }}
        >
          {/* Inputs básicos */}
          <Box>
            <FormInput
              label="Nombre completo"
              placeholder="Ingresa tu nombre"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </Box>

          <Box>
            <FormInput
              type="email"
              label="Email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </Box>

          <Box>
            <FormInput
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              showPasswordToggle
              required
            />
          </Box>

          <Box>
            <FormPhoneInput
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </Box>

          {/* Selects */}
          <Box>
            <FormSelect
              label="Rol"
              options={roleOptions}
              value={formData.role}
              onChange={(value) => setFormData(prev => ({ ...prev, role: value as string }))}
              placeholder="Selecciona un rol"
              required
            />
          </Box>

          <Box>
            <FormSelect
              label="Organización"
              options={organizationOptions}
              value={formData.organization}
              onChange={(value) => setFormData(prev => ({ ...prev, organization: value as string }))}
              enableAutocomplete
              placeholder="Busca una organización"
            />
          </Box>

          {/* Date picker */}
          <Box>
            <FormDatePicker
              label="Fecha de nacimiento"
              value={formData.birthDate}
              onChange={(date) => setFormData(prev => ({ ...prev, birthDate: date }))}
            />
          </Box>

          {/* Switches */}
          <Box>
            <Stack spacing={2} sx={{ pt: 2 }}>
              <FormSwitch
                label="Usuario activo"
                checked={formData.isActive}
                onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <FormSwitch
                label="Recibir notificaciones"
                checked={formData.notifications}
                onChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
                color="secondary"
              />
            </Stack>
          </Box>

          {/* Submit button */}
          <Box sx={{ gridColumn: '1 / -1', pt: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => setShowConfirm(true)}
                size="large"
              >
                Guardar Formulario
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: '',
                    organization: '',
                    phone: '',
                    birthDate: null,
                    isActive: true,
                    notifications: false,
                  });
                }}
              >
                Limpiar
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        title="Confirmar envío"
        message="¿Estás seguro de que deseas enviar este formulario?"
        type="info"
        confirmText="Enviar"
        loading={loading}
      />

      {/* Notifications */}
      <NotificationSnackbar
        notification={notification}
        open={notificationOpen}
        onClose={closeNotification}
      />
    </DashboardLayout>
  );
}
