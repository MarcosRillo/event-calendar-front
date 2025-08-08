"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axiosClient from '@/lib/axios';
import NotificationSnackbar, { useNotifications } from '@/components/ui/NotificationSnackbar';

interface SendInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SendInvitationModal({ isOpen, onClose, onSuccess }: SendInvitationModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    organization_name: '',
    contact_name: '',
    expires_days: 30,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    notification,
    open: notificationOpen,
    showSuccess,
    closeNotification
  } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/super-admin/organization-requests/send-invitation', formData);
      
      if (response.data.success) {
        // Reset form
        setFormData({
          email: '',
          organization_name: '',
          contact_name: '',
          expires_days: 30,
          message: ''
        });
        onSuccess();
        onClose();
        
        // Show success message
        showSuccess(`Invitación enviada exitosamente a ${formData.email}`);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al enviar la invitación';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        email: '',
        organization_name: '',
        contact_name: '',
        expires_days: 30,
        message: ''
      });
      setError('');
      onClose();
    }
  };

  return (
    <>
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Enviar Invitación de Organización
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <TextField
              label="Email del destinatario"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              fullWidth
              placeholder="ejemplo@email.com"
              disabled={loading}
              variant="outlined"
            />

            <TextField
              label="Nombre de la organización"
              type="text"
              value={formData.organization_name}
              onChange={(e) => handleChange('organization_name', e.target.value)}
              required
              fullWidth
              placeholder="Nombre de la organización"
              disabled={loading}
              variant="outlined"
            />

            <TextField
              label="Nombre del contacto"
              type="text"
              value={formData.contact_name}
              onChange={(e) => handleChange('contact_name', e.target.value)}
              required
              fullWidth
              placeholder="Nombre completo del contacto"
              disabled={loading}
              variant="outlined"
            />

            <FormControl fullWidth variant="outlined" disabled={loading}>
              <InputLabel>Días hasta expiración</InputLabel>
              <Select
                value={formData.expires_days}
                onChange={(e) => handleChange('expires_days', parseInt(String(e.target.value)))}
                label="Días hasta expiración"
              >
                <MenuItem value={7}>7 días</MenuItem>
                <MenuItem value={15}>15 días</MenuItem>
                <MenuItem value={30}>30 días</MenuItem>
                <MenuItem value={60}>60 días</MenuItem>
                <MenuItem value={90}>90 días</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Mensaje personalizado (opcional)"
              multiline
              rows={3}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              fullWidth
              placeholder="Mensaje adicional para incluir en la invitación..."
              disabled={loading}
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ ml: 1 }}
          >
            {loading ? 'Enviando...' : 'Enviar Invitación'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    <NotificationSnackbar
      notification={notification}
      open={notificationOpen}
      onClose={closeNotification}
    />
    </>
  );
}
