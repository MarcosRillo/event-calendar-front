import { useState, useCallback, useMemo } from 'react';
import { useOrganizationRequests } from '@/hooks/useOrganizationRequests';
import { useNotifications } from '@/components/ui/NotificationSnackbar';
import { useRouter } from 'next/navigation';
import { 
  OrganizationRequestTableRow, 
  transformOrganizationRequestToTableRow,
  ORGANIZATION_REQUESTS_CONFIG 
} from '../config/organization-requests.config';

interface OrganizationRequestFilters {
  search: string;
  status: string;
}

/**
 * Custom hook for Organization Requests table management
 */
export const useOrganizationRequestsTable = () => {
  const router = useRouter();
  const {
    requestsData,
    loading,
    error,
    fetchRequests,
    clearError,
  } = useOrganizationRequests();

  const {
    notification,
    open: notificationOpen,
    closeNotification,
    showSuccess,
  } = useNotifications();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(ORGANIZATION_REQUESTS_CONFIG.page.defaultPageSize);
  const [filters, setFilters] = useState<OrganizationRequestFilters>({ 
    search: '', 
    status: 'all' 
  });

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Transform data for table
  const tableRows: OrganizationRequestTableRow[] = useMemo(() => {
    return requestsData?.data ? requestsData.data.map(transformOrganizationRequestToTableRow) : [];
  }, [requestsData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = requestsData?.meta?.total ?? 0;
    const pending = Array.isArray(requestsData?.data)
      ? requestsData.data.filter(r => r.status?.name === 'pending').length
      : 0;
    const approved = Array.isArray(requestsData?.data)
      ? requestsData.data.filter(r => r.status?.name === 'approved').length
      : 0;
    const rejected = Array.isArray(requestsData?.data)
      ? requestsData.data.filter(r => r.status?.name === 'rejected').length
      : 0;
    const corrections = Array.isArray(requestsData?.data)
      ? requestsData.data.filter(r => r.status?.name === 'corrections_needed').length
      : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      corrections,
    };
  }, [requestsData]);

  // Page handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchRequests(page + 1, filters); // API uses 1-based pagination
  }, [fetchRequests, filters]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    fetchRequests(1, filters);
  }, [fetchRequests, filters]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: OrganizationRequestFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
    fetchRequests(1, newFilters);
  }, [fetchRequests]);

  // Action handlers
  const handleViewRequest = useCallback((request: OrganizationRequestTableRow) => {
    router.push(`/super-admin/organization-requests/${request.id}`);
  }, [router]);

  const handleRowClick = useCallback((row: OrganizationRequestTableRow) => {
    handleViewRequest(row);
  }, [handleViewRequest]);

  const handleShowInviteModal = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  const handleCloseInviteModal = useCallback(() => {
    setShowInviteModal(false);
  }, []);

  const handleInviteSent = useCallback(() => {
    showSuccess('Invitación enviada exitosamente');
    setShowInviteModal(false);
    // Refresh data
    fetchRequests(currentPage + 1, filters);
  }, [showSuccess, fetchRequests, currentPage, filters]);

  const handleRetry = useCallback(() => {
    fetchRequests(currentPage + 1, filters);
    clearError();
  }, [fetchRequests, currentPage, filters, clearError]);

  return {
    // Data
    tableRows,
    stats,
    totalCount: requestsData?.meta?.total || 0,
    loading,
    error,

    // Pagination
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,

    // Filters
    filters,
    handleFilterChange,

    // Actions
    handleViewRequest,
    handleRowClick,
    handleRetry,

    // Modal
    showInviteModal,
    handleShowInviteModal,
    handleCloseInviteModal,
    handleInviteSent,

    // Notifications
    notification,
    notificationOpen,
    closeNotification,
  };
};
