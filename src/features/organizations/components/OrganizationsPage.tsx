import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationSnackbar from '@/components/ui/NotificationSnackbar';
import { OrganizationsStats } from './OrganizationsStats';
import { OrganizationsTable } from './OrganizationsTable';
import { useOrganizationsTable } from '../hooks/useOrganizationsTable';
import { ORGANIZATIONS_CONFIG } from '../config/organizations.config';

/**
 * Main Organizations page component - orchestrates the entire feature
 */
export const OrganizationsPage: React.FC = () => {
  const {
    tableRows,
    stats,
    totalCount,
    loading,
    error,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    handleToggleStatus,
    handleEditOrganization,
    handleDeleteOrganization,
    handleAddOrganization,
    handleRowClick,
    handleRetry,
    notification,
    notificationOpen,
    closeNotification,
  } = useOrganizationsTable();

  // Load initial data
  useEffect(() => {
    handleRetry(); // This will load the first page
  }, [handleRetry]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {ORGANIZATIONS_CONFIG.page.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {ORGANIZATIONS_CONFIG.page.description}
        </Typography>
      </Box>

      {/* Statistics */}
      <OrganizationsStats stats={stats} />

      {/* Table */}
      <OrganizationsTable
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
        onEdit={handleEditOrganization}
        onDelete={handleDeleteOrganization}
        onAdd={handleAddOrganization}
        onRetry={handleRetry}
      />

      {/* Notifications */}
      <NotificationSnackbar
        notification={notification}
        open={notificationOpen}
        onClose={closeNotification}
      />
    </DashboardLayout>
  );
};
