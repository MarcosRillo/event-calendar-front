# 🚀 Plan de Mejores Prácticas Next.js 15 - Event Calendar Frontend

## 📋 Análisis Inicial del Proyecto

### ✅ **Fortalezas Actuales**
- ✅ Next.js 15 con App Router
- ✅ TypeScript configurado correctamente
- ✅ Material-UI implementado consistentemente
- ✅ Estructura de carpetas organizada
- ✅ Estado global con Zustand
- ✅ Axios para HTTP client
- ✅ Rutas protegidas implementadas

### ⚠️ **Áreas de Mejora Identificadas**
- ❌ Falta configuración de entornos robusta
- ❌ Sin tests unitarios ni e2e
- ❌ Manejo de errores limitado
- ❌ Falta logging estructurado
- ❌ Sin optimizaciones de performance
- ❌ Configuración de SEO básica
- ❌ Sin validación de formularios robusta
- ❌ Falta documentación técnica
- ❌ Sin CI/CD configurado
- ❌ Seguridad mejorable

---

## 🎯 **FASE 1: FUNDAMENTOS CRÍTICOS** ✅ COMPLETADA
> **Status: COMPLETADA** - Todos los issues críticos resueltos

### ✅ **COMPLETADO**: Estructura de Archivos y Configuración
- ✅ `.gitignore` mejorado con patrones comprehensive
- ✅ `.env.example` creado con todas las variables necesarias  
- ✅ `next.config.ts` con headers de seguridad y optimizaciones

### ✅ **COMPLETADO**: Sistema de Logging y Limpieza de Código
- ✅ Sistema de logging estructurado implementado (`src/lib/logger.ts`)
- ✅ Todos los `console.log` reemplazados con logging apropiado
- ✅ `alert()` reemplazado con NotificationSnackbar

### ✅ **COMPLETADO**: Seguridad y Performance
- ✅ Token validation con JWT y limpieza automática
- ✅ Lazy Loading wrapper implementado
- ✅ Build exitoso sin errores
- ✅ Lint passing sin warnings

---

## 🛠️ **FASE 2: CALIDAD Y MANTENIBILIDAD** ✅ COMPLETADA
> **Status: COMPLETADA** - Testing, validación y error boundaries implementados

### ✅ **COMPLETADO**: Framework de Testing
- ✅ Jest + React Testing Library configurado
- ✅ Configuración con moduleNameMapper para aliases
- ✅ Setup con mocks para Next.js y DOM APIs
- ✅ Scripts de test en package.json (test, test:watch, test:coverage)
- ✅ Tests iniciales para componentes UI

### ✅ **COMPLETADO**: Validación de Formularios
- ✅ React Hook Form + Zod instalado y configurado
- ✅ Schemas de validación completos (`src/lib/validations/auth.ts`)
- ✅ Hook personalizado `useValidatedForm` para reutilización
- ✅ Validaciones para login, organizaciones y usuarios

### ✅ **COMPLETADO**: Error Boundaries y Manejo de Errores
- ✅ Error Boundary implementado (`src/components/error-boundaries/ErrorBoundary.tsx`)
- ✅ Hook para manejo de errores asíncronos (`useErrorHandler`)
- ✅ Logging de errores integrado con sistema estructurado
- ✅ Tests para Error Boundary

### ✅ **COMPLETADO**: Seguridad y Performance
- ✅ Token validation con JWT y limpieza automática
- ✅ Lazy Loading wrapper implementado
- ✅ Build exitoso sin errores
- ✅ Lint passing sin warnings

---

## 🎯 **FASE 1: FUNDAMENTOS CRÍTICOS** (IMPLEMENTACIÓN DETALLADA)
> **Prioridad: CRÍTICA** - Issues que pueden afectar producción

### 1.1 📁 **Estructura de Archivos y Configuración**

#### **Problem**: Archivos de backup y temporales en source control
```bash
# LIMPIAR INMEDIATAMENTE
src/components/EditOrganizationModal-new.tsx
src/app/organization-request/[token]/page-new.tsx
src/app/super-admin/organization-requests/[id]/page-new.tsx
```

**Acción**: 
```bash
# Crear .gitignore más robusto
echo "*.backup.*" >> .gitignore
echo "*.new.*" >> .gitignore
echo "*.old.*" >> .gitignore
echo "*-backup.*" >> .gitignore
echo "*-new.*" >> .gitignore
```

#### **Problem**: Configuración de entornos insegura
**Archivo**: `.env.example`
```env
# ❌ ACTUAL - Muy básico
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# ✅ MEJORADO
# Environment
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
NEXT_PUBLIC_APP_ENV=development
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Analytics (opcional)
NEXT_PUBLIC_ANALYTICS_ID=
NEXT_PUBLIC_GTM_ID=

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true

# Error Reporting
NEXT_PUBLIC_SENTRY_DSN=
```

