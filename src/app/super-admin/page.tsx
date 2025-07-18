'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import NavBar from '@/components/NavBar';

interface SuperAdminDashboardData {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  stats: {
    total_users: number;
    total_organizations: number;
    total_events: number;
    recent_users: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
    }>;
    recent_organizations: Array<{
      id: number;
      name: string;
      slug: string;
      created_at: string;
    }>;
  };
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<SuperAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // No redirigir mientras la autenticación está cargando
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user is super admin
    if (!user?.is_super_admin) {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, router, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/super-admin/dashboard');
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Error fetching dashboard data'
        : 'Error fetching dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {dashboardData.user.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.stats.total_users}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Organizations</h3>
            <p className="text-3xl font-bold text-green-600">{dashboardData.stats.total_organizations}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-purple-600">{dashboardData.stats.total_events}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.stats.recent_users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Organizations */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Organizations</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.stats.recent_organizations.map((org) => (
                  <div key={org.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{org.name}</p>
                      <p className="text-sm text-gray-500">{org.slug}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(org.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => router.push('/super-admin/users')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Manage Users
          </button>
          <button
            onClick={() => router.push('/super-admin/organizations')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Manage Organizations
          </button>
          <button
            onClick={() => router.push('/super-admin/events')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Manage Events
          </button>
        </div>
      </div>
    </div>
  );
}
