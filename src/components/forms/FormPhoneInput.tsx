'use client';

import { forwardRef } from 'react';
import FormInput, { FormInputProps } from './FormInput';

export interface FormPhoneInputProps extends Omit<FormInputProps, 'type'> {
  countryCode?: string;
}

const FormPhoneInput = forwardRef<HTMLDivElement, FormPhoneInputProps>(
  ({ 
    countryCode = '+54',
    placeholder = '11 1234-5678',
    ...props 
  }, ref) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      
      // Remove all non-numeric characters except +
      value = value.replace(/[^\d+]/g, '');
      
      // Ensure country code is present
      if (!value.startsWith(countryCode)) {
        if (value.startsWith('+')) {
          value = countryCode + value.substring(value.indexOf(' ') + 1);
        } else {
          value = countryCode + ' ' + value;
        }
      }

      // Format the phone number
      if (value.length > countryCode.length) {
        const phoneNumber = value.substring(countryCode.length).replace(/\s/g, '');
        
        // Argentina phone format: +54 11 1234-5678
        let formatted = countryCode + ' ';
        
        if (phoneNumber.length <= 2) {
          formatted += phoneNumber;
        } else if (phoneNumber.length <= 6) {
          formatted += phoneNumber.substring(0, 2) + ' ' + phoneNumber.substring(2);
        } else {
          formatted += phoneNumber.substring(0, 2) + ' ' + 
                     phoneNumber.substring(2, 6) + '-' + 
                     phoneNumber.substring(6, 10);
        }
        
        value = formatted;
      }

      // Create a new event with the formatted value
      const newEvent = {
        ...event,
        target: {
          ...event.target,
          value: value
        }
      };

      // Call the original onChange if provided
      if (props.onChange) {
        props.onChange(newEvent);
      }
    };

    return (
      <FormInput
        ref={ref}
        type="tel"
        placeholder={`${countryCode} ${placeholder}`}
        {...props}
        onChange={handleInputChange}
        inputProps={{
          maxLength: 18, // +54 11 1234-5678 = 17 characters
          ...props.inputProps,
        }}
      />
    );
  }
);

FormPhoneInput.displayName = 'FormPhoneInput';

export default FormPhoneInput;
