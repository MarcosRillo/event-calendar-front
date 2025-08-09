'use client';

import { useEffect } from 'react';
import { initWebVitals, initErrorTracking, getDeviceInfo } from './webVitals';

/**
 * Componente para inicializar el monitoreo de performance
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Inicializar Web Vitals
    initWebVitals();
    
    // Inicializar seguimiento de errores
    initErrorTracking();
    
    // Log de información del dispositivo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.group('📱 Device Information');
      console.table(getDeviceInfo());
      console.groupEnd();
    }
  }, []);

  return null; // Este componente no renderiza nada
}

export { initWebVitals, initErrorTracking, getDeviceInfo } from './webVitals';
