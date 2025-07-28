'use client';

import {
  Switch,
  FormControl,
  FormControlLabel,
  FormHelperText,
  SwitchProps,
} from '@mui/material';
import { forwardRef } from 'react';

export interface FormSwitchProps extends Omit<SwitchProps, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormSwitch = forwardRef<HTMLButtonElement, FormSwitchProps>(
  ({
    label,
    helperText,
    error,
    labelPlacement = 'end',
    onChange,
    ...props
  }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked, event);
    };

    const switchComponent = (
      <Switch
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );

    if (!label && !helperText) {
      return switchComponent;
    }

    return (
      <FormControl error={error} component="fieldset" variant="standard">
        {label ? (
          <FormControlLabel
            control={switchComponent}
            label={label}
            labelPlacement={labelPlacement}
          />
        ) : (
          switchComponent
        )}
        {helperText && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);

FormSwitch.displayName = 'FormSwitch';

export default FormSwitch;
