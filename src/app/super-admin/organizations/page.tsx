'use client';

import { useEffect, useState, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import EditOrganizationModal from '@/components/EditOrganizationModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useOrganizations, useOrganizationConfirmations } from '@/hooks/useOrganizations';
import { Organization, OrganizationFilters, UpdateOrganizationData } from '@/types';

export default function OrganizationsManagement() {
  const {
    organizations,
    currentPage,
    totalPages,
    totalCount,
    isLoading,
    isUpdating,
    isDeleting,
    loadOrganizations,
    updateOrganization,
    deleteOrganization,
    restoreOrganization,
    forceDeleteOrganization,
    toggleOrganizationStatus,
    error,
    clearError,
  } = useOrganizations();

  const {
    confirmation,
    isConfirmationOpen,
    showDeleteConfirmation,
    showRestoreConfirmation,
    showForceDeleteConfirmation,
    showToggleStatusConfirmation,
    closeConfirmation,
  } = useOrganizationConfirmations();

  // UI State
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState<OrganizationFilters>({
    status: 'active',
    sort_by: 'created_at',
    sort_direction: 'desc',
    per_page: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Load organizations on mount and filter changes
  useEffect(() => {
    loadOrganizations(filters);
  }, [loadOrganizations, filters]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        setFilters(prev => ({ ...prev, search: searchTerm || undefined, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.search]);

  // Action handlers
  const handleEdit = useCallback((organization: Organization) => {
    setSelectedOrganization(organization);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedOrganization(null);
  }, []);

  const handleSaveOrganization = useCallback(async (id: number, data: UpdateOrganizationData) => {
    await updateOrganization(id, data);
    // Modal will close automatically on success
  }, [updateOrganization]);

  const handleConfirmAction = useCallback(async () => {
    if (!confirmation) return;

    try {
      switch (confirmation.action) {
        case 'delete':
          await deleteOrganization(confirmation.id);
          break;
        case 'restore':
          await restoreOrganization(confirmation.id);
          break;
        case 'force-delete':
          await forceDeleteOrganization(confirmation.id);
          break;
        case 'toggle-status':
          await toggleOrganizationStatus(confirmation.id);
          break;
      }
      closeConfirmation();
    } catch {
      // Error is handled by the hook
      closeConfirmation();
    }
  }, [confirmation, deleteOrganization, restoreOrganization, forceDeleteOrganization, toggleOrganizationStatus, closeConfirmation]);

  const handleFilterChange = useCallback((newFilters: Partial<OrganizationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const getStatusBadge = (organization: Organization) => {
    if (organization.deleted_at) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Eliminada</span>;
    }
    if (!organization.is_active) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Inactiva</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Activa</span>;
  };

  const getActionButtons = (organization: Organization) => {
    if (organization.deleted_at) {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => showRestoreConfirmation(organization)}
            className="text-green-600 hover:text-green-900 text-sm font-medium"
            disabled={isUpdating || isDeleting}
          >
            Restaurar
          </button>
          <button
            onClick={() => showForceDeleteConfirmation(organization)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
            disabled={isUpdating || isDeleting}
          >
            Eliminar Permanentemente
          </button>
        </div>
      );
    }

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(organization)}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          disabled={isUpdating || isDeleting}
        >
          Editar
        </button>
        <button
          onClick={() => showToggleStatusConfirmation(organization)}
          className={`text-sm font-medium ${
            organization.is_active 
              ? 'text-yellow-600 hover:text-yellow-900' 
              : 'text-green-600 hover:text-green-900'
          }`}
          disabled={isUpdating || isDeleting}
        >
          {organization.is_active ? 'Desactivar' : 'Activar'}
        </button>
        <button
          onClick={() => showDeleteConfirmation(organization)}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
          disabled={isUpdating || isDeleting}
        >
          Eliminar
        </button>
      </div>
    );
  };

  if (isLoading && organizations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Organizaciones</h1>
              <p className="text-gray-600">Administra organizaciones y su configuración</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, slug, email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filters.status || 'active'}
                onChange={(e) => handleFilterChange({ status: e.target.value as 'active' | 'inactive' | 'deleted' | 'all' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
                <option value="deleted">Eliminadas</option>
                <option value="all">Todas</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                value={filters.sort_by || 'created_at'}
                onChange={(e) => handleFilterChange({ sort_by: e.target.value as 'name' | 'created_at' | 'updated_at' | 'is_active' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at">Fecha de creación</option>
                <option value="name">Nombre</option>
                <option value="updated_at">Última actualización</option>
                <option value="is_active">Estado</option>
              </select>
            </div>

            {/* Sort Direction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <select
                value={filters.sort_direction || 'desc'}
                onChange={(e) => handleFilterChange({ sort_direction: e.target.value as 'asc' | 'desc' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Estadísticas</h3>
          <p className="text-3xl font-bold text-blue-600">
            {totalCount} Organizaciones
          </p>
          {isLoading && (
            <div className="mt-2 text-sm text-gray-500">Cargando...</div>
          )}
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div key={org.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{org.name}</h3>
                  {getStatusBadge(org)}
                </div>
                <div className="ml-4">
                  {getActionButtons(org)}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Slug:</span> {org.slug}
                </p>
                {org.email && (
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {org.email}
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Usuarios:</span> {org.users_count || 0}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Eventos:</span> {org.events_count || 0}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Creada:</span> {new Date(org.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {organizations.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay organizaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron organizaciones con los filtros seleccionados.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages} ({totalCount} total)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Organization Modal */}
      <EditOrganizationModal
        organization={selectedOrganization}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveOrganization}
        isLoading={isUpdating}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        confirmation={confirmation}
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirmation}
        isLoading={isUpdating || isDeleting}
      />
    </div>
  );
}
