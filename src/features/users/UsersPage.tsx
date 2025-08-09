'use client';

import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationSnackbar, { useNotifications } from '@/components/ui/NotificationSnackbar';
import { UsersStats } from './components/UsersStats';
import { UsersTable } from './components/UsersTable';
import { useUsersTable } from './hooks/useUsersTable';

/**
 * Página principal de gestión de usuarios - Refactorizada con arquitectura modular
 */
export default function UsersPage() {
  const {
    tableRows,
    stats,
    loading,
    error,
    usersData,
    handleEditUser,
    handleDeleteUser,
    handleToggleStatus,
    handleAddUser,
    handleRowClick,
    refetch,
  } = useUsersTable();

  const {
    notification,
    open: notificationOpen,
    closeNotification,
  } = useNotifications();

  // Fetch data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
    // TODO: Implement pagination logic
  };

  const handlePageSizeChange = (newPageSize: number) => {
    console.log('Page size changed to:', newPageSize);
    // TODO: Implement page size change logic
  };

  return (
    <DashboardLayout>
      {/* Estadísticas */}
      <UsersStats 
        stats={stats}
      />

      {/* Tabla de Usuarios */}
      <UsersTable
        tableRows={tableRows}
        loading={loading}
        error={error}
        usersData={usersData}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onAddUser={handleAddUser}
        onRowClick={handleRowClick}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onRetry={refetch}
      />

      {/* Notificaciones */}
      <NotificationSnackbar
        notification={notification}
        open={notificationOpen}
        onClose={closeNotification}
      />
    </DashboardLayout>
  );
}
