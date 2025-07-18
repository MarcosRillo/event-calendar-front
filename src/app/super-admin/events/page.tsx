'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';
import NavBar from '@/components/NavBar';

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  organization: {
    id: number;
    name: string;
    slug: string;
  };
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
  };
  status: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface EventsData {
  data: Event[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function EventsManagement() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, loading: authLoading } = useAuthStore();
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/super-admin/events?page=${currentPage}`);
      
      if (response.data.success) {
        setEventsData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load events');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Error fetching events'
        : 'Error fetching events';
      setError(errorMessage);
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

    fetchEvents();
  }, [isAuthenticated, user, router, fetchEvents, authLoading]);

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
            onClick={() => fetchEvents()}
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
              <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
              <p className="text-gray-600">Manage events across all organizations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Events Statistics</h3>
          <p className="text-3xl font-bold text-purple-600">
            {eventsData?.total || 0} Total Events
          </p>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Events</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {eventsData?.data.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Organization:</span>
                        <br />
                        <span className="text-blue-600">{event.organization.name}</span>
                      </div>
                      <div>
                        <span className="font-medium">Start Date:</span>
                        <br />
                        {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Not set'}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span>
                        <br />
                        {event.end_date ? new Date(event.end_date).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                      View Details
                    </button>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700">
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
                    <span>ID: {event.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {eventsData?.data.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">There are no events in the system yet.</p>
            </div>
          )}

          {/* Pagination */}
          {eventsData && eventsData.last_page > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Page {eventsData.current_page} of {eventsData.last_page}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={eventsData.current_page === 1}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, eventsData.last_page))}
                  disabled={eventsData.current_page === eventsData.last_page}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
