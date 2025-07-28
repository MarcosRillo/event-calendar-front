"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Switch,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  Skeleton,
  Button,
  Avatar,
} from "@mui/material";
import {
  Event as EventIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable, {
  DataTableColumn,
  DataTableRow,
  createDateColumn,
} from "@/components/ui/DataTable";
import StatsCard from "@/components/ui/StatsCard";
import NotificationSnackbar, {
  useNotifications,
} from "@/components/ui/NotificationSnackbar";
import ConfirmDialog from "@/components/forms/ConfirmDialog";

import { Event } from "@/types";
import { useEventManagement, EventFilters } from "@/hooks/useEventManagement";

// Transform Event type to DataTableRow
interface EventTableRow extends DataTableRow {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  organization: {
    id: number;
    name: string;
    slug: string;
  };
  status?: {
    id: number;
    name: string;
  };
  is_active?: boolean;
  created_at: string;
}

export default function EventsManagement() {
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
    showSuccess,
    showError,
    showInfo,
    closeNotification,
  } = useNotifications();

  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<EventFilters>({});

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventTableRow | null>(
    null
  );

  // Fetch initial data
  useEffect(() => {
    fetchEvents(currentPage + 1, filters); // API uses 1-based pagination
    fetchEventStatuses();
    fetchOrganizations();
  }, [
    fetchEvents,
    fetchEventStatuses,
    fetchOrganizations,
    currentPage,
    filters,
  ]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: EventFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  }, []);

  // Handle event status toggle
  const handleToggleEventStatus = useCallback(
    async (eventId: number) => {
      try {
        await toggleEventStatus(eventId);
        showSuccess("Estado del evento actualizado exitosamente");
      } catch {
        showError("Error al actualizar estado del evento");
      }
    },
    [toggleEventStatus, showSuccess, showError]
  );

  // Handle delete event
  const handleDeleteEvent = useCallback((event: EventTableRow) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteEvent = useCallback(async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete.id);
      showSuccess("Evento eliminado exitosamente");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch {
      showError("Error al eliminar evento");
    }
  }, [eventToDelete, deleteEvent, showSuccess, showError]);

  // Transform events to table rows
  const transformEventToTableRow = useCallback(
    (event: Event): EventTableRow => ({
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      organization: event.organization,
      status: event.status,
      is_active: true, // Default to true - we'll manage this state separately
      created_at: event.created_at,
    }),
    []
  );

  const rows: EventTableRow[] =
    eventsData?.data.map(transformEventToTableRow) || [];

  // Ensure arrays are valid for rendering
  const safeOrganizations = Array.isArray(organizations) ? organizations : [];
  const safeEventStatuses = Array.isArray(eventStatuses) ? eventStatuses : [];

  // Define table columns - Optimized for responsive design
  const columns: DataTableColumn[] = [
    {
      field: "event_info",
      headerName: "Evento",
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5,
              py: 1,
              width: "100%",
              height: '100%'
            }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              <EventIcon />
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{
                  wordBreak: "break-word",
                  lineHeight: 1.3,
                }}
              >
                {row.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.3,
                }}
              >
                {row.description}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "organization",
      headerName: "Organización",
      flex: 0.8,
      minWidth: 200,
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              height: '100%'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                wordBreak: "break-word",
              }}
            >
              {row.organization.name}
            </Typography>
          </Box>
        );
      },
    },
    createDateColumn("start_date", "Fecha Inicio", 130),
    createDateColumn("end_date", "Fecha Fin", 130),
    {
      field: "status",
      headerName: "Estado",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Chip
              label={row.status?.name || "Sin Estado"}
              size="small"
              color={row.status?.name === "active" ? "success" : "default"}
              variant="filled"
              sx={{
                fontSize: "0.75rem",
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
      field: "is_active",
      headerName: "Activo",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Tooltip
              title={row.is_active ? "Desactivar evento" : "Activar evento"}
            >
              <Switch
                checked={row.is_active}
                onChange={() => handleToggleEventStatus(row.id)}
                size="small"
                color="primary"
              />
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        const row = params.row as EventTableRow;
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 0.5,
              width: "100%",
            }}
          >
            <Tooltip title="Ver detalles">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  showInfo(`Ver detalles del evento: ${row.title}`);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar evento">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  showInfo(`Editar evento: ${row.title}`);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar evento">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteEvent(row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // Calculate stats for StatsCards
  const totalEvents = eventsData?.total || 0;
  const activeEvents = rows.filter((event) => event.is_active).length;
  const inactiveEvents = rows.filter((event) => !event.is_active).length;

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
            >
              Gestión de Eventos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Administra eventos de todas las organizaciones
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              showInfo("Funcionalidad de crear evento próximamente")
            }
            sx={{ ml: 2 }}
          >
            Crear Evento
          </Button>
        </Box>

        {/* Stats Cards */}
        {loading && !eventsData ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            {[1, 2, 3].map((index) => (
              <Card key={index}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={32}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            <StatsCard
              title="Total de Eventos"
              value={totalEvents}
              icon={<EventIcon />}
              color="primary"
            />
            <StatsCard
              title="Eventos Activos"
              value={activeEvents}
              icon={<EventIcon />}
              color="success"
            />
            <StatsCard
              title="Eventos Inactivos"
              value={inactiveEvents}
              icon={<EventIcon />}
              color="warning"
            />
          </Box>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FilterListIcon color="action" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filtros
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(5, 1fr)",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Buscar eventos"
                variant="outlined"
                size="small"
                value={filters.search || ""}
                onChange={(e) =>
                  handleFilterChange({ ...filters, search: e.target.value })
                }
                placeholder="Título, descripción..."
              />
              <TextField
                fullWidth
                label="Fecha Inicio"
                type="date"
                variant="outlined"
                size="small"
                value={filters.start_date || ""}
                onChange={(e) =>
                  handleFilterChange({ ...filters, start_date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Fecha Fin"
                type="date"
                variant="outlined"
                size="small"
                value={filters.end_date || ""}
                onChange={(e) =>
                  handleFilterChange({ ...filters, end_date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Organización</InputLabel>
                <Select
                  value={filters.organization_id || ""}
                  label="Organización"
                  onChange={(e: SelectChangeEvent<string | number>) =>
                    handleFilterChange({
                      ...filters,
                      organization_id: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                >
                  <MenuItem value="">Todas</MenuItem>
                  {safeOrganizations.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status || ""}
                  label="Estado"
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleFilterChange({
                      ...filters,
                      status: e.target.value || undefined,
                    })
                  }
                >
                  <MenuItem value="">Todos</MenuItem>
                  {safeEventStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.name}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Events Table */}
        <DataTable
          rows={rows}
          columns={columns}
          loading={loading}
          error={error}
          page={currentPage}
          onPageChange={handlePageChange}
          totalRows={eventsData?.total || 0}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setEventToDelete(null);
          }}
          onConfirm={confirmDeleteEvent}
          title="Eliminar Evento"
          message={
            eventToDelete
              ? `¿Estás seguro de que deseas eliminar el evento "${eventToDelete.title}"? Esta acción no se puede deshacer.`
              : ""
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        {/* Notifications */}
        <NotificationSnackbar
          open={notificationOpen}
          notification={notification}
          onClose={closeNotification}
        />

        {/* Error Display */}
        {error && (
          <Box sx={{ mt: 2 }}>
            <Card sx={{ bgcolor: "error.light", color: "error.contrastText" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Error
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => fetchEvents(currentPage + 1, filters)}
                    sx={{ color: "inherit" }}
                  >
                    Reintentar
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={clearError}
                    sx={{ color: "inherit" }}
                  >
                    Cerrar
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
