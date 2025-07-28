'use client';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField,
  Chip,
  Box,
  SelectProps,
} from '@mui/material';
import { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  label?: string;
  options: SelectOption[];
  value?: unknown;
  onChange?: (value: unknown) => void;
  helperText?: string;
  enableAutocomplete?: boolean;
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  ({
    label,
    options,
    value,
    onChange,
    error,
    helperText,
    required,
    disabled,
    enableAutocomplete = false,
    multiple = false,
    placeholder,
    ...props
  }, ref) => {

    if (enableAutocomplete) {
      return (
        <Autocomplete
          ref={ref}
          options={options}
          getOptionLabel={(option) => option.label}
          value={multiple 
            ? options.filter(opt => Array.isArray(value) && value.includes(opt.value))
            : options.find(opt => opt.value === value) || null
          }
          onChange={(_, newValue) => {
            if (multiple && Array.isArray(newValue)) {
              onChange?.(newValue.map(option => option.value));
            } else if (!multiple && newValue && !Array.isArray(newValue)) {
              onChange?.(newValue.value);
            } else {
              onChange?.(null);
            }
          }}
          multiple={multiple}
          disabled={disabled}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.value}
                label={option.label}
                size="small"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              required={required}
              error={error}
              helperText={helperText}
              placeholder={placeholder}
            />
          )}
          getOptionDisabled={(option) => option.disabled || false}
        />
      );
    }

    return (
      <FormControl fullWidth error={error} required={required} disabled={disabled}>
        {label && (
          <InputLabel id={`${props.id || 'select'}-label`}>
            {label}
          </InputLabel>
        )}
        <Select
          ref={ref}
          labelId={`${props.id || 'select'}-label`}
          value={value || (multiple ? [] : '')}
          onChange={(event) => {
            const newValue = event.target.value;
            onChange?.(newValue === '' ? null : newValue);
          }}
          label={label}
          multiple={multiple}
          renderValue={multiple ? (selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(Array.isArray(selected) ? selected : [selected]).map((val) => {
                const option = options.find(opt => opt.value === val);
                return (
                  <Chip 
                    key={val} 
                    label={option?.label || val} 
                    size="small" 
                  />
                );
              })}
            </Box>
          ) : undefined}
          {...props}
        >
          {placeholder && !multiple && (
            <MenuItem value="" disabled>
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
