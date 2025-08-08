'use client';

import { useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface WebVital {
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  id: string;
}

// Thresholds for Core Web Vitals (good/needs improvement/poor)
const THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 },
};

export function usePerformanceMonitoring() {
  const reportVital = useCallback((metric: WebVital) => {
    const { name, value } = metric;
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good';
    if (threshold) {
      if (value > threshold.poor) {
        rating = 'poor';
      } else if (value > threshold.good) {
        rating = 'needs-improvement';
      }
    }

    // Log the metric
    logger.info(`Performance Metric: ${name} - ${value}ms (${rating})`);

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics 4
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', name, {
          value: Math.round(value),
          metric_rating: rating,
        });
      }
    }
  }, []);

  const measureNavigation = useCallback(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.fetchStart;
      const domLoad = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      
      logger.info(`Navigation Timing - TTFB: ${ttfb}ms, DOM Load: ${domLoad}ms`);
      
      return { ttfb, domLoad };
    }
  }, []);

  useEffect(() => {
    // Dynamic import of web-vitals for better bundle splitting
    const loadWebVitals = async () => {
      try {
        const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals');
        
        onCLS(reportVital);
        onFCP(reportVital);
        onLCP(reportVital);
        onTTFB(reportVital);
      } catch {
        logger.error('Failed to load web-vitals library');
      }
    };

    // Measure navigation timing after the page loads
    const measureAfterLoad = () => {
      setTimeout(() => {
        measureNavigation();
      }, 0);
    };

    if (document.readyState === 'complete') {
      measureAfterLoad();
    } else {
      window.addEventListener('load', measureAfterLoad);
    }

    // Load web vitals
    loadWebVitals();

    return () => {
      window.removeEventListener('load', measureAfterLoad);
    };
  }, [reportVital, measureNavigation]);

  // Manual performance measurement utilities
  const startMeasure = useCallback((name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  }, []);

  const endMeasure = useCallback((name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          logger.info(`Performance Measure: ${name} - ${measure.duration}ms`);
          
          // Clean up marks
          performance.clearMarks(`${name}-start`);
          performance.clearMarks(`${name}-end`);
          performance.clearMeasures(name);
          
          return measure.duration;
        }
      } catch {
        logger.error(`Failed to measure ${name}`);
      }
    }
    return null;
  }, []);

  return {
    startMeasure,
    endMeasure,
    measureNavigation,
  };
}
