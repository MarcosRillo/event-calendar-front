"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosClient from '@/lib/axios';

interface OrganizationData {
  name: string;
  slug: string;
  website_url: string;
  address: string;
  phone: string;
  email: string;
}

interface AdminData {
  first_name: string;
  last_name: string;
  email: string;
}

interface FormData {
  organization: OrganizationData;
  admin: AdminData;
}

export default function OrganizationRequestForm() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [formData, setFormData] = useState<FormData>({
    organization: {
      name: '',
      slug: '',
      website_url: '',
      address: '',
      phone: '',
      email: ''
    },
    admin: {
      first_name: '',
      last_name: '',
      email: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Verificar token al cargar la página
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      setLoading(true);
      try {
        const response = await axiosClient.get(`/organization-request/verify/${token}`);
        if (response.data.success) {
          setTokenValid(true);
        } else {
          setError('Token inválido o expirado');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al verificar el token';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Generar slug automáticamente desde el nombre
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        name: value,
        slug: slug
      }
    }));
  };

  const handleOrganizationChange = (field: keyof OrganizationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        [field]: value
      }
    }));
  };

  const handleAdminChange = (field: keyof AdminData, value: string) => {
    setFormData(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axiosClient.post(`/organization-request/submit/${token}`, formData);
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al enviar la solicitud';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando invitación...</p>
        </div>
      </div>
    );
  }

  if (error && !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invitación Inválida</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Solicitud Enviada!</h1>
          <p className="text-gray-600 mb-6">
            Tu solicitud de organización ha sido enviada exitosamente. 
            Recibirás una respuesta por email en breve.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Solicitud de Organización</h1>
            <p className="text-blue-100 mt-2">
              Complete el formulario para solicitar la creación de su organización
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
            {/* Información de la Organización */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la Organización</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Organización *
                  </label>
                  <input
                    type="text"
                    value={formData.organization.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Cámara de Turismo de Tafí del Valle"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (identificador único)
                  </label>
                  <input
                    type="text"
                    value={formData.organization.slug}
                    onChange={(e) => handleOrganizationChange('slug', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder="Se genera automáticamente"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se genera automáticamente basado en el nombre
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={formData.organization.website_url}
                    onChange={(e) => handleOrganizationChange('website_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.organization.phone}
                    onChange={(e) => handleOrganizationChange('phone', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+54 381 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <textarea
                    value={formData.organization.address}
                    onChange={(e) => handleOrganizationChange('address', e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dirección completa de la organización"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto *
                  </label>
                  <input
                    type="email"
                    value={formData.organization.email}
                    onChange={(e) => handleOrganizationChange('email', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contacto@organizacion.com"
                  />
                </div>
              </div>
            </div>

            {/* Información del Administrador */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Administrador</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.admin.first_name}
                    onChange={(e) => handleAdminChange('first_name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.admin.last_name}
                    onChange={(e) => handleAdminChange('last_name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pérez"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email del Administrador *
                  </label>
                  <input
                    type="email"
                    value={formData.admin.email}
                    onChange={(e) => handleAdminChange('email', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="admin@organizacion.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este email será usado para acceder al sistema una vez aprobada la solicitud
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-md transition duration-200 min-w-[200px]"
              >
                {submitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
