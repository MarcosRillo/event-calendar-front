import { DataTableRow } from '@/components/ui/DataTable';
import { User } from '@/types';

// Transform User type to DataTableRow compatible
export interface UserTableRow extends DataTableRow {
  first_name: string;
  last_name: string;
  name: string; // Computed field
  email: string;
  role: {
    id: number;
    name: string;
  };
  organization?: {
    id: number;
    name: string;
    slug: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Función para obtener el color del chip según el rol
 */
export const getRoleColor = (roleName: string): 'error' | 'warning' | 'info' | 'success' | 'default' => {
  switch (roleName.toLowerCase()) {
    case 'super_admin': return 'error';
    case 'admin': return 'warning';
    case 'organization_admin': return 'info';
    case 'user': return 'success';
    default: return 'default';
  }
};

/**
 * Función para transformar User a UserTableRow
 */
export const transformUserToTableRow = (user: User): UserTableRow => ({
  ...user,
  name: `${user.first_name} ${user.last_name}`.trim(),
});

/**
 * Tipo para configuración de estadísticas
 */
export interface StatConfig {
  title: string;
  value: number;
  color: 'primary' | 'success' | 'info' | 'warning' | 'error';
}

/**
 * Configuración de estadísticas de usuarios (sin JSX)
 */
export const getUserStatsConfig = (
  totalUsers: number,
  activeUsers: number,
  rolesCount: number,
  organizationsCount: number
): StatConfig[] => [
  {
    title: "Total Usuarios",
    value: totalUsers,
    color: "primary",
  },
  {
    title: "Usuarios Activos", 
    value: activeUsers,
    color: "success",
  },
  {
    title: "Roles Disponibles",
    value: rolesCount,
    color: "info",
  },
  {
    title: "Organizaciones",
    value: organizationsCount,
    color: "warning",
  },
];

/**
 * Configuraciones constantes
 */
export const USERS_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  TABLE_HEIGHT: 600,
} as const;
