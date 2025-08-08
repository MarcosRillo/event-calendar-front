type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Tipo para contexto de logging
type LogContext = Record<string, string | number | boolean | null | undefined>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  private createLogEntry(
    level: LogLevel, 
    message: string, 
    context?: LogContext, 
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Agregar información del cliente si está disponible
    if (this.isClient) {
      entry.userAgent = navigator.userAgent;
      entry.url = window.location.href;
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) {
      // En producción, solo loggear errores y warnings
      return level === 'error' || level === 'warn';
    }
    return true;
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += `\n📋 Context: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (entry.url) {
      formatted += `\n🌐 URL: ${entry.url}`;
    }
    
    return formatted;
  }

  debug(message: string, context?: LogContext) {
    if (!this.shouldLog('debug')) return;
    const entry = this.createLogEntry('debug', message, context);
    console.log(`🔍 ${this.formatMessage(entry)}`);
  }

  info(message: string, context?: LogContext) {
    if (!this.shouldLog('info')) return;
    const entry = this.createLogEntry('info', message, context);
    console.info(`ℹ️ ${this.formatMessage(entry)}`);
  }

  warn(message: string, context?: LogContext) {
    if (!this.shouldLog('warn')) return;
    const entry = this.createLogEntry('warn', message, context);
    console.warn(`⚠️ ${this.formatMessage(entry)}`);
    
    // En producción, enviar warnings críticos
    if (!this.isDevelopment && this.isClient) {
      this.sendToExternalService(entry);
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    const entry = this.createLogEntry('error', message, context, error);
    console.error(`❌ ${this.formatMessage(entry)}`);
    
    if (error) {
      console.error('📚 Stack trace:', error.stack);
      
      // Agregar información adicional del error
      if (error instanceof Error) {
        console.error('📝 Error details:', {
          name: error.name,
          message: error.message,
          cause: (error as Error & { cause?: unknown }).cause,
        });
      }
    }

    // Siempre enviar errores a servicio externo en producción
    if (!this.isDevelopment && this.isClient) {
      this.sendToExternalService(entry);
    }
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext) {
    const level = duration > 1000 ? 'warn' : 'info';
    const message = `Operation "${operation}" took ${duration.toFixed(2)}ms`;
    
    if (level === 'warn') {
      this.warn(`🐌 Slow ${message}`, { ...context, duration });
    } else if (this.isDevelopment) {
      this.info(`⚡ ${message}`, { ...context, duration });
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // En el futuro, aquí se puede implementar envío a Sentry, LogRocket, etc.
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {
        // Silenciar errores del logging para no crear bucles
      });
    } catch {
      // Falló el logging externo, pero no queremos que crashee la app
      // Silenciosamente falla para evitar bucles de error
    }
  }

  // Utility para crear loggers con contexto
  createContextLogger(defaultContext: LogContext) {
    return {
      debug: (message: string, context?: LogContext) =>
        this.debug(message, { ...defaultContext, ...context }),
      info: (message: string, context?: LogContext) =>
        this.info(message, { ...defaultContext, ...context }),
      warn: (message: string, context?: LogContext) =>
        this.warn(message, { ...defaultContext, ...context }),
      error: (message: string, error?: Error, context?: LogContext) =>
        this.error(message, error, { ...defaultContext, ...context }),
    };
  }
}

export const logger = new Logger();

// Hook para usar logger en componentes React
export function useLogger(componentName: string) {
  return logger.createContextLogger({ component: componentName });
}
