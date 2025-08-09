import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Visibility as VisibilityIcon, Add as AddIcon } from '@mui/icons-material';
import DataTable, { DataTableColumn, DataTableRow } from '@/components/ui/DataTable';
import { 
  OrganizationRequestTableRow, 
  getStatusColor, 
  getStatusLabel,
  ORGANIZATION_REQUESTS_CONFIG 
} from '../config/organization-requests.config';

interface OrganizationRequestsTableProps {
  rows: OrganizationRequestTableRow[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (row: OrganizationRequestTableRow) => void;
  onView: (row: OrganizationRequestTableRow) => void;
  onInvite: () => void;
  onRetry: () => void;
}

/**
 * Organization Requests table component with Material-UI DataGrid
 */
export const OrganizationRequestsTable: React.FC<OrganizationRequestsTableProps> = ({
  rows,
  loading,
  error,
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onView,
  onInvite,
  onRetry,
}) => {
  const config = ORGANIZATION_REQUESTS_CONFIG.table;

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      field: 'organization_data',
      headerName: 'Organización',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const row = params.row as OrganizationRequestTableRow;
        const org = row.organization_data;
        return (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {org?.name || 'Sin datos'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {org?.email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'admin_data',
      headerName: 'Admin',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const row = params.row as OrganizationRequestTableRow;
        const admin = row.admin_data;
        return (
          <Box>
            <Typography variant="body2">
              {admin?.first_name} {admin?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {admin?.email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const row = params.row as OrganizationRequestTableRow;
        const status = row.status.name;
        return (
          <Chip
            label={getStatusLabel(status)}
            color={getStatusColor(status) as 'success' | 'warning' | 'error' | 'info' | 'default'}
            size="small"
            variant="filled"
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Fecha Solicitud',
      width: 150,
      renderCell: (params) => {
        const row = params.row as OrganizationRequestTableRow;
        return (
          <Typography variant="body2">
            {new Date(row.created_at).toLocaleDateString('es-ES')}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        const row = params.row as OrganizationRequestTableRow;
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={config.actions.view.label}>
              <IconButton
                size="small"
                color={config.actions.view.color}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(row);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
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
      onRowClick={(row: DataTableRow) => onRowClick(row as OrganizationRequestTableRow)}
      title="Lista de Solicitudes"
      primaryAction={{
        label: config.primaryAction.label,
        onClick: onInvite,
        icon: <AddIcon />,
      }}
      height={config.height}
      onRetry={onRetry}
    />
  );
};
