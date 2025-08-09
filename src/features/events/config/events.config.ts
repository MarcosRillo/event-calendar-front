import { DataTableRow } from '@/components/ui/DataTable';
import { Event } from '@/types';
import { 
  Event as EventIcon, 
  Business as BusinessIcon, 
  CheckCircle as CheckCircleIcon, 
  Schedule as ScheduleIcon 
} from '@mui/icons-material';

/**
 * Event Table Row interface - extends DataTableRow for type safety
 */
export interface EventTableRow extends DataTableRow {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  organization: {
    id: number;
    name: string;
    slug: string;
  };
  status?: {
    id: number;
    name: string;
  };
  is_active?: boolean;
  created_at: string;
}

/**
 * Transform Event to Table Row
 */
export const transformEventToTableRow = (event: Event): EventTableRow => ({
  ...event,
});

/**
 * Get status color based on event status
 */
export const getStatusColor = (statusName: string) => {
  switch (statusName?.toLowerCase()) {
    case 'active':
    case 'published': 
      return 'success';
    case 'draft': 
      return 'warning';
    case 'cancelled': 
      return 'error';
    case 'completed': 
      return 'info';
    default: 
      return 'default';
  }
};

/**
 * Get event priority color
 */
export const getPriorityColor = (isActive: boolean) => {
  return isActive ? 'success' : 'error';
};

/**
 * Format date for display
 */
export const formatEventDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Events feature configuration
 */
export const EVENTS_CONFIG = {
  // Page settings
  page: {
    title: 'Gestión de Eventos',
    description: 'Administra eventos del sistema y su estado',
    defaultPageSize: 10,
  },
  
  // Stats configuration
  stats: {
    totalEvents: {
      title: 'Total Eventos',
      icon: EventIcon,
      color: 'primary' as const,
    },
    activeEvents: {
      title: 'Eventos Activos',
      icon: CheckCircleIcon,
      color: 'success' as const,
    },
    totalOrganizations: {
      title: 'Organizaciones',
      icon: BusinessIcon,
      color: 'info' as const,
    },
    upcomingEvents: {
      title: 'Próximos Eventos',
      icon: ScheduleIcon,
      color: 'warning' as const,
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
      label: 'Agregar Evento',
    },
  },

  // Filter configuration
  filters: {
    status: {
      label: 'Estado',
      placeholder: 'Todos los estados',
    },
    organization: {
      label: 'Organización',
      placeholder: 'Todas las organizaciones',
    },
    dateRange: {
      label: 'Rango de fechas',
    },
  },
} as const;
