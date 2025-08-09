import { Box, Typography, Switch, Avatar, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import DataTable, { DataTableColumn, DataTableRow } from '@/components/ui/DataTable';
import { OrganizationTableRow, getStatusColor, ORGANIZATIONS_CONFIG } from '../config/organizations.config';

interface OrganizationsTableProps {
  rows: OrganizationTableRow[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (row: OrganizationTableRow) => void;
  onToggleStatus: (row: OrganizationTableRow) => void;
  onEdit: (row: OrganizationTableRow) => void;
  onDelete: (row: OrganizationTableRow) => void;
  onAdd: () => void;
  onRetry: () => void;
}

/**
 * Organizations table component with Material-UI DataGrid
 */
export const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  rows,
  loading,
  error,
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onToggleStatus,
  onEdit,
  onDelete,
  onAdd,
  onRetry,
}) => {
  const config = ORGANIZATIONS_CONFIG.table;

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      field: 'name',
      headerName: 'Organización',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const row = params.row as OrganizationTableRow;
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
              {row.website_url && (
                <Typography variant="caption" color="text.secondary">
                  {row.website_url}
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
      sortable: false,
    },
    {
      field: 'users_count',
      headerName: 'Usuarios',
      width: 120,
      renderCell: (params) => {
        const count = params.value as number || 0;
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            <Chip
              label={count.toString()}
              size="small"
              variant="outlined"
              color="info"
            />
          </Box>
        );
      },
    },
    {
      field: 'events_count',
      headerName: 'Eventos',
      width: 120,
      renderCell: (params) => {
        const count = params.value as number || 0;
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            <Chip
              label={count.toString()}
              size="small"
              variant="outlined"
              color="warning"
            />
          </Box>
        );
      },
    },
    {
      field: 'address',
      headerName: 'Ubicación',
      width: 200,
      renderCell: (params) => {
        const address = params.value as string;
        return (
          <Typography variant="body2" noWrap>
            {address || 'Sin dirección'}
          </Typography>
        );
      },
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => {
        const row = params.row as OrganizationTableRow;
        
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
              color={getStatusColor(row.is_active) as 'success' | 'error'}
            />
            <Typography variant="caption" color="text.secondary">
              {row.is_active ? 'Activa' : 'Inactiva'}
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
      label: config.actions.edit.label,
      onClick: (row: DataTableRow) => onEdit(row as OrganizationTableRow),
      color: config.actions.edit.color,
    },
    {
      icon: <DeleteIcon />,
      label: config.actions.delete.label,
      onClick: (row: DataTableRow) => onDelete(row as OrganizationTableRow),
      color: config.actions.delete.color,
    },
  ];

  return (
    <DataTable
      rows={rows}
      columns={columns}
      loading={loading}
      error={error}
      page={page}
      pageSize={pageSize}
      totalRows={totalRows}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      actions={actions}
      onRowClick={(row: DataTableRow) => onRowClick(row as OrganizationTableRow)}
      title="Lista de Organizaciones"
      primaryAction={{
        label: config.primaryAction.label,
        onClick: onAdd,
        icon: <AddIcon />,
      }}
      height={config.height}
      onRetry={onRetry}
    />
  );
};
