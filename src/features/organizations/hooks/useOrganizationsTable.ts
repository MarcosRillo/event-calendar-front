import { useState, useCallback, useMemo } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useNotifications } from '@/components/ui/NotificationSnackbar';
import { 
  OrganizationTableRow, 
  transformOrganizationToTableRow,
  ORGANIZATIONS_CONFIG 
} from '../config/organizations.config';

/**
 * Custom hook for Organizations table management
 */
export const useOrganizationsTable = () => {
  const {
    organizations,
    totalCount,
    isLoading,
    error,
    loadOrganizations,
    toggleOrganizationStatus,
  } = useOrganizations();

  const {
    notification,
    open: notificationOpen,
    closeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotifications();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(ORGANIZATIONS_CONFIG.page.defaultPageSize);

  // Transform data for table
  const tableRows: OrganizationTableRow[] = useMemo(() => {
    return organizations ? organizations.map(transformOrganizationToTableRow) : [];
  }, [organizations]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeOrganizations = tableRows.filter(org => org.is_active).length;
    const totalUsers = tableRows.reduce((sum, org) => sum + (org.users_count || 0), 0);
    const totalEvents = tableRows.reduce((sum, org) => sum + (org.events_count || 0), 0);

    return {
      totalOrganizations: totalCount || 0,
      activeOrganizations,
      totalUsers,
      totalEvents,
    };
  }, [tableRows, totalCount]);

  // Page handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadOrganizations({ page: page + 1 }); // API uses 1-based pagination
  }, [loadOrganizations]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    loadOrganizations({ page: 1, per_page: newPageSize });
  }, [loadOrganizations]);

  // Action handlers
  const handleToggleStatus = useCallback(async (org: OrganizationTableRow) => {
    try {
      await toggleOrganizationStatus(org.id);
      showSuccess(`Organización ${org.is_active ? 'desactivada' : 'activada'} correctamente`);
      loadOrganizations({ page: currentPage + 1 });
    } catch {
      showError('Error al cambiar el estado de la organización');
    }
  }, [toggleOrganizationStatus, showSuccess, showError, loadOrganizations, currentPage]);

  const handleEditOrganization = useCallback((org: OrganizationTableRow) => {
    showInfo(`Editando organización: ${org.name}`);
    // TODO: Open edit modal
  }, [showInfo]);

  const handleDeleteOrganization = useCallback((org: OrganizationTableRow) => {
    showWarning(`¿Eliminar organización ${org.name}?`);
    // TODO: Show confirmation dialog
  }, [showWarning]);

  const handleAddOrganization = useCallback(() => {
    showInfo('Abriendo formulario para agregar organización');
    // TODO: Open add organization modal
  }, [showInfo]);

  const handleRowClick = useCallback((row: OrganizationTableRow) => {
    showInfo(`Ver detalles de: ${row.name}`);
    // TODO: Navigate to organization details
  }, [showInfo]);

  const handleRetry = useCallback(() => {
    loadOrganizations({ page: currentPage + 1 });
  }, [loadOrganizations, currentPage]);

  return {
    // Data
    tableRows,
    stats,
    totalCount: totalCount || 0,
    loading: isLoading,
    error,

    // Pagination
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,

    // Actions
    handleToggleStatus,
    handleEditOrganization,
    handleDeleteOrganization,
    handleAddOrganization,
    handleRowClick,
    handleRetry,

    // Notifications
    notification,
    notificationOpen,
    closeNotification,
  };
};
