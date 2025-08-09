import { Box, Typography, Container } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FormsDemoForm } from './FormsDemoForm';
import { useFormsDemo } from '../hooks/useFormsDemo';
import { FORMS_DEMO_CONFIG } from '../config/forms-demo.config';

/**
 * Forms Demo Page Component
 * Demonstrates various form components and validation
 */
export const FormsDemoPage: React.FC = () => {
  const {
    formData,
    loading,
    isFormValid,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleSwitchChange,
    handleSubmit,
  } = useFormsDemo();

  const config = FORMS_DEMO_CONFIG;

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            {config.page.title}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ mb: 4 }}
          >
            {config.page.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormsDemoForm
              formData={formData}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onDateChange={handleDateChange}
              onSwitchChange={handleSwitchChange}
              onSubmit={handleSubmit}
              loading={loading}
              isFormValid={isFormValid}
            />
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
};
