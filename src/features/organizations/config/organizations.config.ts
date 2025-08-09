import { DataTableRow } from '@/components/ui/DataTable';
import { Organization } from '@/types';
import { Business as BusinessIcon, Domain as DomainIcon, Public as PublicIcon } from '@mui/icons-material';

/**
 * Organization Table Row interface - extends DataTableRow for type safety
 */
export interface OrganizationTableRow extends DataTableRow {
  id: number;
  name: string;
  website_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users_count?: number;
  events_count?: number;
}

/**
 * Transform Organization to Table Row
 */
export const transformOrganizationToTableRow = (org: Organization): OrganizationTableRow => ({
  ...org,
});

/**
 * Get status color based on organization status
 */
export const getStatusColor = (isActive: boolean) => {
  return isActive ? 'success' : 'error';
};

/**
 * Organizations feature configuration
 */
export const ORGANIZATIONS_CONFIG = {
  // Page settings
  page: {
    title: 'Gestión de Organizaciones',
    description: 'Administra organizaciones del sistema',
    defaultPageSize: 10,
  },
  
  // Stats configuration
  stats: {
    totalOrganizations: {
      title: 'Total Organizaciones',
      icon: BusinessIcon,
      color: 'primary' as const,
    },
    activeOrganizations: {
      title: 'Organizaciones Activas',
      icon: DomainIcon,
      color: 'success' as const,
    },
    totalUsers: {
      title: 'Total Usuarios',
      icon: PublicIcon,
      color: 'info' as const,
    },
    totalEvents: {
      title: 'Total Eventos',
      icon: BusinessIcon,
      color: 'warning' as const,
    },
  },
  
  // Table configuration
  table: {
    height: 600,
    actions: {
      edit: {
        label: 'Editar',
        color: 'primary' as const,
      },
      delete: {
        label: 'Eliminar',
        color: 'error' as const,
      },
    },
    primaryAction: {
      label: 'Agregar Organización',
    },
  },
} as const;
