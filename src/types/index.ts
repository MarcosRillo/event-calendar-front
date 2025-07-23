// Core types for the application

export interface Role {
  id: number;
  name: string;
}

export interface TrustLevel {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  website_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  admin_id?: number;
  parent_id?: number;
  trust_level_id?: number;
  is_active: boolean;
  created_by?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  users_count?: number;  // Optional for admin views
  events_count?: number; // Optional for admin views
  // Relations
  admin?: User;
  trustLevel?: TrustLevel;
  createdBy?: User;
  users?: User[];
  events?: Event[];
}

// User type for authentication (simpler structure)
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string | null;
  is_super_admin: boolean;
  is_organization_admin: boolean;
}

// Full user type with relations (for admin pages)
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  role: Role;
  organization?: Organization;
  organization_id?: number;
  role_id: number;
  created_at: string;
  updated_at?: string;
  created_by?: User;
}

// Form interfaces for user management
export interface UpdateUserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id: number;
  organization_id?: number;
  is_active: boolean;
  password?: string;
  password_confirmation?: string;
}

// Pagination wrapper for API responses
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Type aliases for better readability
export type PaginatedUsers = PaginatedData<User>;
export type PaginatedEvents = PaginatedData<Event>;
export type PaginatedOrganizations = PaginatedData<Organization>;

// Event types
export interface EventStatus {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  organization: Organization;
  created_by?: {  // Optional for different contexts
    id: number;
    first_name: string;
    last_name: string;
  };
  createdBy?: User;  // Alternative relation name
  status?: EventStatus;  // Optional status
  created_at: string;
}

// Dashboard specific types
export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface DashboardOrganization {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

// Stats interface for dashboard data
export interface DashboardStats {
  total_users: number;
  total_organizations: number;
  total_events: number;
  recent_users: DashboardUser[];
  recent_organizations: DashboardOrganization[];
}

export interface SuperAdminDashboardData {
  user: DashboardUser;
  stats: DashboardStats;
}

// Generic dashboard response wrapper that can be reused for different dashboard types
export interface DashboardResponse<TStats = DashboardStats> {
  success: boolean;
  data: {
    user: DashboardUser;
    stats: TStats;
  };
  message?: string;
}

// Organization management types
export interface UpdateOrganizationData {
  name?: string;
  slug?: string;
  website_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  admin_id?: number;
  trust_level_id?: number;
  is_active?: boolean;
}

export interface OrganizationFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'deleted' | 'all';
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'is_active';
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface OrganizationActionConfirmation {
  id: number;
  action: 'delete' | 'restore' | 'force-delete' | 'toggle-status';
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  destructive?: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ValidationError {
  [field: string]: string[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: ValidationError;
}
