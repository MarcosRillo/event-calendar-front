'use client';

import { useState, useCallback } from 'react';
import { Event, PaginatedEvents, EventStatus, Organization } from '@/types';
import axiosClient from '@/lib/axios';
import { AxiosError } from 'axios';

export interface EventFilters {
  search?: string;
  organization_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
}

export interface UseEventManagementReturn {
  // State
  eventsData: PaginatedEvents | null;
  loading: boolean;
  error: string | null;
  eventStatuses: EventStatus[];
  organizations: Organization[];
  
  // Actions
  fetchEvents: (page?: number, filters?: EventFilters) => Promise<void>;
  fetchEventStatuses: () => Promise<void>;
  fetchOrganizations: () => Promise<void>;
  toggleEventStatus: (eventId: number) => Promise<void>;
  deleteEvent: (eventId: number) => Promise<void>;
  
  // Helpers
  refreshEvent: (updatedEvent: Event) => void;
  removeEvent: (eventId: number) => void;
  clearError: () => void;
}

export function useEventManagement(): UseEventManagementReturn {
  const [eventsData, setEventsData] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventStatuses, setEventStatuses] = useState<EventStatus[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshEvent = useCallback((updatedEvent: Event) => {
    setEventsData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        data: prev.data.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        )
      };
    });
  }, []);

  const removeEvent = useCallback((eventId: number) => {
    setEventsData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        data: prev.data.filter(event => event.id !== eventId),
        total: prev.total - 1
      };
    });
  }, []);

  const fetchEvents = useCallback(async (page: number = 1, filters?: EventFilters): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.organization_id) params.append('organization_id', filters.organization_id.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);
      if (filters?.category) params.append('category', filters.category);
      
      const response = await axiosClient.get(`/super-admin/events?${params.toString()}`);
      
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
  }, []);

  const fetchEventStatuses = useCallback(async (): Promise<void> => {
    try {
      // For now, we'll use static data since the endpoint doesn't exist yet
      // TODO: Implement /super-admin/event-statuses endpoint in backend
      const staticStatuses: EventStatus[] = [
        { id: 1, name: 'pending' },
        { id: 2, name: 'approved_internal' },
        { id: 3, name: 'approved_public' },
        { id: 4, name: 'rejected' },
        { id: 5, name: 'corrections_needed' },
      ];
      
      setEventStatuses(staticStatuses);
      
      // Uncomment when backend endpoint is ready:
      // const response = await axiosClient.get('/super-admin/event-statuses');
      // if (response.data.success) {
      //   setEventStatuses(response.data.data);
      // }
    } catch {
      console.warn('Event statuses endpoint not available, using static data');
      // Set default statuses as fallback
      const defaultStatuses: EventStatus[] = [
        { id: 1, name: 'pending' },
        { id: 2, name: 'approved_internal' },
        { id: 3, name: 'approved_public' },
        { id: 4, name: 'rejected' },
        { id: 5, name: 'corrections_needed' },
      ];
      setEventStatuses(defaultStatuses);
    }
  }, []);

  const fetchOrganizations = useCallback(async (): Promise<void> => {
    try {
      const response = await axiosClient.get('/super-admin/organizations');
      if (response.data.success) {
        setOrganizations(response.data.data);
      }
    } catch (error) {
      console.warn('Organizations endpoint error, using empty list:', error);
      setOrganizations([]);
    }
  }, []);

  const toggleEventStatus = useCallback(async (eventId: number): Promise<void> => {
    try {
      const response = await axiosClient.patch(`/super-admin/events/${eventId}/toggle-status`);
      
      if (response.data.success) {
        refreshEvent(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to update event status');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Error updating event status'
        : 'Error updating event status';
      setError(errorMessage);
      throw error;
    }
  }, [refreshEvent]);

  const deleteEvent = useCallback(async (eventId: number): Promise<void> => {
    try {
      const response = await axiosClient.delete(`/super-admin/events/${eventId}`);
      
      if (response.data.success) {
        removeEvent(eventId);
      } else {
        throw new Error(response.data.message || 'Failed to delete event');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Error deleting event'
        : 'Error deleting event';
      setError(errorMessage);
      throw error;
    }
  }, [removeEvent]);

  return {
    // State
    eventsData,
    loading,
    error,
    eventStatuses,
    organizations,
    
    // Actions
    fetchEvents,
    fetchEventStatuses,
    fetchOrganizations,
    toggleEventStatus,
    deleteEvent,
    
    // Helpers
    refreshEvent,
    removeEvent,
    clearError,
  };
}
