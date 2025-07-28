'use client';

import { 
  DataGrid, 
  GridColDef, 
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridRowId,
} from '@mui/x-data-grid';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

// Define generic row type
export interface DataTableRow {
  id: GridRowId;
  [key: string]: unknown;
}

export interface DataTableColumn extends Omit<GridColDef, 'renderCell'> {
  renderCell?: (params: { value: unknown; row: DataTableRow }) => React.ReactNode;
}

export interface DataTableAction {
  icon: React.ReactElement;
  label: string;
  onClick: (row: DataTableRow) => void;
  disabled?: (row: DataTableRow) => boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface DataTableProps {
  // Data
  rows: DataTableRow[];
  columns: DataTableColumn[];
  loading?: boolean;
  error?: string | null;
  
  // Pagination
  page?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  
  // Sorting
  sortModel?: GridSortModel;
  onSortChange?: (model: GridSortModel) => void;
  
  // Filtering
  filterModel?: GridFilterModel;
  onFilterChange?: (model: GridFilterModel) => void;
  
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  // Actions
  actions?: DataTableAction[];
  onRowClick?: (row: DataTableRow) => void;
  
  // Header
  title?: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactElement;
  };
  
  // Configuration
  disableToolbar?: boolean;
  disableSearch?: boolean;
  height?: number | string;
  density?: 'compact' | 'standard' | 'comfortable';
  
  // Retry function for errors
  onRetry?: () => void;
}

// Custom toolbar component
interface CustomToolbarProps {
  title?: string;
  primaryAction?: DataTableProps['primaryAction'];
  disableSearch?: boolean;
}

function CustomToolbar({ 
  title, 
  primaryAction, 
  disableSearch 
}: CustomToolbarProps) {
  return (
    <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between' }}>
      <Box>
        {title && (
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        {!disableSearch && <GridToolbarQuickFilter />}
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        
        {primaryAction && (
          <Button
            variant="contained"
            color="primary"
            startIcon={primaryAction.icon || <AddIcon />}
            onClick={primaryAction.onClick}
            sx={{ ml: 1 }}
          >
            {primaryAction.label}
          </Button>
        )}
      </Box>
    </GridToolbarContainer>
  );
}

export default function DataTable({
  rows,
  columns,
  loading = false,
  error = null,
  page = 0,
  pageSize = 25,
  totalRows,
  onPageChange,
  onPageSizeChange,
  sortModel,
  onSortChange,
  filterModel,
  onFilterChange,
  actions = [],
  onRowClick,
  title,
  primaryAction,
  disableToolbar = false,
  disableSearch = false,
  height = 500,
  density = 'standard',
  onRetry,
}: DataTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page,
    pageSize,
  });

  // Add actions column if actions are provided
  const enhancedColumns: GridColDef[] = [
    ...columns as GridColDef[],
    ...(actions.length > 0 ? [{
      field: 'actions',
      type: 'actions' as const,
      headerName: 'Acciones',
      width: 120,
      getActions: (params: GridRowParams) => 
        actions.map((action, index) => (
          <GridActionsCellItem
            key={index}
            icon={
              <Tooltip title={action.label}>
                {action.icon}
              </Tooltip>
            }
            label={action.label}
            onClick={() => action.onClick(params.row as DataTableRow)}
            disabled={action.disabled ? action.disabled(params.row as DataTableRow) : false}
          />
        ))
    }] : [])
  ];

  // Handle pagination change
  const handlePaginationChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
    if (onPageChange && newPaginationModel.page !== page) {
      onPageChange(newPaginationModel.page);
    }
    if (onPageSizeChange && newPaginationModel.pageSize !== pageSize) {
      onPageSizeChange(newPaginationModel.pageSize);
    }
  };

  // Error state
  if (error && !loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <ErrorDisplay
          title="Error al cargar los datos"
          message={error}
          onRetry={onRetry}
        />
      </Paper>
    );
  }

  // Loading state
  if (loading && rows.length === 0) {
    return (
      <Paper sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Cargando datos..." />
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', height }}>
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        loading={loading}
        
        // Pagination
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        rowCount={onPageChange ? totalRows || rows.length : undefined}
        paginationMode={onPageChange ? 'server' : 'client'}
        pageSizeOptions={[10, 25, 50, 100]}
        
        // Sorting
        sortModel={sortModel}
        onSortModelChange={onSortChange}
        sortingMode={onSortChange ? 'server' : 'client'}
        
        // Filtering
        filterModel={filterModel}
        onFilterModelChange={onFilterChange}
        filterMode={onFilterChange ? 'server' : 'client'}
        
        // Row interaction
        onRowClick={onRowClick ? (params) => onRowClick(params.row as DataTableRow) : undefined}
        
        // Appearance
        density={density}
        disableRowSelectionOnClick
        
        // Toolbar
        slots={{
          toolbar: disableToolbar ? undefined : () => (
            <CustomToolbar
              title={title}
              primaryAction={primaryAction}
              disableSearch={disableSearch}
            />
          ),
        }}
        
        // Styling
        sx={{
          border: 0,
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'grey.50',
            borderBottom: '2px solid',
            borderBottomColor: 'divider',
          },
        }}
      />
    </Paper>
  );
}

// Helper function to create status chip column
export function createStatusColumn(
  field: string,
  headerName: string = 'Estado',
  getColor: (value: unknown) => 'success' | 'error' | 'warning' | 'info' = (value) => value ? 'success' : 'error',
  getLabel: (value: unknown) => string = (value) => value ? 'Activo' : 'Inactivo'
): DataTableColumn {
  return {
    field,
    headerName,
    width: 120,
    renderCell: (params) => (
      <Chip
        label={getLabel(params.value)}
        color={getColor(params.value)}
        size="small"
        variant="outlined"
      />
    ),
  };
}

// Helper function to create date column
export function createDateColumn(
  field: string,
  headerName: string,
  width: number = 150
): DataTableColumn {
  return {
    field,
    headerName,
    width,
    type: 'dateTime',
    valueGetter: (value) => value ? new Date(value as string) : null,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.value && params.value instanceof Date ? new Intl.DateTimeFormat('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(params.value) : '-'}
      </Typography>
    ),
  };
}

// Helper function to create actions
export function createTableActions(config: {
  onEdit?: (row: DataTableRow) => void;
  onDelete?: (row: DataTableRow) => void;
  onView?: (row: DataTableRow) => void;
  canEdit?: (row: DataTableRow) => boolean;
  canDelete?: (row: DataTableRow) => boolean;
  canView?: (row: DataTableRow) => boolean;
}): DataTableAction[] {
  const actions: DataTableAction[] = [];

  if (config.onView) {
    actions.push({
      icon: <ViewIcon />,
      label: 'Ver',
      onClick: config.onView,
      disabled: config.canView ? (row) => !config.canView!(row) : undefined,
      color: 'info',
    });
  }

  if (config.onEdit) {
    actions.push({
      icon: <EditIcon />,
      label: 'Editar',
      onClick: config.onEdit,
      disabled: config.canEdit ? (row) => !config.canEdit!(row) : undefined,
      color: 'primary',
    });
  }

  if (config.onDelete) {
    actions.push({
      icon: <DeleteIcon />,
      label: 'Eliminar',
      onClick: config.onDelete,
      disabled: config.canDelete ? (row) => !config.canDelete!(row) : undefined,
      color: 'error',
    });
  }

  return actions;
}
