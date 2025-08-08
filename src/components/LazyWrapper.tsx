'use client';

import { Suspense, type ComponentType, type ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: number;
}

const DefaultFallback = ({ minHeight = 400 }: { minHeight?: number }) => (
  <Box 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center" 
    minHeight={minHeight}
    gap={2}
  >
    <CircularProgress />
    <Typography variant="body2" color="text.secondary">
      Cargando...
    </Typography>
  </Box>
);

export function LazyWrapper({ 
  children, 
  fallback, 
  minHeight = 400 
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback minHeight={minHeight} />}>
      {children}
    </Suspense>
  );
}

// HOC para envolver componentes con lazy loading
export function withLazy<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) {
  const LazyComponent = (props: P) => {
    return (
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    );
  };
  
  // Preservar el nombre del componente para debugging
  LazyComponent.displayName = `withLazy(${Component.displayName || Component.name})`;
  
  return LazyComponent;
}

export default LazyWrapper;
