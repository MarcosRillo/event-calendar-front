"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosClient from '@/lib/axios';
import NavBar from '@/components/NavBar';

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

export default function OrganizationRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  
  const [request, setRequest] = useState<OrganizationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_corrections'>('approve');
  const [actionMessage, setActionMessage] = useState('');
  const [correctionsNotes, setCorrectionsNotes] = useState('');

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/super-admin/organization-requests/${requestId}`);
      if (response.data.success) {
        setRequest(response.data.data);
      } else {
        setError('Solicitud no encontrada');
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      setError('Error al cargar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [requestId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async () => {
    if (!request) return;
    
    setActionLoading(true);
    try {
      const payload: Record<string, string | undefined> = {
        action: actionType,
        message: actionMessage || undefined
      };

      if (actionType === 'request_corrections') {
        payload.corrections_notes = correctionsNotes;
      }

      const response = await axiosClient.patch(`/super-admin/organization-requests/${request.id}/status`, payload);
      
      if (response.data.success) {
        setShowActionModal(false);
        
        // Show success message
        alert(`Solicitud ${
          actionType === 'approve' ? 'aprobada' : 
          actionType === 'reject' ? 'rechazada' : 
          'enviada para correcciones'
        } exitosamente`);
        
        // Redirect to organization requests list with refresh parameter
        router.push(`/super-admin/organization-requests?refresh=${Date.now()}`);
      } else {
        alert('Error: La operación no fue exitosa');
      }
    } catch (error) {
      console.error('Error processing action:', error);
      alert('Error al procesar la acción');
    } finally {
      setActionLoading(false);
    }
  };

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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const canTakeAction = (status: string) => {
    return status === 'pending' || status === 'corrections_needed';
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

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Volver
            </button>
          </div>
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
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
              >
                ← Volver a solicitudes
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle de Solicitud #{request.id}
              </h1>
              <div className="mt-2">
                {getStatusBadge(request.status.name)}
              </div>
            </div>
            {canTakeAction(request.status.name) && (
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setActionType('approve');
                    setActionMessage('');
                    setShowActionModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => {
                    setActionType('reject');
                    setActionMessage('');
                    setShowActionModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => {
                    setActionType('request_corrections');
                    setActionMessage('');
                    setCorrectionsNotes('');
                    setShowActionModal(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Solicitar Correcciones
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organization Data */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información de la Organización</h3>
            </div>
            <div className="p-6 space-y-4">
              {request.organization_data ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{request.organization_data.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <p className="mt-1 text-sm text-gray-900">{request.organization_data.slug}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{request.organization_data.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{request.organization_data.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sitio Web</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {request.organization_data.website_url ? (
                        <a 
                          href={request.organization_data.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {request.organization_data.website_url}
                        </a>
                      ) : (
                        'No especificado'
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900">{request.organization_data.address}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No se han enviado datos de organización</p>
              )}
            </div>
          </div>

          {/* Admin Data */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información del Administrador</h3>
            </div>
            <div className="p-6 space-y-4">
              {request.admin_data ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {request.admin_data.first_name} {request.admin_data.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{request.admin_data.email}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No se han enviado datos del administrador</p>
              )}
            </div>
          </div>
        </div>

        {/* Request Timeline */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Información de la Solicitud</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email de invitación</label>
                <p className="mt-1 text-sm text-gray-900">{request.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Creado por</label>
                <p className="mt-1 text-sm text-gray-900">
                  {request.created_by ? `${request.created_by.first_name} ${request.created_by.last_name} (${request.created_by.email})` : 'Usuario desconocido'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de invitación</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(request.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de expiración</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(request.expires_at).toLocaleString()}
                </p>
              </div>
              {request.accepted_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de envío</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(request.accepted_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {request.corrections_notes && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  Correcciones solicitadas:
                </label>
                <p className="text-sm text-orange-900">{request.corrections_notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {actionType === 'approve' ? 'Aprobar Solicitud' :
                 actionType === 'reject' ? 'Rechazar Solicitud' :
                 'Solicitar Correcciones'}
              </h3>
              
              <div className="space-y-4">
                {actionType === 'request_corrections' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correcciones requeridas *
                    </label>
                    <textarea
                      value={correctionsNotes}
                      onChange={(e) => setCorrectionsNotes(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Especifique las correcciones necesarias..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje adicional (opcional)
                  </label>
                  <textarea
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mensaje adicional para incluir en el email..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAction}
                  disabled={actionLoading || (actionType === 'request_corrections' && !correctionsNotes.trim())}
                  className={`font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 ${
                    actionType === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' :
                    actionType === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {actionLoading ? 'Procesando...' : 
                   actionType === 'approve' ? 'Aprobar' :
                   actionType === 'reject' ? 'Rechazar' :
                   'Solicitar Correcciones'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
