"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import NotificationSnackbar, { useNotifications } from "@/components/ui/NotificationSnackbar";
import SendInvitationModal from "@/components/SendInvitationModal";
import { useRouter } from "next/navigation";
import { useOrganizationRequests, OrganizationRequest } from "@/hooks/useOrganizationRequests";

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "corrections_needed", label: "Necesitan Correcciones" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "error";
    case "corrections_needed":
      return "info";
    default:
      return "default";
  }
}

export default function OrganizationRequestsPage() {
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
  } = useNotifications();

  const [filters, setFilters] = useState({ search: "", status: "all" });
  const [currentPage, setCurrentPage] = useState(0); // DataTable usa 0-based
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Fetch data on mount and when filters/page change
  useEffect(() => {
    fetchRequests(currentPage + 1, filters);
  }, [fetchRequests, currentPage, filters]);

  // Métricas robustas ante datos indefinidos
  const total = requestsData?.meta?.total ?? 0;
  const pending = Array.isArray(requestsData?.data)
    ? requestsData.data.filter(r => r.status?.name === "pending").length
    : 0;
  const approved = Array.isArray(requestsData?.data)
    ? requestsData.data.filter(r => r.status?.name === "approved").length
    : 0;
  const rejected = Array.isArray(requestsData?.data)
    ? requestsData.data.filter(r => r.status?.name === "rejected").length
    : 0;
  const corrections = Array.isArray(requestsData?.data)
    ? requestsData.data.filter(r => r.status?.name === "corrections_needed").length
    : 0;

  // DataTable columns
  const columns: DataTableColumn[] = [
    {
      field: "organization_data",
      headerName: "Organización",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const org = (params.row as OrganizationRequest).organization_data;
        return (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {org?.name || "Sin datos"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {org?.email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "admin_data",
      headerName: "Admin",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const admin = (params.row as OrganizationRequest).admin_data;
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
      field: "status",
      headerName: "Estado",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = (params.row as OrganizationRequest).status.name;
        return (
          <Chip
            label={STATUS_OPTIONS.find(opt => opt.value === status)?.label || status}
            color={getStatusColor(status)}
            size="small"
            variant="filled"
          />
        );
      },
    },
    {
      field: "created_at",
      headerName: "Fecha de Solicitud",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value as string).toLocaleDateString() : "-"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        const row = params.row as OrganizationRequest;
        return (
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              color="primary"
              onClick={() => router.push(`/super-admin/organization-requests/${row.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  // DataTable rows
  const rows: OrganizationRequest[] = requestsData?.data ?? [];

  // Filtros UI
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

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
            <Typography variant="h4" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
              Solicitudes de Organizaciones
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona las solicitudes de nuevas organizaciones
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowInviteModal(true)}
            sx={{ ml: 2 }}
          >
            Enviar Invitación
          </Button>
        </Box>

        {/* Stats Cards */}
        {loading && !requestsData ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            {[1, 2, 3, 4].map((index) => (
              <Card key={index}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
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
                md: "repeat(4, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h5" fontWeight={700}>{total}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Pendientes
                </Typography>
                <Typography variant="h5" fontWeight={700}>{pending}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Aprobadas
                </Typography>
                <Typography variant="h5" fontWeight={700}>{approved}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Rechazadas
                </Typography>
                <Typography variant="h5" fontWeight={700}>{rejected + corrections}</Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Filtros */}
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
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Buscar"
                variant="outlined"
                size="small"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Nombre, email, admin..."
              />
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status}
                  label="Estado"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Tabla de solicitudes */}
        <DataTable
          rows={rows}
          columns={columns}
          loading={loading}
          error={error}
          page={currentPage}
          onPageChange={setCurrentPage}
          totalRows={requestsData?.meta.total || 0}
          onRetry={() => fetchRequests(currentPage + 1, filters)}
        />

        {/* Modal de invitación */}
        <SendInvitationModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            fetchRequests(currentPage + 1, filters);
          }}
        />

        {/* Notificaciones */}
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
                  <Button
                    size="small"
                    onClick={() => fetchRequests(currentPage + 1, filters)}
                    sx={{ color: "inherit" }}
                  >
                    Reintentar
                  </Button>
                  <Button
                    size="small"
                    onClick={clearError}
                    sx={{ color: "inherit" }}
                  >
                    Cerrar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
