'use client';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { forwardRef } from 'react';
import { es } from 'date-fns/locale';

export interface FormDatePickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const FormDatePicker = forwardRef<HTMLDivElement, FormDatePickerProps>(
  ({ 
    value,
    onChange,
    label, 
    helperText, 
    error, 
    required, 
    placeholder,
    disabled,
    minDate,
    maxDate,
    ...props 
  }, ref) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          ref={ref}
          value={value}
          onChange={onChange}
          label={label}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          slots={{
            textField: TextField,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required,
              error,
              helperText,
              placeholder,
            },
          }}
          {...props}
        />
      </LocalizationProvider>
    );
  }
);

FormDatePicker.displayName = 'FormDatePicker';

export default FormDatePicker;
