'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Avatar,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { 
  DataTableColumn, 
  DataTableRow,
  createStatusColumn,
} from '@/components/ui/DataTable';
import StatsCard from '@/components/ui/StatsCard';
import NotificationSnackbar, { useNotifications } from '@/components/ui/NotificationSnackbar';

import { User } from '@/types';
import { useUserManagement } from '@/hooks/useUserManagement';

// Transform User type to DataTableRow
interface UserTableRow extends DataTableRow {
  id: number;
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

export default function UsersManagement() {
  const {
    usersData,
    loading,
    error,
    roles,
    organizations,
    fetchUsers,
    fetchRoles,
    fetchOrganizations,
    toggleUserStatus,
  } = useUserManagement();

  const {
    notification,
    open: notificationOpen,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
  } = useNotifications();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const searchTerm = '';

  // Fetch initial data
  useEffect(() => {
    fetchUsers(currentPage + 1, searchTerm); // API uses 1-based pagination
    fetchRoles();
    fetchOrganizations();
  }, [fetchUsers, fetchRoles, fetchOrganizations, currentPage, searchTerm]);

  // Define table columns - Optimized for responsive design
  const columns: DataTableColumn[] = [
    {
      field: 'user_info',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const row = params.row as UserTableRow;
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start',
            gap: 1.5, 
            py: 0.5,
            height: '100%'
          }}>
            <Avatar sx={{ width: 40, height: 40, fontSize: '0.875rem' }}>
              {row.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {row.name}
              </Typography>
              {/* <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography> */}
            </Box>
          </Box>
        );
      },
      sortable: false,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 140,
      renderCell: (params) => {
        const role = params.value as UserTableRow['role'];
        const getRoleColor = (roleName: string) => {
          switch (roleName.toLowerCase()) {
            case 'super_admin': return 'error';
            case 'admin': return 'warning';
            case 'organization_admin': return 'info';
            case 'user': return 'success';
            default: return 'default';
          }
        };
        
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            <Chip
              label={role.name}
              color={getRoleColor(role.name) as 'error' | 'warning' | 'info' | 'success' | 'default'}
              size="small"
              variant="outlined"
            />
          </Box>
        );
      },
    },
    {
      field: 'organization',
      headerName: 'Organización',
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => {
        const org = params.value as UserTableRow['organization'];
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            {org ? (
              <Typography variant="body2" noWrap>
                {org.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sin organización
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      ...createStatusColumn('is_active', 'Estado'),
      width: 120,
      renderCell: (params) => {
        const row = params.row as UserTableRow;
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            height: '100%'
          }}>
            <Switch
              checked={row.is_active}
              onChange={() => handleToggleStatus(row)}
              size="small"
              color={row.is_active ? 'success' : 'default'}
            />
            <Typography variant="caption" color="text.secondary">
              {row.is_active ? 'Activo' : 'Inactivo'}
            </Typography>
          </Box>
        );
      },
    },
  ];

  // Define table actions
  const actions = [
    {
      icon: <EditIcon />,
      label: 'Editar',
      onClick: handleEditUser,
      color: 'primary' as const,
    },
    {
      icon: <DeleteIcon />,
      label: 'Eliminar',
      onClick: handleDeleteUser,
      disabled: (row: DataTableRow) => {
        const user = row as UserTableRow;
        return user.role.name.includes('super_admin');
      },
      color: 'error' as const,
    },
  ];

  // Action handlers
  function handleEditUser(row: DataTableRow) {
    const user = row as UserTableRow;
    showInfo(`Editando usuario: ${user.name}`);
    // TODO: Open edit modal
  }

  function handleDeleteUser(row: DataTableRow) {
    const user = row as UserTableRow;
    showWarning(`¿Eliminar usuario ${user.name}?`);
    // TODO: Show confirmation dialog
  }

  const handleToggleStatus = useCallback(async (user: UserTableRow) => {
    try {
      await toggleUserStatus(user.id);
      showSuccess(`Usuario ${user.is_active ? 'desactivado' : 'activado'} correctamente`);
      fetchUsers(currentPage + 1, searchTerm);
    } catch {
      showError('Error al cambiar el estado del usuario');
    }
  }, [toggleUserStatus, showSuccess, showError, fetchUsers, currentPage, searchTerm]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  // Handle row click
  const handleRowClick = (row: DataTableRow) => {
    const user = row as UserTableRow;
    showInfo(`Ver detalles de: ${user.name}`);
  };

  // Add user action
  const handleAddUser = () => {
    showInfo('Agregando nuevo usuario...');
    // TODO: Open add user modal
  };

  // Prepare data for table
  const transformUsersToTableRows = (users: User[]): UserTableRow[] => {
    return users.map(user => ({
      ...user,
      name: `${user.first_name} ${user.last_name}`.trim(),
    }));
  };

  const tableRows: UserTableRow[] = usersData?.data ? transformUsersToTableRows(usersData.data) : [];
  const totalUsers = usersData?.total || 0;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra usuarios del sistema y sus roles
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          }, 
          gap: 3, 
          mb: 4 
        }}
      >
        <StatsCard
          title="Total Usuarios"
          value={totalUsers}
          icon={<PersonAddIcon />}
          color="primary"
        />
        <StatsCard
          title="Roles Disponibles"
          value={roles?.length || 0}
          icon={<BusinessIcon />}
          color="success"
        />
        <StatsCard
          title="Organizaciones"
          value={organizations?.length || 0}
          icon={<BusinessIcon />}
          color="info"
        />
        <StatsCard
          title="Usuarios Activos"
          value={tableRows.filter(user => user.is_active).length}
          icon={<PersonAddIcon />}
          color="success"
        />
      </Box>

      {/* Data Table */}
      <DataTable
        rows={tableRows}
        columns={columns}
        loading={loading}
        error={error}
        page={currentPage}
        pageSize={pageSize}
        totalRows={totalUsers}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        actions={actions}
        onRowClick={handleRowClick}
        title="Lista de Usuarios"
        primaryAction={{
          label: 'Agregar Usuario',
          onClick: handleAddUser,
          icon: <AddIcon />,
        }}
        height={600}
        onRetry={() => fetchUsers(currentPage + 1, searchTerm)}
      />

      {/* Notifications */}
      <NotificationSnackbar
        notification={notification}
        open={notificationOpen}
        onClose={closeNotification}
      />
    </DashboardLayout>
  );
}
