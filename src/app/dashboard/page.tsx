"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '../../store/authStore';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    setLoading(true);
    setError('');

    try {
      await logout();
      console.log('Logout successful');
      router.push('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-blue-100 mt-16">
      <div className="flex flex-col items-center mb-6">
        <Image src="/globe.svg" alt="Logo Ente de Turismo Tucumán" width={56} height={56} className="mb-2 opacity-90" />
        <h1 className="text-2xl font-bold text-blue-900 text-center leading-tight mb-1">
          Panel de Eventos
        </h1>
        <span className="text-sm font-medium text-blue-600 text-center">Ente de Turismo de Tucumán</span>
      </div>
      <div className="mb-6 text-center">
        <p className="text-gray-700">Bienvenido al panel de eventos. Aquí podrás gestionar y visualizar los eventos del Ente de Turismo de Tucumán.</p>
      </div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 mb-2"
      >
        {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>
      {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
    </div>
  );
}