### 1.2 🔒 **Seguridad**

#### **Problem**: Headers de seguridad faltantes
**Archivo**: `next.config.ts`
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ AÑADIR - Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  
  // ✅ AÑADIR - Configuración experimental
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + '/api/:path*' || 'http://localhost:8000/api/:path*',
      },
      {
        source: '/sanctum/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + '/sanctum/:path*' || 'http://localhost:8000/sanctum/:path*',
      },
    ];
  },
}

export default nextConfig
```

#### **Problem**: Manejo inseguro de tokens
**Archivo**: `src/lib/axios.ts` - Línea 20-30
```typescript
// ❌ ACTUAL - localStorage en interceptor
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.token || null;
    }
  } catch (error) {
    console.error('Error obteniendo token del storage:', error);
  }
  return null;
};

// ✅ MEJORADO - Más seguro y robusto
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('auth-storage');
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    const token = parsed.state?.token;
    
    // Validar formato de token JWT
    if (token && typeof token === 'string' && token.split('.').length === 3) {
      return token;
    }
  } catch (error) {
    console.warn('Token parsing error:', error);
    // Limpiar datos corruptos
    localStorage.removeItem('auth-storage');
  }
  return null;
};
```

### 1.3 ⚡ **Performance Crítica**

#### **Problem**: Bundle size no optimizado
**Archivo**: `src/components/ui/DataTable.tsx` - Importaciones
```typescript
// ❌ ACTUAL - Importaciones completas
import { DataGrid } from '@mui/x-data-grid';

// ✅ MEJORADO - Tree shaking
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
```

#### **Problem**: Sin lazy loading en rutas
**Crear**: `src/components/LazyWrapper.tsx`
```typescript
'use client';

import { Suspense, type ComponentType, type ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const DefaultFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight={400}
  >
    <CircularProgress />
  </Box>
);

export function LazyWrapper({ children, fallback = <DefaultFallback /> }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// HOC para componentes lazy
export function withLazy<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) {
  return function LazyComponent(props: P) {
    return (
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    );
  };
}
```

---

## 🛠️ **FASE 2: CALIDAD Y MANTENIBILIDAD** ✅ EN PROGRESO
> **Status: 70% COMPLETADA** - Framework de testing, validaciones y error boundaries implementados

### ✅ **COMPLETADO**: Testing Framework
- ✅ Jest configurado con Next.js integration
- ✅ React Testing Library setup completo
- ✅ Mocks para Next.js router y localStorage
- ✅ Scripts de test en package.json
- ✅ Tests iniciales para componentes UI

### ✅ **COMPLETADO**: Validación de Formularios  
- ✅ Zod schemas para todas las entidades principales
- ✅ React Hook Form integration
- ✅ Validaciones tipadas para Login, Organization, User
- ✅ Error handling utilities

### ✅ **COMPLETADO**: Error Boundaries
- ✅ ErrorBoundary component con logging integrado
- ✅ useErrorHandler hook para manejo asíncrono
- ✅ UI amigable para errores de producción
- ✅ Development mode con stack traces detallados

### 🔄 **PENDIENTE**: Finalizar Fase 2
- ⏳ Implementar formularios con validación en componentes existentes
- ⏳ Agregar más tests de cobertura
- ⏳ Configurar threshold de cobertura más estricto

---

## 🛠️ **FASE 2: CALIDAD Y MANTENIBILIDAD** (IMPLEMENTACIÓN DETALLADA)
> **Prioridad: ALTA** - Mejora la calidad del código

### 2.1 🧪 **Testing Framework**

#### **Instalar dependencias**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

#### **Crear**: `jest.config.js`
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

#### **Crear**: `jest.setup.js`
```javascript
import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

#### **Crear test ejemplo**: `src/components/ui/__tests__/StatsCard.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
  it('renders stats correctly', () => {
    render(
      <StatsCard
        title="Users"
        value="100"
        icon={<div data-testid="icon">👤</div>}
        color="primary"
      />
    );
    
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
```

### 2.2 📝 **Validación de Formularios**

#### **Instalar**: `npm install react-hook-form @hookform/resolvers zod`

#### **Crear**: `src/lib/validations/auth.ts`
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones')
    .max(50, 'El slug no puede exceder 50 caracteres'),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  website_url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[+]?[0-9\s\-()]+$/, 'Formato de teléfono inválido')
    .optional()
    .or(z.literal('')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OrganizationFormData = z.infer<typeof organizationSchema>;
```

#### **Refactorizar**: `src/hooks/useLoginForm.ts`
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

export function useLoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Error de login'
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
```

### 2.3 📊 **Logging y Monitoreo**

#### **Crear**: `src/lib/logger.ts`
```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) {
      return level === 'error' || level === 'warn';
    }
    return true;
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    return formatted;
  }

  debug(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('debug')) return;
    const entry = this.createLogEntry('debug', message, context);
    console.log(this.formatMessage(entry));
  }

  info(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('info')) return;
    const entry = this.createLogEntry('info', message, context);
    console.info(this.formatMessage(entry));
  }

  warn(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('warn')) return;
    const entry = this.createLogEntry('warn', message, context);
    console.warn(this.formatMessage(entry));
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createLogEntry('error', message, context, error);
    console.error(this.formatMessage(entry));
    
    if (error) {
      console.error('Stack trace:', error.stack);
    }

    // En producción, enviar a servicio de logging
    if (!this.isDevelopment && this.isClient) {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // Implementar envío a Sentry, LogRocket, etc.
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      // Falló el logging externo, pero no queremos que crashee la app
      console.error('Failed to send log to external service:', err);
    }
  }
}

