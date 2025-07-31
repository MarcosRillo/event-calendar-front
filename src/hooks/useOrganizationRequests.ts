"use client";

import { useState, useCallback } from "react";
import axiosClient from "@/lib/axios";
import { PaginatedApiResponse } from "@/types";

import type { DataTableRow } from "@/components/ui/DataTable";

export interface OrganizationRequest extends DataTableRow {
  id: number;
  email: string;
  token: string;
  status_id: number;
  corrections_notes?: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  updated_by?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  organization_id?: number;
  rejected_reason?: string;
  status: {
    id: number;
    name: string;
  };
  organization_data?: {
    name: string;
    slug: string;
    website_url?: string;
    address: string;
    phone: string;
    email: string;
  };
  admin_data?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  [key: string]: unknown;
}

export interface OrganizationRequestFilters {
  search?: string;
  status?: string;
  page?: number;
}

export interface UseOrganizationRequestsReturn {
  requestsData: PaginatedApiResponse<OrganizationRequest> | null;
  loading: boolean;
  error: string | null;
  fetchRequests: (page?: number, filters?: OrganizationRequestFilters) => Promise<void>;
  clearError: () => void;
}

export function useOrganizationRequests(): UseOrganizationRequestsReturn {
  const [requestsData, setRequestsData] = useState<PaginatedApiResponse<OrganizationRequest> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async (page = 1, filters: OrganizationRequestFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }
      params.append("page", String(page));
      const response = await axiosClient.get<PaginatedApiResponse<OrganizationRequest>>(`/super-admin/organization-requests?${params}`);
      setRequestsData(response.data);
    } catch (err: unknown) {
      // Buenas prácticas: loguear el error y mostrar mensaje genérico
      if (err instanceof Error) {
        // Puedes loguear el error real para debugging
        console.error("Error al cargar las solicitudes:", err.message);
      } else {
        console.error("Error desconocido al cargar las solicitudes:", err);
      }
      setError("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    requestsData,
    loading,
    error,
    fetchRequests,
    clearError,
  };
}
