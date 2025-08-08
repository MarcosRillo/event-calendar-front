'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import { Organization, UpdateOrganizationData, TrustLevel, User } from '@/types';

interface EditOrganizationModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: UpdateOrganizationData) => Promise<void>;
  trustLevels?: TrustLevel[];
  users?: User[];
  isLoading?: boolean;
}

export default function EditOrganizationModal({
  organization,
  isOpen,
  onClose,
  onSave,
  trustLevels = [],
  users = [],
  isLoading = false
}: EditOrganizationModalProps) {
  const [formData, setFormData] = useState<UpdateOrganizationData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Reset form when organization changes
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        slug: organization.slug,
        website_url: organization.website_url || '',
        address: organization.address || '',
        phone: organization.phone || '',
        email: organization.email || '',
        admin_id: organization.admin_id || undefined,
        trust_level_id: organization.trust_level_id || undefined,
        is_active: organization.is_active,
      });
      setErrors({});
    }
  }, [organization]);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && (!formData.slug || formData.slug === '')) {
      const newSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.name, formData.slug]);

  const handleInputChange = (field: keyof UpdateOrganizationData, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = 'El slug es obligatorio';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
      newErrors.website_url = 'La URL del sitio web debe comenzar con http:// o https://';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email debe ser una dirección válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization || !validateForm()) return;

    setSaving(true);
    try {
      await onSave(organization.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving organization:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setErrors({});
      onClose();
    }
  };

  if (!organization) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Editar Organización
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={saving}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              <TextField
                label="Nombre"
                required
                fullWidth
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                disabled={saving}
                variant="outlined"
              />
              
              <TextField
                label="Slug"
                required
                fullWidth
                value={formData.slug || ''}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                error={!!errors.slug}
                helperText={errors.slug || 'Solo letras minúsculas, números y guiones'}
                disabled={saving}
                variant="outlined"
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                disabled={saving}
                variant="outlined"
              />

              <TextField
                label="Teléfono"
                fullWidth
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={saving}
                variant="outlined"
              />
            </Box>

            <TextField
              label="Dirección"
              multiline
              rows={2}
              fullWidth
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={saving}
              variant="outlined"
            />

            <TextField
              label="Sitio Web"
              fullWidth
              value={formData.website_url || ''}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              error={!!errors.website_url}
              helperText={errors.website_url || 'URL completa (ej: https://example.com)'}
              disabled={saving}
              variant="outlined"
            />

            {/* Admin and Trust Level Selection */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr', 
                  md: `${users.length > 0 ? '1fr' : '0'} ${trustLevels.length > 0 ? '1fr' : '0'}`.trim() || '1fr'
                },
                gap: 3,
              }}
            >
              {/* Admin Selection */}
              {users.length > 0 && (
                <FormControl fullWidth variant="outlined" disabled={saving}>
                  <InputLabel>Administrador</InputLabel>
                  <Select
                    value={formData.admin_id || ''}
                    onChange={(e) => handleInputChange('admin_id', e.target.value ? Number(e.target.value) : undefined)}
                    label="Administrador"
                  >
                    <MenuItem value="">
                      <em>Sin asignar</em>
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Trust Level Selection */}
              {trustLevels.length > 0 && (
                <FormControl fullWidth variant="outlined" disabled={saving}>
                  <InputLabel>Nivel de Confianza</InputLabel>
                  <Select
                    value={formData.trust_level_id || ''}
                    onChange={(e) => handleInputChange('trust_level_id', e.target.value ? Number(e.target.value) : undefined)}
                    label="Nivel de Confianza"
                  >
                    <MenuItem value="">
                      <em>Sin asignar</em>
                    </MenuItem>
                    {trustLevels.map((level) => (
                      <MenuItem key={level.id} value={level.id}>
                        {level.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>

            {/* Active Status */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active ?? true}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  disabled={saving}
                  color="primary"
                />
              }
              label="Organización Activa"
            />

            {/* Display current errors */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error">
                Por favor, corrige los errores en el formulario antes de continuar.
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={saving}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving || isLoading}
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ ml: 1 }}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
