import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationSnackbar from '@/components/ui/NotificationSnackbar';
import SendInvitationModal from '@/components/SendInvitationModal';
import { OrganizationRequestsStats } from './OrganizationRequestsStats';
import { OrganizationRequestsFilters } from './OrganizationRequestsFilters';
import { OrganizationRequestsTable } from './OrganizationRequestsTable';
import { useOrganizationRequestsTable } from '../hooks/useOrganizationRequestsTable';
import { ORGANIZATION_REQUESTS_CONFIG } from '../config/organization-requests.config';

/**
 * Main Organization Requests page component - orchestrates the entire feature
 */
export const OrganizationRequestsPage: React.FC = () => {
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
    filters,
    handleFilterChange,
    handleViewRequest,
    handleRowClick,
    handleRetry,
    showInviteModal,
    handleShowInviteModal,
    handleCloseInviteModal,
    handleInviteSent,
    notification,
    notificationOpen,
    closeNotification,
  } = useOrganizationRequestsTable();

  // Load initial data
  useEffect(() => {
    handleRetry();
  }, [handleRetry]);

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
          >
            {ORGANIZATION_REQUESTS_CONFIG.page.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {ORGANIZATION_REQUESTS_CONFIG.page.description}
          </Typography>
        </Box>

        {/* Statistics */}
        <OrganizationRequestsStats stats={stats} />

        {/* Filters */}
        <OrganizationRequestsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Table */}
        <OrganizationRequestsTable
          rows={tableRows}
          loading={loading}
          error={error}
          page={currentPage}
          pageSize={pageSize}
          totalRows={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={handleRowClick}
          onView={handleViewRequest}
          onInvite={handleShowInviteModal}
          onRetry={handleRetry}
        />

        {/* Send Invitation Modal */}
        <SendInvitationModal
          isOpen={showInviteModal}
          onClose={handleCloseInviteModal}
          onSuccess={handleInviteSent}
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
