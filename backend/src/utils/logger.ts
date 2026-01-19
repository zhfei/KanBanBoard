/**
 * Logger utility for structured logging
 */

export interface LogContext {
  [key: string]: any;
}

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Generate a unique request ID
   */
  static generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format log entry as JSON
   */
  private formatLog(level: string, message: string, context?: LogContext): string {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...context,
    };
    return JSON.stringify(logEntry);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    console.log(this.formatLog('INFO', message, context));
  }

  /**
   * Log error message
   */
  error(message: string, context?: LogContext): void {
    console.error(this.formatLog('ERROR', message, context));
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatLog('WARN', message, context));
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatLog('DEBUG', message, context));
    }
  }
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return Logger.generateRequestId();
}
