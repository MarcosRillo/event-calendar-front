'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'organization_admin';
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // No hacer nada mientras está cargando (incluye hidratación)
    if (loading) return;

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Si requiere un rol específico, verificarlo
    if (requiredRole) {
      if (requiredRole === 'super_admin' && !user?.is_super_admin) {
        router.push(fallbackPath === '/login' ? '/dashboard' : fallbackPath);
        return;
      }
      
      if (requiredRole === 'organization_admin' && !user?.is_organization_admin && !user?.is_super_admin) {
        router.push(fallbackPath === '/login' ? '/dashboard' : fallbackPath);
        return;
      }
    }
  }, [isAuthenticated, user, loading, router, requiredRole, fallbackPath]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // No mostrar contenido si no está autenticado o no tiene permisos
  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole) {
    if (requiredRole === 'super_admin' && !user?.is_super_admin) {
      return null;
    }
    
    if (requiredRole === 'organization_admin' && !user?.is_organization_admin && !user?.is_super_admin) {
      return null;
    }
  }

  return <>{children}</>;
}
