// Core types for the application

export interface Role {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  users_count?: number;  // Optional for admin views
  events_count?: number; // Optional for admin views
  created_at?: string;   // Optional for admin views
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
  role: Role;
  organization: Organization;
  created_at: string;
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
