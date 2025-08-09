import { useState, useCallback, useMemo } from 'react';
import { useEventManagement, EventFilters } from '@/hooks/useEventManagement';
import { useNotifications } from '@/components/ui/NotificationSnackbar';
import { 
  EventTableRow, 
  transformEventToTableRow,
  EVENTS_CONFIG 
} from '../config/events.config';

/**
 * Custom hook for Events table management
 */
export const useEventsTable = () => {
  const {
    eventsData,
    loading,
    error,
    eventStatuses,
    organizations,
    fetchEvents,
    fetchEventStatuses,
    fetchOrganizations,
    toggleEventStatus,
    deleteEvent,
    clearError,
  } = useEventManagement();

  const {
    notification,
    open: notificationOpen,
    closeNotification,
    showSuccess,
    showError,
    showInfo,
  } = useNotifications();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(EVENTS_CONFIG.page.defaultPageSize);
  const [filters, setFilters] = useState<EventFilters>({});

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventTableRow | null>(null);

  // Transform data for table
  const tableRows: EventTableRow[] = useMemo(() => {
    return eventsData?.data ? eventsData.data.map(transformEventToTableRow) : [];
  }, [eventsData]);

  // Safe arrays for dropdowns
  const safeOrganizations = useMemo(() => {
    return Array.isArray(organizations) ? organizations : [];
  }, [organizations]);

  const safeEventStatuses = useMemo(() => {
    return Array.isArray(eventStatuses) ? eventStatuses : [];
  }, [eventStatuses]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEvents = eventsData?.total || 0;
    const activeEvents = tableRows.filter(event => event.is_active).length;
    const totalOrganizations = safeOrganizations.length;
    
    // Calculate upcoming events (events with start_date in the future)
    const now = new Date();
    const upcomingEvents = tableRows.filter(event => {
      const startDate = new Date(event.start_date);
      return startDate > now;
    }).length;

    return {
      totalEvents,
      activeEvents,
      totalOrganizations,
      upcomingEvents,
    };
  }, [tableRows, eventsData?.total, safeOrganizations.length]);

  // Page handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchEvents(page + 1, filters); // API uses 1-based pagination
  }, [fetchEvents, filters]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    fetchEvents(1, filters);
  }, [fetchEvents, filters]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: EventFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
    fetchEvents(1, newFilters);
  }, [fetchEvents]);

  // Action handlers
  const handleToggleStatus = useCallback(async (event: EventTableRow) => {
    try {
      await toggleEventStatus(Number(event.id));
      showSuccess('Estado del evento actualizado exitosamente');
      fetchEvents(currentPage + 1, filters);
    } catch {
      showError('Error al actualizar estado del evento');
    }
  }, [toggleEventStatus, showSuccess, showError, fetchEvents, currentPage, filters]);

  const handleViewEvent = useCallback((event: EventTableRow) => {
    showInfo(`Ver detalles del evento: ${event.title}`);
    // TODO: Navigate to event details or open modal
  }, [showInfo]);

  const handleEditEvent = useCallback((event: EventTableRow) => {
    showInfo(`Editando evento: ${event.title}`);
    // TODO: Open edit modal
  }, [showInfo]);

  const handleDeleteEvent = useCallback((event: EventTableRow) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteEvent = useCallback(async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete.id);
      showSuccess('Evento eliminado exitosamente');
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      fetchEvents(currentPage + 1, filters);
    } catch {
      showError('Error al eliminar evento');
    }
  }, [eventToDelete, deleteEvent, showSuccess, showError, fetchEvents, currentPage, filters]);

  const cancelDeleteEvent = useCallback(() => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  }, []);

  const handleAddEvent = useCallback(() => {
    showInfo('Abriendo formulario para agregar evento');
    // TODO: Open add event modal
  }, [showInfo]);

  const handleRowClick = useCallback((row: EventTableRow) => {
    handleViewEvent(row);
  }, [handleViewEvent]);

  const handleRetry = useCallback(() => {
    fetchEvents(currentPage + 1, filters);
    fetchEventStatuses();
    fetchOrganizations();
    clearError();
  }, [fetchEvents, fetchEventStatuses, fetchOrganizations, clearError, currentPage, filters]);

  return {
    // Data
    tableRows,
    stats,
    totalCount: eventsData?.total || 0,
    loading,
    error,
    safeOrganizations,
    safeEventStatuses,

    // Pagination
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,

    // Filters
    filters,
    handleFilterChange,

    // Actions
    handleToggleStatus,
    handleViewEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleAddEvent,
    handleRowClick,
    handleRetry,

    // Delete confirmation
    deleteDialogOpen,
    eventToDelete,
    confirmDeleteEvent,
    cancelDeleteEvent,

    // Notifications
    notification,
    notificationOpen,
    closeNotification,
  };
};
