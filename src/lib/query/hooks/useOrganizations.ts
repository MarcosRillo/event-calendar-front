import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../axios';
import { QUERY_KEYS, CACHE_CONFIG } from '../client';
import { Organization } from '../../../types';

// Tipos temporales para organizaciones
interface CreateOrganizationData {
  name: string;
  slug: string;
  website_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  trust_level_id?: number;
}

interface UpdateOrganizationData {
  name?: string;
  slug?: string;
  website_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  trust_level_id?: number;
  is_active?: boolean;
}

/**
 * Hook para obtener lista de organizaciones con cache optimizado
 */
export function useOrganizations() {
  return useQuery({
    queryKey: QUERY_KEYS.organizations,
    queryFn: async (): Promise<Organization[]> => {
      const response = await api.get('/organizations');
      return response.data;
    },
    staleTime: CACHE_CONFIG.organizations.staleTime,
    gcTime: CACHE_CONFIG.organizations.gcTime,
  });
}

/**
 * Hook para obtener una organización específica
 */
export function useOrganization(id: number, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.organizationById(id.toString()),
    queryFn: async (): Promise<Organization> => {
      const response = await api.get(`/organizations/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: CACHE_CONFIG.organizations.staleTime,
    gcTime: CACHE_CONFIG.organizations.gcTime,
  });
}

/**
 * Hook para crear organización con invalidación automática
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (organizationData: CreateOrganizationData): Promise<Organization> => {
      const response = await api.post('/organizations', organizationData);
      return response.data;
    },
    onSuccess: (newOrganization: Organization) => {
      // Invalidar lista de organizaciones
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
      
      // Actualizar cache de la organización específica
      queryClient.setQueryData(
        QUERY_KEYS.organizationById(newOrganization.id.toString()), 
        newOrganization
      );
    },
  });
}

/**
 * Hook para actualizar organización
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: UpdateOrganizationData 
    }): Promise<Organization> => {
      const response = await api.put(`/organizations/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedOrganization: Organization) => {
      // Actualizar cache de la organización específica
      queryClient.setQueryData(
        QUERY_KEYS.organizationById(updatedOrganization.id.toString()), 
        updatedOrganization
      );
      
      // Invalidar lista de organizaciones para reflejar cambios
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
    },
  });
}

/**
 * Hook para eliminar organización
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/organizations/${id}`);
    },
    onSuccess: (_result: void, deletedOrganizationId: number) => {
      // Remover del cache específico
      queryClient.removeQueries({ 
        queryKey: QUERY_KEYS.organizationById(deletedOrganizationId.toString()) 
      });
      
      // Invalidar lista de organizaciones
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
      
      // También invalidar usuarios ya que pueden estar relacionados
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
}

/**
 * Hook para obtener solicitudes de organización
 */
export function useOrganizationRequests() {
  return useQuery({
    queryKey: QUERY_KEYS.organizationRequests,
    queryFn: async () => {
      const response = await api.get('/organization-requests');
      return response.data;
    },
    staleTime: CACHE_CONFIG.events.staleTime, // Datos más dinámicos
    gcTime: CACHE_CONFIG.events.gcTime,
  });
}

/**
 * Hook para obtener una solicitud de organización específica
 */
export function useOrganizationRequest(id: number, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.organizationRequestById(id.toString()),
    queryFn: async () => {
      const response = await api.get(`/organization-requests/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: CACHE_CONFIG.events.staleTime,
    gcTime: CACHE_CONFIG.events.gcTime,
  });
}

/**
 * Hook para aprobar solicitud de organización
 */
export function useApproveOrganizationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.post(`/organization-requests/${id}/approve`);
    },
    onSuccess: () => {
      // Invalidar solicitudes y organizaciones
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizationRequests });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations });
    },
  });
}

/**
 * Hook para rechazar solicitud de organización
 */
export function useRejectOrganizationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.post(`/organization-requests/${id}/reject`);
    },
    onSuccess: () => {
      // Invalidar solicitudes
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizationRequests });
    },
  });
}
