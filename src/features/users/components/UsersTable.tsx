'use client';

import { useCallback, useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Avatar,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import DataTable, { 
  DataTableColumn, 
  DataTableRow,
} from '@/components/ui/DataTable';
import { PaginatedUsers } from '@/types';

import { UserTableRow, getRoleColor, USERS_CONFIG } from '../config/users.config';

interface UsersTableProps {
  tableRows: UserTableRow[];
  loading: boolean;
  error: string | null;
  usersData: PaginatedUsers | null;
  onEditUser: (user: UserTableRow) => void;
  onDeleteUser: (user: UserTableRow) => void;
  onToggleStatus: (user: UserTableRow) => void;
  onAddUser: () => void;
  onRowClick: (user: UserTableRow) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
}

/**
 * Componente de tabla de usuarios con configuración modular
 */
export function UsersTable({
  tableRows,
  loading,
  error,
  usersData,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onAddUser,
  onRowClick,
  onPageChange,
  onPageSizeChange,
  onRetry,
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(USERS_CONFIG.DEFAULT_PAGE_SIZE);

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      field: 'name',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const row = params.row as UserTableRow;
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
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
            </Box>
          </Box>
        );
      },
      sortable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 140,
      renderCell: (params) => {
        const role = params.value as UserTableRow['role'];
        
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            <Chip
              label={role.name}
              color={getRoleColor(role.name)}
              size="small"
              variant="outlined"
            />
          </Box>
        );
      },
      sortable: false,
    },
    {
      field: 'organization',
      headerName: 'Organización',
      width: 200,
      renderCell: (params) => {
        const org = params.value as UserTableRow['organization'];
        return (
          <Typography variant="body2" noWrap>
            {org?.name || 'Sin organización'}
          </Typography>
        );
      },
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => {
        const row = params.row as UserTableRow;
        
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            height: '100%'
          }}>
            <Switch
              checked={row.is_active}
              onChange={() => onToggleStatus(row)}
              size="small"
              disabled={row.role.name.includes('super_admin')}
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
      onClick: (row: DataTableRow) => onEditUser(row as UserTableRow),
      color: 'primary' as const,
    },
    {
      icon: <DeleteIcon />,
      label: 'Eliminar',
      onClick: (row: DataTableRow) => onDeleteUser(row as UserTableRow),
      disabled: (row: DataTableRow) => {
        const user = row as UserTableRow;
        return user.role.name.includes('super_admin');
      },
      color: 'error' as const,
    },
  ];

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  }, [onPageChange]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    onPageSizeChange(newPageSize);
  }, [onPageSizeChange]);

  const handleRowClick = useCallback((row: DataTableRow) => {
    onRowClick(row as UserTableRow);
  }, [onRowClick]);

  return (
    <DataTable
      rows={tableRows}
      columns={columns}
      loading={loading}
      error={error}
      page={currentPage}
      pageSize={pageSize}
      totalRows={usersData?.total || 0}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      actions={actions}
      onRowClick={handleRowClick}
      title="Lista de Usuarios"
      primaryAction={{
        label: 'Agregar Usuario',
        onClick: onAddUser,
        icon: <AddIcon />,
      }}
      height={USERS_CONFIG.TABLE_HEIGHT}
      onRetry={onRetry}
    />
  );
}
