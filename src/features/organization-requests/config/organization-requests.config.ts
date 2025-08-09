import { DataTableRow } from '@/components/ui/DataTable';
import { OrganizationRequest } from '@/hooks/useOrganizationRequests';
import { 
  Business as BusinessIcon, 
  HourglassEmpty as PendingIcon, 
  CheckCircle as ApprovedIcon, 
  Cancel as RejectedIcon,
  Edit as CorrectionsIcon 
} from '@mui/icons-material';

/**
 * Organization Request Table Row interface - extends DataTableRow for type safety
 */
export interface OrganizationRequestTableRow extends DataTableRow {
  id: number;
  organization_data: {
    name: string;
    email: string;
    website_url?: string;
    phone?: string;
    address?: string;
  };
  admin_data: {
    first_name: string;
    last_name: string;
    email: string;
  };
  status: {
    id: number;
    name: string;
  };
  rejection_reason?: string;
  corrections_feedback?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Transform Organization Request to Table Row
 */
export const transformOrganizationRequestToTableRow = (request: OrganizationRequest): OrganizationRequestTableRow => ({
  ...request,
  organization_data: {
    name: request.organization_data?.name || '',
    email: request.organization_data?.email || '',
    website_url: request.organization_data?.website_url,
    phone: request.organization_data?.phone,
    address: request.organization_data?.address,
  },
  admin_data: {
    first_name: request.admin_data?.first_name || '',
    last_name: request.admin_data?.last_name || '',
    email: request.admin_data?.email || '',
  },
});

/**
 * Status options for filters
 */
export const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
  { value: 'corrections_needed', label: 'Necesitan Correcciones' },
] as const;

/**
 * Get status color based on request status
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    case 'corrections_needed':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Get status label from value
 */
export const getStatusLabel = (status: string) => {
  return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status;
};

/**
 * Organization Requests feature configuration
 */
export const ORGANIZATION_REQUESTS_CONFIG = {
  // Page settings
  page: {
    title: 'Solicitudes de Organizaciones',
    description: 'Gestiona las solicitudes de registro de nuevas organizaciones',
    defaultPageSize: 10,
  },
  
  // Stats configuration
  stats: {
    total: {
      title: 'Total Solicitudes',
      icon: BusinessIcon,
      color: 'primary' as const,
    },
    pending: {
      title: 'Pendientes',
      icon: PendingIcon,
      color: 'warning' as const,
    },
    approved: {
      title: 'Aprobadas',
      icon: ApprovedIcon,
      color: 'success' as const,
    },
    rejected: {
      title: 'Rechazadas',
      icon: RejectedIcon,
      color: 'error' as const,
    },
    corrections: {
      title: 'Correcciones',
      icon: CorrectionsIcon,
      color: 'info' as const,
    },
  },
  
  // Table configuration
  table: {
    height: 600,
    actions: {
      view: {
        label: 'Ver Detalles',
        color: 'info' as const,
      },
    },
    primaryAction: {
      label: 'Enviar Invitación',
    },
  },

  // Filter configuration
  filters: {
    search: {
      label: 'Buscar solicitudes',
      placeholder: 'Nombre de organización, email...',
    },
    status: {
      label: 'Estado',
      options: STATUS_OPTIONS,
    },
  },
} as const;
