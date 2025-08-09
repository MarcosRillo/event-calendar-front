import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../axios';
import { QUERY_KEYS, CACHE_CONFIG } from '../client';
import { User } from '../../../types';

// Tipos temporales hasta que se definan en types/index.ts
interface CreateUserData {
  name: string;
  email: string;
  role?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
}

/**
 * Hook para obtener lista de usuarios con cache optimizado
 */
export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: async (): Promise<User[]> => {
      const response = await api.get('/users');
      return response.data;
    },
    staleTime: CACHE_CONFIG.users.staleTime,
    gcTime: CACHE_CONFIG.users.gcTime,
  });
}

/**
 * Hook para obtener un usuario específico
 */
export function useUser(id: number, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.userById(id.toString()),
    queryFn: async (): Promise<User> => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: CACHE_CONFIG.users.staleTime,
    gcTime: CACHE_CONFIG.users.gcTime,
  });
}

/**
 * Hook para crear usuario con invalidación automática
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserData): Promise<User> => {
      const response = await api.post('/users', userData);
      return response.data;
    },
    onSuccess: (newUser: User) => {
      // Invalidar lista de usuarios
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      
      // Actualizar cache del usuario específico
      queryClient.setQueryData(QUERY_KEYS.userById(newUser.id.toString()), newUser);
    },
  });
}

/**
 * Hook para actualizar usuario
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserData }): Promise<User> => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedUser: User) => {
      // Actualizar cache del usuario específico
      queryClient.setQueryData(QUERY_KEYS.userById(updatedUser.id.toString()), updatedUser);
      
      // Invalidar lista de usuarios para reflejar cambios
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
}

/**
 * Hook para eliminar usuario
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: (_result: void, deletedUserId: number) => {
      // Remover del cache específico
      queryClient.removeQueries({ queryKey: QUERY_KEYS.userById(deletedUserId.toString()) });
      
      // Invalidar lista de usuarios
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
}

/**
 * Hook para prefetch de usuario (útil para hover o navegación predictiva)
 */
export function usePrefetchUser() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.userById(id.toString()),
      queryFn: async (): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
      },
      staleTime: CACHE_CONFIG.users.staleTime,
    });
  };
}
