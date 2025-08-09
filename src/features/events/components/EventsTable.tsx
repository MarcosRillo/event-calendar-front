import { Box, Typography, Switch, Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import { 
  Event as EventIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Add as AddIcon 
} from '@mui/icons-material';
import DataTable, { DataTableColumn, DataTableRow, createDateColumn } from '@/components/ui/DataTable';
import { EventTableRow, getStatusColor, EVENTS_CONFIG } from '../config/events.config';

interface EventsTableProps {
  rows: EventTableRow[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (row: EventTableRow) => void;
  onToggleStatus: (row: EventTableRow) => void;
  onView: (row: EventTableRow) => void;
  onEdit: (row: EventTableRow) => void;
  onDelete: (row: EventTableRow) => void;
  onAdd: () => void;
  onRetry: () => void;
}

/**
 * Events table component with Material-UI DataGrid
 */
export const EventsTable: React.FC<EventsTableProps> = ({
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
  onView,
  onEdit,
  onDelete,
  onAdd,
  onRetry,
}) => {
  const config = EVENTS_CONFIG.table;

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      field: 'event_info',
      headerName: 'Evento',
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 1.5,
              py: 1,
              width: '100%',
              height: '100%'
            }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              <EventIcon />
            </Avatar>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{
                  wordBreak: 'break-word',
                  lineHeight: 1.3,
                }}
              >
                {row.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.3,
                }}
              >
                {row.description}
              </Typography>
            </Box>
          </Box>
        );
      },
      sortable: false,
    },
    {
      field: 'organization',
      headerName: 'Organización',
      flex: 0.8,
      minWidth: 200,
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              height: '100%'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                wordBreak: 'break-word',
              }}
            >
              {row.organization.name}
            </Typography>
          </Box>
        );
      },
    },
    createDateColumn('start_date', 'Fecha Inicio', 130),
    createDateColumn('end_date', 'Fecha Fin', 130),
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        const statusName = row.status?.name || 'Sin Estado';
        return (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Chip
              label={statusName}
              size="small"
              color={getStatusColor(statusName) as 'success' | 'warning' | 'error' | 'info' | 'default'}
              variant="filled"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                height: 24,
                minWidth: 80,
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'is_active',
      headerName: 'Activo',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Switch
              checked={row.is_active || false}
              onChange={() => onToggleStatus(row)}
              size="small"
              color="success"
            />
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={config.actions.view.label}>
              <IconButton
                size="small"
                color={config.actions.view.color}
                onClick={() => onView(row)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={config.actions.edit.label}>
              <IconButton
                size="small"
                color={config.actions.edit.color}
                onClick={() => onEdit(row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={config.actions.delete.label}>
              <IconButton
                size="small"
                color={config.actions.delete.color}
                onClick={() => onDelete(row)}
              >
                <DeleteIcon fontSize="small" />
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
      onRowClick={(row: DataTableRow) => onRowClick(row as EventTableRow)}
      title="Lista de Eventos"
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
