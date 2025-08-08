import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

interface LoginFormData {
  email: string;
  password: string;
}

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      logger.info('User login successful', { email: formData.email });
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  }, [formData.email, formData.password, login, router]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ email: '', password: '' });
    setError('');
    setLoading(false);
  }, []);

  return {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    clearError,
    resetForm
  };
}
