import { useState, useCallback } from 'react';
import { User, Role, Organization, PaginatedUsers, UpdateUserFormData } from '@/types';
import UserService from '@/services/userService';
import axiosClient from '@/lib/axios';

export interface UseUserManagementReturn {
  // State
  usersData: PaginatedUsers | null;
  loading: boolean;
  error: string | null;
  roles: Role[];
  organizations: Organization[];
  
  // Actions
  fetchUsers: (page?: number, search?: string) => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchOrganizations: () => Promise<void>;
  updateUser: (userId: number, userData: UpdateUserFormData) => Promise<User>;
  toggleUserStatus: (userId: number) => Promise<User>;
  deleteUser: (userId: number, userRole?: string) => Promise<void>;
  
  // Helpers
  refreshUser: (updatedUser: User) => void;
  removeUser: (userId: number) => void;
}

export function useUserManagement(): UseUserManagementReturn {
  const [usersData, setUsersData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const refreshUser = useCallback((updatedUser: User) => {
    setUsersData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        data: prev.data.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      };
    });
  }, []);

  const removeUser = useCallback((userId: number) => {
    setUsersData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        data: prev.data.filter(user => user.id !== userId),
        total: prev.total - 1
      };
    });
  }, []);

  const fetchUsers = useCallback(async (page: number = 1, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getUsers(page, 15, search);
      setUsersData(data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const rolesData = await UserService.getRoles();
      setRoles(rolesData);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Error fetching roles:', error.message);
    }
  }, []);

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await axiosClient.get('/super-admin/organizations');
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setOrganizations(response.data.data);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Error fetching organizations:', error.message);
    }
  }, []);

  const updateUser = useCallback(async (userId: number, userData: UpdateUserFormData) => {
    const updatedUser = await UserService.updateUser(userId, userData);
    refreshUser(updatedUser);
    return updatedUser;
  }, [refreshUser]);

  const toggleUserStatus = useCallback(async (userId: number) => {
    const updatedUser = await UserService.toggleUserStatus(userId);
    refreshUser(updatedUser);
    return updatedUser;
  }, [refreshUser]);

  const deleteUser = useCallback(async (userId: number, userRole?: string) => {
    await UserService.deleteUser(userId, userRole);
    removeUser(userId);
  }, [removeUser]);

  return {
    // State
    usersData,
    loading,
    error,
    roles,
    organizations,
    
    // Actions
    fetchUsers,
    fetchRoles,
    fetchOrganizations,
    updateUser,
    toggleUserStatus,
    deleteUser,
    
    // Helpers
    refreshUser,
    removeUser,
  };
}
