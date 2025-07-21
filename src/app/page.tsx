"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, loading, hydrated } = useAuth();

  useEffect(() => {
    // Solo redirigir después de la hidratación
    if (hydrated) {
      if (user) {
        router.push('/super-admin');
      } else {
        router.push('/login');
      }
    }
  }, [user, hydrated, router]);

  // Mostrar loading hasta que se complete la hidratación
  if (!hydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-600">Cargando...</div>
      </div>
    );
  }

  return null;
}
