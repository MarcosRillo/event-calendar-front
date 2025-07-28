'use client';

import { 
  TextField, 
  TextFieldProps, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';
import { forwardRef, useState } from 'react';

export interface FormInputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  showPasswordToggle?: boolean;
}

const FormInput = forwardRef<HTMLDivElement, FormInputProps>(
  ({ 
    type = 'text', 
    showPasswordToggle = false, 
    variant = 'outlined',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    const isPasswordField = type === 'password';
    const actualType = isPasswordField && showPassword ? 'text' : type;

    return (
      <TextField
        ref={ref}
        type={actualType}
        variant={variant}
        fullWidth
        InputProps={{
          ...(isPasswordField && showPasswordToggle && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }),
          ...props.InputProps,
        }}
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
