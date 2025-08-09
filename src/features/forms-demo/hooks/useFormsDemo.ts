import { useState, useCallback } from 'react';
import { useNotifications } from '@/components/ui/NotificationSnackbar';
import { 
  FormsDemoData, 
  INITIAL_FORM_DATA, 
  FORMS_DEMO_CONFIG 
} from '../config/forms-demo.config';

/**
 * Custom hook for Forms Demo management
 */
export const useFormsDemo = () => {
  const {
    notification,
    open: notificationOpen,
    closeNotification,
    showSuccess,
    showError,
  } = useNotifications();

  // Form state
  const [formData, setFormData] = useState<FormsDemoData>(INITIAL_FORM_DATA);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form data handlers
  const handleFieldChange = useCallback(<K extends keyof FormsDemoData>(
    field: K,
    value: FormsDemoData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInputChange = useCallback((field: keyof FormsDemoData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      handleFieldChange(field, value as FormsDemoData[typeof field]);
    }, [handleFieldChange]
  );

  const handleSwitchChange = useCallback((field: keyof FormsDemoData) => 
    (checked: boolean) => {
      handleFieldChange(field, checked as FormsDemoData[typeof field]);
    }, [handleFieldChange]
  );

  const handleSelectChange = useCallback((field: keyof FormsDemoData) => 
    (value: unknown) => {
      handleFieldChange(field, value as FormsDemoData[typeof field]);
    }, [handleFieldChange]
  );

  const handleDateChange = useCallback((field: keyof FormsDemoData) => 
    (date: Date | null) => {
      handleFieldChange(field, date as FormsDemoData[typeof field]);
    }, [handleFieldChange]
  );

  // Form submission
  const handleShowConfirm = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, FORMS_DEMO_CONFIG.form.submitDelay));
      showSuccess(FORMS_DEMO_CONFIG.messages.success);
      setShowConfirm(false);
      // Reset form after successful submission
      setFormData(INITIAL_FORM_DATA);
    } catch {
      showError(FORMS_DEMO_CONFIG.messages.error);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Form validation
  const isFormValid = useCallback(() => {
    return formData.name.trim() !== '' && 
           formData.email.trim() !== '' && 
           formData.password.trim() !== '' && 
           formData.role !== '';
  }, [formData]);

  return {
    // Form state
    formData,
    loading,
    showConfirm,

    // Form handlers
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleDateChange,
    handleFieldChange,

    // Submission handlers
    handleShowConfirm,
    handleCloseConfirm,
    handleSubmit,

    // Validation
    isFormValid: isFormValid(),

    // Notifications
    notification,
    notificationOpen,
    closeNotification,
  };
};
