'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import NavBar from '@/components/NavBar';

interface Organization {
  id: number;
  name: string;
  slug: string;
  users_count: number;
  events_count: number;
  created_at: string;
}

interface OrganizationsData {
  data: Organization[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function OrganizationsManagement() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, loading: authLoading } = useAuthStore();
  const [organizationsData, setOrganizationsData] = useState<OrganizationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/organizations?page=${currentPage}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setOrganizationsData(result.data);
      } else {
        setError(result.message || 'Failed to load organizations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    // No redirigir mientras la autenticación está cargando
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!user?.is_super_admin) {
      router.push('/dashboard');
      return;
    }

    fetchOrganizations();
  }, [isAuthenticated, user, router, fetchOrganizations, authLoading]);

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
            onClick={() => fetchOrganizations()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Organizations Management</h1>
              <p className="text-gray-600">Manage organizations and their settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Organizations Statistics</h3>
          <p className="text-3xl font-bold text-green-600">
            {organizationsData?.total || 0} Total Organizations
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizationsData?.data.map((org) => (
            <div key={org.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm">
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Slug:</span> {org.slug}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Users:</span> {org.users_count}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Events:</span> {org.events_count}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span> {new Date(org.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {organizationsData && organizationsData.last_page > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Page {organizationsData.current_page} of {organizationsData.last_page}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={organizationsData.current_page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, organizationsData.last_page))}
                disabled={organizationsData.current_page === organizationsData.last_page}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create New Organization Button */}
        <div className="mt-8">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium">
            + Create New Organization
          </button>
        </div>
      </div>
    </div>
  );
}
