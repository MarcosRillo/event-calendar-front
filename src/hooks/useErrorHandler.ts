'use client';

import { useCallback } from 'react';
import { logger } from '@/lib/logger';

interface ErrorDetails {
  context?: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export function useErrorHandler() {
  const handleError = useCallback((error: Error | unknown, details?: ErrorDetails) => {
    // Normalize error
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    
    // Log the error
    const logMessage = `Error in ${details?.context || 'unknown context'}: ${normalizedError.message}`;
    logger.error(logMessage);

    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(normalizedError, { extra: details });
      console.error('Production error:', normalizedError, details);
    }

    // Return normalized error for further handling
    return normalizedError;
  }, []);

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      errorDetails?: ErrorDetails
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, errorDetails);
        return null;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
  };
}
