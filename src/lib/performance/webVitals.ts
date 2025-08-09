import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Tipos para APIs del navegador
interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

interface WindowWithGtag extends Window {
  gtag?: (command: string, action: string, parameters?: Record<string, string | number>) => void;
}

interface AnalyticsData {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
}

/**
 * Función para reportar métricas a un servicio de analytics
 */
function reportMetric(metric: Metric) {
  const analyticsData: AnalyticsData = {
    name: metric.name,
    value: Math.round(metric.value),
    id: metric.id,
    delta: Math.round(metric.delta),
    rating: metric.rating,
    navigationType: metric.navigationType || 'navigation',
  };

  // En desarrollo, log a la consola
  if (process.env.NODE_ENV === 'development') {
    console.group(`🎯 Web Vital: ${metric.name}`);
    console.log(`Value: ${analyticsData.value}ms`);
    console.log(`Rating: ${analyticsData.rating}`);
    console.log(`Delta: ${analyticsData.delta}ms`);
    console.log(`ID: ${analyticsData.id}`);
    console.groupEnd();
  }

  // En producción, enviar a servicio de analytics
  if (process.env.NODE_ENV === 'production') {
    // Aquí se podría integrar con Google Analytics, Sentry, etc.
    try {
      // Ejemplo con Google Analytics
      const windowWithGtag = window as WindowWithGtag;
      if (typeof windowWithGtag.gtag !== 'undefined') {
        windowWithGtag.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          custom_parameter: metric.id,
        });
      }

      // Ejemplo con fetch a API propia
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData),
        keepalive: true, // Importante para enviar datos al cerrar la página
      }).catch((error) => {
        console.error('Error sending web vitals:', error);
      });
    } catch (error) {
      console.error('Error reporting metric:', error);
    }
  }
}

/**
 * Función para inicializar el monitoreo de Web Vitals
 */
export function initWebVitals() {
  try {
    // Cumulative Layout Shift - estabilidad visual
    onCLS(reportMetric);
    
    // Interaction to Next Paint - interactividad (reemplaza FID)
    onINP(reportMetric);
    
    // First Contentful Paint - velocidad de carga
    onFCP(reportMetric);
    
    // Largest Contentful Paint - velocidad de carga percibida
    onLCP(reportMetric);
    
    // Time to First Byte - velocidad del servidor
    onTTFB(reportMetric);
  } catch (error) {
    console.error('Error initializing web vitals:', error);
  }
}

/**
 * Función para medir tiempos de navegación personalizados
 */
export function measureNavigation(name: string) {
  if (!performance || !performance.mark) return null;

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-duration`;

  return {
    start: () => {
      performance.mark(startMark);
    },
    end: () => {
      performance.mark(endMark);
      try {
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`⏱️ ${name}: ${Math.round(measure.duration)}ms`);
        }
        
        return measure.duration;
      } catch (error) {
        console.error(`Error measuring ${name}:`, error);
        return 0;
      }
    },
  };
}

/**
 * Función para medir el tiempo de respuesta de APIs
 */
export function measureAPICall(url: string, method: string = 'GET') {
  const measurement = measureNavigation(`api-${method.toLowerCase()}-${url.replace(/[^a-zA-Z0-9]/g, '-')}`);
  
  if (!measurement) {
    return { finish: () => 0 };
  }
  
  measurement.start();
  
  return {
    finish: () => measurement.end(),
  };
}

/**
 * Función para obtener información del dispositivo y conexión
 */
export function getDeviceInfo() {
  const extendedNavigator = navigator as ExtendedNavigator;
  
  const info = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    deviceMemory: extendedNavigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    connection: {
      effectiveType: 'unknown',
      downlink: 'unknown',
      rtt: 'unknown',
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
  };

  // Network Information API (experimental)
  if ('connection' in navigator) {
    const connection = extendedNavigator.connection;
    if (connection) {
      info.connection = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink?.toString() || 'unknown',
        rtt: connection.rtt?.toString() || 'unknown',
      };
    }
  }

  return info;
}

/**
 * Hook para monitorear performance en componentes React
 */
export function usePerformanceMonitor(componentName: string) {
  const measurement = measureNavigation(`component-${componentName}`);

  if (!measurement) {
    return {
      startRender: () => {},
      endRender: () => 0,
      measureRender: () => {},
    };
  }

  return {
    startRender: measurement.start,
    endRender: measurement.end,
    measureRender: () => {
      measurement.start();
      // Usar en useEffect para medir tiempo de renderizado
      setTimeout(measurement.end, 0);
    },
  };
}

/**
 * Función para reportar errores de JavaScript
 */
export function initErrorTracking() {
  if (typeof window === 'undefined') return;

  // Errores no capturados
  window.addEventListener('error', (event) => {
    const errorInfo = {
      type: 'javascript-error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('JavaScript Error:', errorInfo);
    } else {
      // Reportar a servicio de monitoreo
      fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorInfo),
      }).catch(() => {
        // Silenciar errores de reporte para evitar loops
      });
    }
  });

  // Promesas rechazadas no capturadas
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo = {
      type: 'unhandled-promise-rejection',
      reason: event.reason?.toString(),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled Promise Rejection:', errorInfo);
    } else {
      fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorInfo),
      }).catch(() => {
        // Silenciar errores de reporte
      });
    }
  });
}
