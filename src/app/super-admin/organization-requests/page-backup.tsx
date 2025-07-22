"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosClient from '@/lib/axios';
import NavBar from '@/components/NavBar';
import SendInvitationModal from '@/components/SendInvitationModal';

interface OrganizationRequest {
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
  organization_id?: number; // AÑADIDO: También puede existir
  rejected_reason?: string; // AÑADIDO: También puede existir
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
}

interface RequestsResponse {
  success: boolean;
  message?: string;
  data: OrganizationRequest[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export default function OrganizationRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<OrganizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }
      params.append('page', currentPage.toString());

      console.log('Fetching requests with params:', params.toString());
      const response = await axiosClient.get<RequestsResponse>(`/super-admin/organization-requests?${params}`);
      console.log('Response received:', response.data);
      
      if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
        console.log('Setting requests:', response.data.data.length, 'items');
        setRequests(response.data.data);
        setCurrentPage(response.data.meta.current_page);
        setTotalPages(response.data.meta.last_page);
      } else {
        console.error('Invalid response structure:', response.data);
        setRequests([]);
        setError('Estructura de respuesta inválida');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh data when returning from detail page
  useEffect(() => {
    const handleFocus = () => {
      // Refrescar cuando la ventana obtiene el foco de nuevo
      fetchRequests();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [filter, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect refresh parameter from URL
  useEffect(() => {
    const refreshParam = searchParams.get('refresh');
    console.log('Refresh param detected:', refreshParam);
    if (refreshParam) {
      // Remove the refresh parameter from URL and force a refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('refresh');
      window.history.replaceState({}, '', url.toString());
      
      console.log('Forcing data refresh due to URL parameter');
      // Force refresh data
      fetchRequests();
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      corrections_needed: 'bg-orange-100 text-orange-800'
    };

    const labels = {
      sent: 'Enviada',
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada',
      corrections_needed: 'Necesita Correcciones'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const handleRequestAction = (requestId: number) => {
    router.push(`/super-admin/organization-requests/${requestId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Organizaciones</h1>
              <p className="text-gray-600">Gestiona las solicitudes de nuevas organizaciones</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchRequests}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : '🔄 Actualizar'}
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Enviar Invitación
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex space-x-4">
          {['all', 'pending', 'approved', 'rejected', 'corrections_needed'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {status === 'all' ? 'Todas' : 
               status === 'pending' ? 'Pendientes' :
               status === 'approved' ? 'Aprobadas' :
               status === 'rejected' ? 'Rechazadas' :
               'Necesitan Correcciones'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {!requests || requests.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                No hay solicitudes que mostrar
              </li>
            ) : (
              requests.map((request) => {
                console.log(`Request ${request.id} status:`, request.status);
                return (
                  <li key={request.id}>
                    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleRequestAction(request.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {request.organization_data?.name || 'Sin datos de organización'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {request.admin_data?.first_name} {request.admin_data?.last_name} ({request.admin_data?.email})
                              </p>
                              <p className="text-xs text-gray-500">
                                Invitado por: {request.created_by ? `${request.created_by.first_name} ${request.created_by.last_name}` : 'Usuario desconocido'}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(request.status.name)}
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {request.organization_data && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Email:</span> {request.organization_data.email}
                              </div>
                              <div>
                                <span className="font-medium">Teléfono:</span> {request.organization_data.phone}
                              </div>
                              <div>
                                <span className="font-medium">Sitio web:</span> {request.organization_data.website_url || 'No especificado'}
                              </div>
                            </div>
                          )}

                          {request.corrections_notes && (
                            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                              <p className="text-sm text-orange-800">
                                <span className="font-medium">Correcciones solicitadas:</span> {request.corrections_notes}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <SendInvitationModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={() => {
          setShowInviteModal(false);
          fetchRequests();
        }}
      />
    </div>
  );
}
