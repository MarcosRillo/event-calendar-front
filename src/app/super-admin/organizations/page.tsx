"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Chip, Avatar, Switch } from "@mui/material";
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Domain as DomainIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable, {
  DataTableColumn,
  DataTableRow,
  createStatusColumn,
} from "@/components/ui/DataTable";
import StatsCard from "@/components/ui/StatsCard";
import NotificationSnackbar, {
  useNotifications,
} from "@/components/ui/NotificationSnackbar";

import { Organization } from "@/types";
import { useOrganizations } from "@/hooks/useOrganizations";

// Transform Organization type to DataTableRow
interface OrganizationTableRow extends DataTableRow {
  id: number;
  name: string;
  // slug: string;
  website_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users_count?: number;
  events_count?: number;
}

export default function OrganizationsManagement() {
  const {
    organizations,
    totalCount,
    isLoading,
    loadOrganizations,
    toggleOrganizationStatus,
    error,
  } = useOrganizations();

  const {
    notification,
    open: notificationOpen,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
  } = useNotifications();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  // Fetch initial data
  useEffect(() => {
    loadOrganizations({
      status: "all", // Mostrar todas las organizaciones (activas e inactivas)
      sort_by: "created_at",
      sort_direction: "desc",
      per_page: pageSize,
      page: page + 1, // API uses 1-based pagination
    });
  }, [loadOrganizations, page, pageSize]);

  // Define table columns - Optimized for responsive design
  const columns: DataTableColumn[] = [
    {
      field: "organization_info",
      headerName: "Organización",
      flex: 1,
      minWidth: 280,
      renderCell: (params) => {
        const org = params.row as OrganizationTableRow;
        return (
          <Box
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "flex-start",
              gap: 1.5, 
              py: 0.5,
              height: "100%"
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: "0.875rem",
                bgcolor: "primary.main",
              }}
            >
              {org.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {org.name}
              </Typography>
              {/* <Typography variant="caption" color="text.secondary">
                {org.email || org.slug}
              </Typography> */}
            </Box>
          </Box>
        );
      },
      sortable: false,
    },
    {
      field: "website_url",
      headerName: "Website",
      flex: 0.6,
      minWidth: 140,
      renderCell: (params) => {
        const url = params.value as string;
        return (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            height: "100%"
          }}>
            {url ? (
              <Typography
                variant="body2"
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                noWrap
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {url.replace(/^https?:\/\//, "")}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "stats",
      headerName: "Actividad",
      width: 120,
      renderCell: (params) => {
        const org = params.row as OrganizationTableRow;
        return (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 0.5,
            height: "100%"
          }}>
            <Chip
              label={String(org.users_count || 0)}
              size="small"
              color="info"
              variant="outlined"
              title="Usuarios"
            />
            <Chip
              label={String(org.events_count || 0)}
              size="small"
              color="secondary"
              variant="outlined"
              title="Eventos"
            />
          </Box>
        );
      },
      sortable: false,
    },
    {
      ...createStatusColumn("is_active", "Estado"),
      width: 120,
      renderCell: (params) => {
        const row = params.row as OrganizationTableRow;
        return (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 1,
            height: "100%"
          }}>
            <Switch
              checked={row.is_active}
              onChange={() => handleToggleStatus(row)}
              size="small"
              color={row.is_active ? "success" : "default"}
            />
            <Typography variant="caption" color="text.secondary">
              {row.is_active ? "Activa" : "Inactiva"}
            </Typography>
          </Box>
        );
      },
    },
  ];

  // Define table actions
  const actions = [
    {
      icon: <EditIcon />,
      label: "Editar",
      onClick: handleEditOrganization,
      color: "primary" as const,
    },
    {
      icon: <DeleteIcon />,
      label: "Eliminar",
      onClick: handleDeleteOrganization,
      color: "error" as const,
    },
  ];

  // Action handlers
  function handleEditOrganization(row: DataTableRow) {
    const org = row as OrganizationTableRow;
    showInfo(`Editando organización: ${org.name}`);
    // TODO: Open edit modal
  }

  function handleDeleteOrganization(row: DataTableRow) {
    const org = row as OrganizationTableRow;
    showWarning(`¿Eliminar organización ${org.name}?`);
    // TODO: Show confirmation dialog
  }

  const handleToggleStatus = useCallback(
    async (org: OrganizationTableRow) => {
      try {
        await toggleOrganizationStatus(org.id);
        showSuccess(
          `Organización ${
            org.is_active ? "desactivada" : "activada"
          } correctamente`
        );
        // Recargar la lista manteniendo el filtro actual (mostrar todas)
        loadOrganizations({
          status: "all", // Cambiar a 'all' para mostrar activas e inactivas
          sort_by: "created_at",
          sort_direction: "desc",
          per_page: pageSize,
          page: page + 1,
        });
      } catch {
        showError("Error al cambiar el estado de la organización");
      }
    },
    [
      toggleOrganizationStatus,
      showSuccess,
      showError,
      loadOrganizations,
      page,
      pageSize,
    ]
  );

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  // Handle row click
  const handleRowClick = (row: DataTableRow) => {
    const org = row as OrganizationTableRow;
    showInfo(`Ver detalles de: ${org.name}`);
  };

  // Add organization action
  const handleAddOrganization = () => {
    showInfo("Agregando nueva organización...");
    // TODO: Open add organization modal
  };

  // Prepare data for table
  const transformOrganizationsToTableRows = (
    orgs: Organization[]
  ): OrganizationTableRow[] => {
    return orgs.map((org) => ({
      ...org,
    }));
  };

  const tableRows: OrganizationTableRow[] = organizations
    ? transformOrganizationsToTableRows(organizations)
    : [];
  const totalOrganizations = totalCount || 0;

  // Calculate stats
  const activeOrganizations = tableRows.filter((org) => org.is_active).length;
  const totalUsers = tableRows.reduce(
    (sum, org) => sum + (org.users_count || 0),
    0
  );
  const totalEvents = tableRows.reduce(
    (sum, org) => sum + (org.events_count || 0),
    0
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Organizaciones
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra organizaciones del sistema y sus configuraciones
        </Typography>
      </Box>

      {/* Stats Cards */}
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
        <StatsCard
          title="Total Organizaciones"
          value={totalOrganizations}
          icon={<BusinessIcon />}
          color="primary"
        />
        <StatsCard
          title="Organizaciones Activas"
          value={activeOrganizations}
          icon={<CheckCircleIcon />}
          color="success"
        />
        <StatsCard
          title="Total Usuarios"
          value={totalUsers}
          icon={<DomainIcon />}
          color="info"
        />
        <StatsCard
          title="Total Eventos"
          value={totalEvents}
          icon={<DomainIcon />}
          color="secondary"
        />
      </Box>

      {/* Data Table */}
      <DataTable
        rows={tableRows}
        columns={columns}
        loading={isLoading}
        error={error}
        page={page}
        pageSize={pageSize}
        totalRows={totalOrganizations}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        actions={actions}
        onRowClick={handleRowClick}
        title="Lista de Organizaciones"
        primaryAction={{
          label: "Agregar Organización",
          onClick: handleAddOrganization,
          icon: <AddIcon />,
        }}
        height={600}
        onRetry={() =>
          loadOrganizations({
            status: "all", // Mostrar todas las organizaciones
            sort_by: "created_at",
            sort_direction: "desc",
            per_page: pageSize,
            page: page + 1,
          })
        }
      />

      {/* Notifications */}
      <NotificationSnackbar
        notification={notification}
        open={notificationOpen}
        onClose={closeNotification}
      />
    </DashboardLayout>
  );
}