export const logger = new Logger();
```

### 2.4 🎯 **Manejo de Errores Robusto**

#### **Crear**: `src/components/ErrorBoundary.tsx`
```typescript
'use client';

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              ¡Oops! Algo salió mal
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Error Details (Development Only):
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={this.handleReset}>
                Intentar de Nuevo
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = '/dashboard'}
              >
                Ir al Dashboard
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

// HOC para envolver páginas con error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
```

---

## 🎨 **FASE 3: EXPERIENCIA DE USUARIO** (Semana 5-6)
> **Prioridad: MEDIA** - Mejora la UX/UI

### 3.1 🔄 **Estados de Carga Globales**

#### **Crear**: `src/store/uiStore.ts`
```typescript
import { create } from 'zustand';

interface UIState {
  // Loading states
  isGlobalLoading: boolean;
  loadingMessage?: string;
  
  // Notifications
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  
  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isGlobalLoading: false,
  loadingMessage: undefined,
  notifications: [],

  setGlobalLoading: (loading, message) => 
    set({ isGlobalLoading: loading, loadingMessage: message }),

  addNotification: (notification) => {
    const id = crypto.randomUUID();
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
```

### 3.2 🎭 **Componentes de Estado**

#### **Crear**: `src/components/ui/StateDisplay.tsx`
```typescript
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ErrorOutline, HelpOutline, CheckCircle } from '@mui/icons-material';

interface StateDisplayProps {
  state: 'loading' | 'error' | 'empty' | 'success';
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const stateConfig = {
  loading: {
    icon: <CircularProgress />,
    title: 'Cargando...',
    message: 'Por favor espera mientras procesamos tu solicitud.',
  },
  error: {
    icon: <ErrorOutline color="error" sx={{ fontSize: 60 }} />,
    title: 'Error',
    message: 'Ha ocurrido un error. Inténtalo de nuevo.',
  },
  empty: {
    icon: <HelpOutline color="disabled" sx={{ fontSize: 60 }} />,
    title: 'Sin datos',
    message: 'No hay información disponible en este momento.',
  },
  success: {
    icon: <CheckCircle color="success" sx={{ fontSize: 60 }} />,
    title: '¡Éxito!',
    message: 'La operación se completó correctamente.',
  },
};

export function StateDisplay({ 
  state, 
  title, 
  message, 
  action, 
  icon 
}: StateDisplayProps) {
  const config = stateConfig[state];
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={300}
      textAlign="center"
      gap={2}
    >
      {icon || config.icon}
      
      <Typography variant="h6" gutterBottom>
        {title || config.title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" maxWidth={400}>
        {message || config.message}
      </Typography>
      
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
```

### 3.3 🎯 **Hook de Notificaciones**

#### **Crear**: `src/hooks/useNotifications.ts`
```typescript
import { useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';

export function useNotifications() {
  const { addNotification, removeNotification, clearNotifications } = useUIStore();

  const notify = useCallback({
    success: (message: string, duration?: number) =>
      addNotification({ message, type: 'success', duration }),
    
    error: (message: string, duration?: number) =>
      addNotification({ message, type: 'error', duration }),
    
    warning: (message: string, duration?: number) =>
      addNotification({ message, type: 'warning', duration }),
    
    info: (message: string, duration?: number) =>
      addNotification({ message, type: 'info', duration }),
  }, [addNotification]);

  return {
    notify,
    removeNotification,
    clearNotifications,
  };
}
```

---

## 🚀 **FASE 4: OPTIMIZACIONES AVANZADAS** (Semana 7-8)
> **Prioridad: BAJA** - Optimizaciones finales

### 4.1 📈 **SEO y Metadata**

#### **Crear**: `src/lib/metadata.ts`
```typescript
import type { Metadata } from 'next';

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage = '/og-image.png',
    canonical
  } = options;

  const fullTitle = `${title} | Event Calendar - Ente de Turismo de Tucumán`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'eventos', 'turismo', 'tucuman'].join(', '),
    authors: [{ name: 'Ente de Turismo de Tucumán' }],
    creator: 'Ente de Turismo de Tucumán',
    
    openGraph: {
      title: fullTitle,
      description,
      images: [ogImage],
      locale: 'es_AR',
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    
    alternates: {
      canonical,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
```

### 4.2 ⚡ **React Query para Cache**

#### **Instalar**: `npm install @tanstack/react-query`

#### **Crear**: `src/providers/QueryProvider.tsx`
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { logger } from '@/lib/logger';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          retry: (failureCount, error) => {
            // No retry on 4xx errors
            if (error instanceof Error && 'status' in error) {
              const status = (error as any).status;
              if (status >= 400 && status < 500) return false;
            }
            return failureCount < 3;
          },
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          onError: (error) => {
            logger.error('Mutation error', error instanceof Error ? error : new Error(String(error)));
          },
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

### 4.3 🔧 **Performance Monitoring**

#### **Crear**: `src/lib/performance.ts`
```typescript
interface PerformanceEntry {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private entries = new Map<string, PerformanceEntry>();
  private isClient = typeof window !== 'undefined';

  startMeasure(name: string, metadata?: Record<string, any>) {
    if (!this.isClient) return;

    const entry: PerformanceEntry = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.entries.set(name, entry);
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string) {
    if (!this.isClient) return;

    const entry = this.entries.get(name);
    if (!entry) return;

    const endTime = performance.now();
    const duration = endTime - entry.startTime;

    entry.duration = duration;
    this.entries.set(name, entry);

    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    // Log slow operations
    if (duration > 1000) {
      logger.warn(`Slow operation detected: ${name}`, {
        duration,
        ...entry.metadata,
      });
    }

    return duration;
  }

  getMetrics() {
    return Array.from(this.entries.values());
  }

  // Web Vitals reporting
  reportWebVitals(metric: any) {
    if (process.env.NODE_ENV === 'production') {
      // Send to analytics
      logger.info('Web Vitals', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// HOC para medir render time de componentes
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function MonitoredComponent(props: P) {
    React.useEffect(() => {
      performanceMonitor.startMeasure(`render-${componentName}`);
      return () => {
        performanceMonitor.endMeasure(`render-${componentName}`);
      };
    });

    return <Component {...props} />;
  };
}
```

---

## 📋 **SCRIPTS DE PACKAGE.JSON MEJORADOS**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "analyze": "cross-env ANALYZE=true next build",
    "clean": "rimraf .next out dist",
    "prepare": "husky install"
  },
  "devDependencies": {
    // ... existing deps
    "cross-env": "^7.0.3",
    "rimraf": "^5.0.5",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.0"
  }
}
```

---

## 🎯 **CRONOGRAMA DE IMPLEMENTACIÓN**

### **Semana 1** (Crítico)
- [ ] Limpiar archivos backup
- [ ] Configurar variables de entorno robustas
- [ ] Implementar headers de seguridad
- [ ] Mejorar manejo de tokens

### **Semana 2** (Crítico)
- [ ] Implementar logging estructurado
- [ ] Añadir ErrorBoundary global
- [ ] Optimizar importaciones para tree-shaking
- [ ] Configurar lazy loading

### **Semana 3** (Calidad)
- [ ] Configurar Jest y testing framework
- [ ] Implementar validación con Zod
- [ ] Crear primeros tests unitarios
- [ ] Refactorizar hooks con validación

### **Semana 4** (Calidad)
- [ ] Implementar sistema de notificaciones
- [ ] Crear componentes de estado reutilizables
- [ ] Mejorar manejo de errores HTTP
- [ ] Añadir más cobertura de tests

### **Semana 5-6** (UX/UI)
- [ ] Implementar React Query para cache
- [ ] Crear sistema de notificaciones global
- [ ] Mejorar componentes de estado de carga
- [ ] Optimizar experiencia mobile

### **Semana 7-8** (Optimización)
- [ ] Configurar SEO y metadata dinámico
- [ ] Implementar performance monitoring
- [ ] Configurar analytics
- [ ] Preparar para producción

---

## 🔍 **MÉTRICAS DE ÉXITO**

### **Performance**
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Bundle size < 500KB (gzipped)

### **Calidad**
- [ ] Test coverage > 70%
- [ ] 0 TypeScript errors
- [ ] 0 ESLint errors
- [ ] Lighthouse score > 90

### **Seguridad**
- [ ] Todos los headers de seguridad implementados
- [ ] Tokens manejados de forma segura
- [ ] Inputs validados en frontend y backend
- [ ] Error messages no exponen información sensible

Este plan te dará una base sólida para un proyecto de clase mundial en Next.js 15. ¿Por cuál fase te gustaría empezar?
