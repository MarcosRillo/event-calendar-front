import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { 
  FormInput, 
  FormSelect, 
  FormDatePicker, 
  FormPhoneInput,
  FormSwitch,
} from '@/components/forms';
import { 
  ROLE_OPTIONS, 
  ORGANIZATION_OPTIONS, 
  FORMS_DEMO_CONFIG 
} from '../config/forms-demo.config';

interface FormsDemoFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    role: string;
    organization: string;
    phone: string;
    birthDate: Date | null;
    isActive: boolean;
    notifications: boolean;
  };
  onInputChange: (field: keyof FormsDemoFormProps['formData']) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: keyof FormsDemoFormProps['formData']) => (value: unknown) => void;
  onDateChange: (field: keyof FormsDemoFormProps['formData']) => (date: Date | null) => void;
  onSwitchChange: (field: keyof FormsDemoFormProps['formData']) => (checked: boolean) => void;
  onSubmit: () => void;
  loading: boolean;
  isFormValid: boolean;
}

/**
 * Forms Demo form component
 */
export const FormsDemoForm: React.FC<FormsDemoFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onDateChange,
  onSwitchChange,
  onSubmit,
  loading,
  isFormValid,
}) => {
  const config = FORMS_DEMO_CONFIG;

  return (
    <Paper sx={{ p: 4, maxWidth: config.form.maxWidth }}>
      <Typography variant="h6" gutterBottom>
        {config.form.title}
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
            label={config.fields.name.label}
            placeholder={config.fields.name.placeholder}
            value={formData.name}
            onChange={onInputChange('name')}
            required
          />
        </Box>

        <Box>
          <FormInput
            type="email"
            label={config.fields.email.label}
            placeholder={config.fields.email.placeholder}
            value={formData.email}
            onChange={onInputChange('email')}
            required
          />
        </Box>

        <Box>
          <FormInput
            type="password"
            label={config.fields.password.label}
            placeholder={config.fields.password.placeholder}
            value={formData.password}
            onChange={onInputChange('password')}
            showPasswordToggle
            required
          />
        </Box>

        <Box>
          <FormPhoneInput
            label={config.fields.phone.label}
            value={formData.phone}
            onChange={onInputChange('phone')}
          />
        </Box>

        {/* Selects */}
        <Box>
          <FormSelect
            label={config.fields.role.label}
            options={ROLE_OPTIONS}
            value={formData.role}
            onChange={onSelectChange('role')}
            placeholder={config.fields.role.placeholder}
            required
          />
        </Box>

        <Box>
          <FormSelect
            label={config.fields.organization.label}
            options={ORGANIZATION_OPTIONS}
            value={formData.organization}
            onChange={onSelectChange('organization')}
            placeholder={config.fields.organization.placeholder}
          />
        </Box>

        {/* Date picker */}
        <Box>
          <FormDatePicker
            label={config.fields.birthDate.label}
            value={formData.birthDate}
            onChange={onDateChange('birthDate')}
          />
        </Box>

        {/* Switches en columna separada */}
        <Box>
          <Stack spacing={2}>
            <FormSwitch
              label={config.fields.isActive.label}
              checked={formData.isActive}
              onChange={onSwitchChange('isActive')}
            />
            
            <FormSwitch
              label={config.fields.notifications.label}
              checked={formData.notifications}
              onChange={onSwitchChange('notifications')}
            />
          </Stack>
        </Box>
      </Box>

      {/* Submit button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={onSubmit}
          loading={loading}
          disabled={!isFormValid || loading}
        >
          {loading ? 'Enviando...' : 'Enviar Formulario'}
        </Button>
      </Box>
    </Paper>
  );
};
