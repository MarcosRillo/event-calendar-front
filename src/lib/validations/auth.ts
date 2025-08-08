import { z } from 'zod';

// Login form validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(255, 'El email es demasiado largo'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña es demasiado larga'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Organization request form validation  
export const organizationRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(255, 'El email es demasiado largo'),
  organization_name: z
    .string()
    .min(1, 'El nombre de la organización es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_\.]+$/, 'Nombre contiene caracteres no válidos'),
  contact_name: z
    .string()
    .min(1, 'El nombre del contacto es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  expires_days: z
    .number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 día')
    .max(365, 'Máximo 365 días')
    .default(30),
  message: z
    .string()
    .max(500, 'El mensaje no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type OrganizationRequestFormData = z.infer<typeof organizationRequestSchema>;

// Organization form validation
export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_\.]+$/, 'Nombre contiene caracteres no válidos'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones')
    .max(50, 'El slug no puede exceder 50 caracteres'),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email es demasiado largo')
    .optional()
    .or(z.literal('')),
  website_url: z
    .string()
    .url('URL inválida')
    .max(255, 'La URL es demasiado larga')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Formato de teléfono inválido')
    .max(20, 'El teléfono es demasiado largo')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  is_active: z
    .boolean()
    .default(true),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// User form validation
export const userSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(255, 'El email es demasiado largo'),
  role: z
    .enum(['super_admin', 'admin', 'user'], {
      message: 'Rol inválido',
    }),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña es demasiado larga')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .optional(),
  password_confirmation: z
    .string()
    .optional(),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

export type UserFormData = z.infer<typeof userSchema>;
