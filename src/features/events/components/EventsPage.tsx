import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationSnackbar from '@/components/ui/NotificationSnackbar';
import ConfirmDialog from '@/components/forms/ConfirmDialog';
import { EventsStats } from './EventsStats';
import { EventsFilters } from './EventsFilters';
import { EventsTable } from './EventsTable';
import { useEventsTable } from '../hooks/useEventsTable';
import { EVENTS_CONFIG } from '../config/events.config';

/**
 * Main Events page component - orchestrates the entire feature
 */
export const EventsPage: React.FC = () => {
  const {
    tableRows,
    stats,
    totalCount,
    loading,
    error,
    safeOrganizations,
    safeEventStatuses,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    filters,
    handleFilterChange,
    handleToggleStatus,
    handleViewEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleAddEvent,
    handleRowClick,
    handleRetry,
    deleteDialogOpen,
    eventToDelete,
    confirmDeleteEvent,
    cancelDeleteEvent,
    notification,
    notificationOpen,
    closeNotification,
  } = useEventsTable();

  // Load initial data
  useEffect(() => {
    handleRetry();
  }, [handleRetry]);

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
              {EVENTS_CONFIG.page.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {EVENTS_CONFIG.page.description}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEvent}
            sx={{ ml: 2 }}
          >
            {EVENTS_CONFIG.table.primaryAction.label}
          </Button>
        </Box>

        {/* Statistics */}
        <EventsStats stats={stats} />

        {/* Filters */}
        <EventsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          organizations={safeOrganizations}
          eventStatuses={safeEventStatuses}
        />

        {/* Table */}
        <EventsTable
          rows={tableRows}
          loading={loading}
          error={error}
          page={currentPage}
          pageSize={pageSize}
          totalRows={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={handleRowClick}
          onToggleStatus={handleToggleStatus}
          onView={handleViewEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onAdd={handleAddEvent}
          onRetry={handleRetry}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Confirmar eliminación"
          message={`¿Estás seguro de que deseas eliminar el evento "${eventToDelete?.title}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmDeleteEvent}
          onClose={cancelDeleteEvent}
        />

        {/* Notifications */}
        <NotificationSnackbar
          notification={notification}
          open={notificationOpen}
          onClose={closeNotification}
        />
      </Box>
    </DashboardLayout>
  );
};
