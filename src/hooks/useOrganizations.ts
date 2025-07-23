'use client';

import { useState, useCallback } from 'react';
import { 
  Organization, 
  UpdateOrganizationData, 
  OrganizationFilters,
  OrganizationActionConfirmation,
  PaginatedApiResponse 
} from '@/types';
import organizationService from '@/lib/organizationService';

interface UseOrganizationsReturn {
  // Data
  organizations: Organization[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Actions
  loadOrganizations: (filters?: OrganizationFilters) => Promise<void>;
  updateOrganization: (id: number, data: UpdateOrganizationData) => Promise<void>;
  deleteOrganization: (id: number) => Promise<void>;
  restoreOrganization: (id: number) => Promise<void>;
  forceDeleteOrganization: (id: number) => Promise<void>;
  toggleOrganizationStatus: (id: number) => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useOrganizations = (): UseOrganizationsReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: unknown, action: string) => {
    console.error(`Error ${action}:`, error);
    
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'object' && error && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || `Error ${action}`;
      setError(message);
    } else {
      setError(`Error ${action}`);
    }
  }, []);

  const loadOrganizations = useCallback(async (filters?: OrganizationFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: PaginatedApiResponse<Organization> = await organizationService.getOrganizations(filters);
      
      if (response.success && response.data) {
        setOrganizations(response.data);
        if (response.meta) {
          setCurrentPage(response.meta.current_page);
          setTotalPages(response.meta.last_page);
          setTotalCount(response.meta.total);
        }
      } else {
        throw new Error(response.message || 'Error loading organizations');
      }
    } catch (error) {
      handleError(error, 'loading organizations');
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const updateOrganization = useCallback(async (id: number, data: UpdateOrganizationData) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await organizationService.updateOrganization(id, data);
      
      if (response.success && response.data) {
        // Update the organization in the local state
        setOrganizations(prev => 
          prev.map(org => 
            org.id === id ? { ...org, ...response.data } : org
          )
        );
      } else {
        throw new Error(response.message || 'Error updating organization');
      }
    } catch (error) {
      handleError(error, 'updating organization');
      throw error; // Re-throw to allow component to handle it
    } finally {
      setIsUpdating(false);
    }
  }, [handleError]);

  const deleteOrganization = useCallback(async (id: number) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await organizationService.deleteOrganization(id);
      
      if (response.success) {
        // Mark as soft deleted or remove from list depending on current filter
        setOrganizations(prev => 
          prev.map(org => 
            org.id === id 
              ? { ...org, deleted_at: new Date().toISOString() }
              : org
          )
        );
      } else {
        throw new Error(response.message || 'Error deleting organization');
      }
    } catch (error) {
      handleError(error, 'deleting organization');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [handleError]);

  const restoreOrganization = useCallback(async (id: number) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await organizationService.restoreOrganization(id);
      
      if (response.success && response.data) {
        setOrganizations(prev => 
          prev.map(org => 
            org.id === id 
              ? { ...org, ...response.data, deleted_at: undefined }
              : org
          )
        );
      } else {
        throw new Error(response.message || 'Error restoring organization');
      }
    } catch (error) {
      handleError(error, 'restoring organization');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [handleError]);

  const forceDeleteOrganization = useCallback(async (id: number) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await organizationService.forceDeleteOrganization(id);
      
      if (response.success) {
        // Remove from list permanently
        setOrganizations(prev => prev.filter(org => org.id !== id));
        setTotalCount(prev => prev - 1);
      } else {
        throw new Error(response.message || 'Error permanently deleting organization');
      }
    } catch (error) {
      handleError(error, 'permanently deleting organization');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [handleError]);

  const toggleOrganizationStatus = useCallback(async (id: number) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await organizationService.toggleOrganizationStatus(id);
      
      if (response.success && response.data) {
        setOrganizations(prev => 
          prev.map(org => 
            org.id === id 
              ? { ...org, is_active: response.data!.is_active }
              : org
          )
        );
      } else {
        throw new Error(response.message || 'Error toggling organization status');
      }
    } catch (error) {
      handleError(error, 'toggling organization status');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [handleError]);

  return {
    // Data
    organizations,
    currentPage,
    totalPages,
    totalCount,
    
    // Loading states
    isLoading,
    isUpdating,
    isDeleting,
    
    // Actions
    loadOrganizations,
    updateOrganization,
    deleteOrganization,
    restoreOrganization,
    forceDeleteOrganization,
    toggleOrganizationStatus,
    
    // Error handling
    error,
    clearError,
  };
};

// Helper hook for confirmation dialogs
export const useOrganizationConfirmations = () => {
  const [confirmation, setConfirmation] = useState<OrganizationActionConfirmation | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const showDeleteConfirmation = useCallback((organization: Organization) => {
    setConfirmation({
      id: organization.id,
      action: 'delete',
      title: 'Eliminar Organización',
      message: `¿Estás seguro de que quieres eliminar "${organization.name}"? Esta acción moverá la organización a la papelera pero podrá ser restaurada más tarde.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      destructive: false,
    });
    setIsConfirmationOpen(true);
  }, []);

  const showRestoreConfirmation = useCallback((organization: Organization) => {
    setConfirmation({
      id: organization.id,
      action: 'restore',
      title: 'Restaurar Organización',
      message: `¿Quieres restaurar "${organization.name}"? La organización volverá a estar activa.`,
      confirmText: 'Restaurar',
      cancelText: 'Cancelar',
      destructive: false,
    });
    setIsConfirmationOpen(true);
  }, []);

  const showForceDeleteConfirmation = useCallback((organization: Organization) => {
    setConfirmation({
      id: organization.id,
      action: 'force-delete',
      title: 'Eliminar Permanentemente',
      message: `¿Estás seguro de que quieres eliminar permanentemente "${organization.name}"? Esta acción NO se puede deshacer y eliminará todos los datos relacionados.`,
      confirmText: 'Eliminar Permanentemente',
      cancelText: 'Cancelar',
      destructive: true,
    });
    setIsConfirmationOpen(true);
  }, []);

  const showToggleStatusConfirmation = useCallback((organization: Organization) => {
    const isActivating = !organization.is_active;
    setConfirmation({
      id: organization.id,
      action: 'toggle-status',
      title: isActivating ? 'Activar Organización' : 'Desactivar Organización',
      message: isActivating 
        ? `¿Quieres activar "${organization.name}"? La organización y sus usuarios podrán operar normalmente.`
        : `¿Quieres desactivar "${organization.name}"? Los usuarios de esta organización no podrán acceder al sistema.`,
      confirmText: isActivating ? 'Activar' : 'Desactivar',
      cancelText: 'Cancelar',
      destructive: !isActivating,
    });
    setIsConfirmationOpen(true);
  }, []);

  const closeConfirmation = useCallback(() => {
    setIsConfirmationOpen(false);
    setConfirmation(null);
  }, []);

  return {
    confirmation,
    isConfirmationOpen,
    showDeleteConfirmation,
    showRestoreConfirmation,
    showForceDeleteConfirmation,
    showToggleStatusConfirmation,
    closeConfirmation,
  };
};
