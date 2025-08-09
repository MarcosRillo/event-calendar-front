import { useCallback } from 'react';
import { useNotifications } from '@/components/ui/NotificationSnackbar';
import { UserTableRow, transformUserToTableRow } from '../config/users.config';
import { useUserManagement } from '@/hooks/useUserManagement';

/**
 * Hook especializado para la gestión de usuarios en la tabla
 */
export function useUsersTable() {
  const { 
    usersData,
    roles, 
    organizations,
    loading,
    error,
    fetchUsers,
    toggleUserStatus 
  } = useUserManagement();
  
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotifications();

  // Transformar datos para la tabla
  const users = usersData?.data || [];
  const tableRows: UserTableRow[] = users.map(transformUserToTableRow);
  
  // Estadísticas calculadas
  const stats = {
    totalUsers: usersData?.total || 0,
    activeUsers: tableRows.filter(user => user.is_active).length,
    rolesCount: roles?.length || 0,
    organizationsCount: organizations?.length || 0,
  };

  // Handlers
  const handleEditUser = useCallback((user: UserTableRow) => {
    showInfo(`Editando usuario: ${user.name}`);
    // TODO: Implementar modal de edición
  }, [showInfo]);

  const handleDeleteUser = useCallback(async (user: UserTableRow) => {
    try {
      showWarning(`¿Eliminar usuario ${user.name}?`);
      // TODO: Implementar confirmación y eliminación
    } catch {
      showError('Error al eliminar usuario');
    }
  }, [showWarning, showError]);

  const handleToggleStatus = useCallback(async (user: UserTableRow) => {
    try {
      await toggleUserStatus(Number(user.id));
      showSuccess(`Usuario ${user.is_active ? 'desactivado' : 'activado'} correctamente`);
      // Refetch current page
      fetchUsers();
    } catch {
      showError('Error al cambiar el estado del usuario');
    }
  }, [toggleUserStatus, showSuccess, showError, fetchUsers]);

  const handleAddUser = useCallback(() => {
    showInfo('Abriendo formulario para agregar usuario');
    // TODO: Implementar modal de creación
  }, [showInfo]);

  const handleRowClick = useCallback((user: UserTableRow) => {
    showInfo(`Ver detalles de: ${user.name}`);
    // TODO: Implementar vista de detalles
  }, [showInfo]);

  return {
    // Datos
    tableRows,
    stats,
    loading,
    error,
    roles,
    organizations,
    usersData,
    
    // Handlers
    handleEditUser,
    handleDeleteUser,
    handleToggleStatus,
    handleAddUser,
    handleRowClick,
    
    // Métodos de utilidad
    refetch: fetchUsers,
  };
}
