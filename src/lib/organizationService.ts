import { 
  Organization, 
  UpdateOrganizationData, 
  OrganizationFilters,
  ApiResponse,
  PaginatedApiResponse 
} from '@/types';
import axiosClient from './axios';

class OrganizationService {
  private readonly basePath = '/super-admin/organizations-management';

  /**
   * Get paginated list of organizations
   */
  async getOrganizations(filters?: OrganizationFilters): Promise<PaginatedApiResponse<Organization>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axiosClient.get(`${this.basePath}?${params.toString()}`);
    return response.data;
  }

  /**
   * Get single organization by ID
   */
  async getOrganization(id: number): Promise<ApiResponse<Organization>> {
    const response = await axiosClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Update organization
   */
  async updateOrganization(
    id: number, 
    data: UpdateOrganizationData
  ): Promise<ApiResponse<Organization>> {
    const response = await axiosClient.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * Soft delete organization
   */
  async deleteOrganization(id: number): Promise<ApiResponse<void>> {
    const response = await axiosClient.delete(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Restore soft deleted organization
   */
  async restoreOrganization(id: number): Promise<ApiResponse<Organization>> {
    const response = await axiosClient.post(`${this.basePath}/${id}/restore`);
    return response.data;
  }

  /**
   * Permanently delete organization
   */
  async forceDeleteOrganization(id: number): Promise<ApiResponse<void>> {
    const response = await axiosClient.delete(`${this.basePath}/${id}/force`);
    return response.data;
  }

  /**
   * Toggle organization active status
   */
  async toggleOrganizationStatus(id: number): Promise<ApiResponse<{ id: number; is_active: boolean }>> {
    const response = await axiosClient.patch(`${this.basePath}/${id}/toggle-status`);
    return response.data;
  }
}

// Export singleton instance
const organizationService = new OrganizationService();
export default organizationService;
