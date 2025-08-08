'use client';

import { FieldErrors } from 'react-hook-form';

// Utility function to get field error message
export function getFieldError(
  errors: FieldErrors,
  fieldName: string
): string | undefined {
  const error = errors[fieldName];
  return error?.message as string | undefined;
}

// Utility function to check if field has error
export function hasFieldError(
  errors: FieldErrors,
  fieldName: string
): boolean {
  return !!errors[fieldName];
}

// Export useForm directly for now
export { useForm } from 'react-hook-form';
