'use client';

import { useEffect, useState, useCallback } from 'react';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import NavBar from '@/components/NavBar';
import { Organization, PaginatedOrganizations } from '@/types';

export default function OrganizationsManagement() {
  const [organizationsData, setOrganizationsData] = useState<PaginatedOrganizations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrganizations = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/super-admin/organizations?page=${currentPage}`);
      
      if (response.data.success) {
        setOrganizationsData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load organizations');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Error fetching organizations'
        : 'Error fetching organizations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  if (loading) {
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
          {organizationsData?.data.map((org: Organization) => (
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
                  <span className="font-medium">Users:</span> {org.users_count || 0}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Events:</span> {org.events_count || 0}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span> {org.created_at ? new Date(org.created_at).toLocaleDateString() : 'N/A'}
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
