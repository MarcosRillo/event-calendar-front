'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { queryClient } from './client';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider de React Query con configuración optimizada
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Usar singleton del cliente configurado
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* DevTools solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}
