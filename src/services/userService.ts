import axiosClient from '@/lib/axios';
import { User, UpdateUserFormData, Role, PaginatedUsers } from '@/types';

export class UserService {
  /**
   * Get paginated list of users
   */
  static async getUsers(page: number = 1, perPage: number = 15, search?: string): Promise<PaginatedUsers> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    const response = await axiosClient.get(`/super-admin/users?${params}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch users');
    }
    
    return response.data.data;
  }

  /**
   * Get a specific user by ID
   */
  static async getUser(userId: number): Promise<User> {
    const response = await axiosClient.get(`/super-admin/users/${userId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch user');
    }
    
    return response.data.data.user;
  }

  /**
   * Update user data
   */
  static async updateUser(userId: number, userData: UpdateUserFormData): Promise<User> {
    const response = await axiosClient.put(`/super-admin/users/${userId}`, userData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update user');
    }
    
    return response.data.data.user;
  }

  /**
   * Toggle user active status
   */
  static async toggleUserStatus(userId: number): Promise<User> {
    const response = await axiosClient.patch(`/super-admin/users/${userId}/toggle-status`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to toggle user status');
    }
    
    return response.data.data.user;
  }

  /**
   * Soft delete a user
   */
  static async deleteUser(userId: number, userRole?: string): Promise<void> {
    // Validación frontend: No permitir eliminar administradores
    if (userRole && ['admin', 'superadmin'].includes(userRole)) {
      const roleLabel = userRole === 'superadmin' ? 'super administrador' : 'administrador de organización';
      throw new Error(`No se puede eliminar un usuario ${roleLabel}`);
    }

    const response = await axiosClient.delete(`/super-admin/users/${userId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete user');
    }
  }

  /**
   * Get all available roles
   */
  static async getRoles(): Promise<Role[]> {
    const response = await axiosClient.get('/super-admin/roles');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch roles');
    }
    
    return response.data.data.roles;
  }

  /**
   * Update user role (legacy endpoint)
   */
  static async updateUserRole(userId: number, roleId: number): Promise<User> {
    const response = await axiosClient.put(`/super-admin/users/${userId}/role`, {
      role_id: roleId
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update user role');
    }
    
    return response.data.data.user;
  }
}

export default UserService;
