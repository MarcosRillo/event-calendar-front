import { QueryClient } from '@tanstack/react-query';

/**
 * Configuración del cliente de React Query con optimizaciones
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache durante 5 minutos por defecto
      staleTime: 5 * 60 * 1000,
      
      // Datos válidos por 10 minutos
      gcTime: 10 * 60 * 1000,
      
      // Retry para fallos de red
      retry: (failureCount, error: unknown) => {
        // No retry para errores 4xx
        const errorWithResponse = error as { response?: { status?: number } };
        if (errorWithResponse?.response?.status && 
            errorWithResponse.response.status >= 400 && 
            errorWithResponse.response.status < 500) {
          return false;
        }
        // Máximo 3 reintentos para otros errores
        return failureCount < 3;
      },
      
      // Delay exponencial para reintentos
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch en focus si los datos son stale
      refetchOnWindowFocus: true,
      
      // Refetch cuando se reconecta a internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry para mutaciones críticas
      retry: 1,
    },
  },
});

/**
 * Función para invalidar queries relacionadas
 */
export const invalidateQueries = (queryKey: string[]) => {
  queryClient.invalidateQueries({ queryKey });
};

/**
 * Función para prefetch de datos
 */
export const prefetchQuery = async <T>(queryKey: string[], queryFn: () => Promise<T>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
};

/**
 * Configuración de cache por tipo de datos
 */
export const CACHE_CONFIG = {
  users: {
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000,    // 5 minutos
  },
  organizations: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  },
  events: {
    staleTime: 30 * 1000,     // 30 segundos
    gcTime: 2 * 60 * 1000,    // 2 minutos
  },
  static: {
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
  },
} as const;

/**
 * Keys para queries consistentes
 */
export const QUERY_KEYS = {
  users: ['users'] as const,
  userById: (id: string) => ['users', id] as const,
  organizations: ['organizations'] as const,
  organizationById: (id: string) => ['organizations', id] as const,
  organizationRequests: ['organization-requests'] as const,
  organizationRequestById: (id: string) => ['organization-requests', id] as const,
  events: ['events'] as const,
  eventById: (id: string) => ['events', id] as const,
  currentUser: ['auth', 'current-user'] as const,
} as const;
