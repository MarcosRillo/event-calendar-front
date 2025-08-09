import { SelectOption } from '@/components/forms';

/**
 * Form data interface
 */
export interface FormsDemoData {
  name: string;
  email: string;
  password: string;
  role: string;
  organization: string;
  phone: string;
  birthDate: Date | null;
  isActive: boolean;
  notifications: boolean;
}

/**
 * Initial form data
 */
export const INITIAL_FORM_DATA: FormsDemoData = {
  name: '',
  email: '',
  password: '',
  role: '',
  organization: '',
  phone: '',
  birthDate: null,
  isActive: true,
  notifications: false,
};

/**
 * Sample options for selects
 */
export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuario' },
  { value: 'viewer', label: 'Visualizador' },
];

export const ORGANIZATION_OPTIONS: SelectOption[] = [
  { value: 'org1', label: 'Organización 1' },
  { value: 'org2', label: 'Organización 2' },
  { value: 'org3', label: 'Organización 3' },
];

/**
 * Forms Demo feature configuration
 */
export const FORMS_DEMO_CONFIG = {
  // Page settings
  page: {
    title: 'Demo de Form Components',
    description: 'Demostración de los componentes de formulario de Material UI',
  },
  
  // Form settings
  form: {
    title: 'Ejemplo de Formulario',
    submitDelay: 2000, // Simulated API delay
    maxWidth: 800,
  },

  // Field labels and placeholders
  fields: {
    name: {
      label: 'Nombre completo',
      placeholder: 'Ingresa tu nombre',
    },
    email: {
      label: 'Email',
      placeholder: 'tu@email.com',
    },
    password: {
      label: 'Contraseña',
      placeholder: '••••••••',
    },
    phone: {
      label: 'Teléfono',
    },
    role: {
      label: 'Rol',
      placeholder: 'Selecciona un rol',
    },
    organization: {
      label: 'Organización',
      placeholder: 'Selecciona una organización',
    },
    birthDate: {
      label: 'Fecha de nacimiento',
    },
    isActive: {
      label: 'Usuario activo',
    },
    notifications: {
      label: 'Recibir notificaciones',
      description: 'Recibirás notificaciones por email',
    },
  },

  // Messages
  messages: {
    success: '¡Formulario enviado correctamente!',
    error: 'Error al enviar el formulario',
    confirmTitle: 'Confirmar envío',
    confirmMessage: '¿Estás seguro de que deseas enviar el formulario con los datos ingresados?',
  },
} as const;
