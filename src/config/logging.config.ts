/**
 * Logging Configuration
 *
 * Defines logging levels, formats, and transports for the application.
 * These are build-time configurations that vary by environment.
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export interface LoggerConfig {
  level: LogLevel;
  format: 'json' | 'simple' | 'combined';
  enableConsole: boolean;
  enableFile: boolean;
  fileMaxSize: string;
  fileMaxFiles: number;
  enableTimestamp: boolean;
  enableColors: boolean;
}

/**
 * Logging configuration for different environments
 */
export const loggingConfig: Record<string, LoggerConfig> = {
  development: {
    level: 'debug',
    format: 'simple',
    enableConsole: true,
    enableFile: true,
    fileMaxSize: '10m',
    fileMaxFiles: 3,
    enableTimestamp: true,
    enableColors: true,
  },

  staging: {
    level: 'info',
    format: 'json',
    enableConsole: true,
    enableFile: true,
    fileMaxSize: '50m',
    fileMaxFiles: 5,
    enableTimestamp: true,
    enableColors: false,
  },

  production: {
    level: 'warn',
    format: 'json',
    enableConsole: true,
    enableFile: false, // Use external log aggregation
    fileMaxSize: '100m',
    fileMaxFiles: 10,
    enableTimestamp: true,
    enableColors: false,
  },
};

/**
 * Get logging configuration for current environment
 */
export function getLoggingConfig(): LoggerConfig {
  const env = Bun.env['NODE_ENV'] || 'development';
  return loggingConfig[env] || loggingConfig['development'];
}

/**
 * Check if log level is enabled
 */
export function isLogLevelEnabled(level: LogLevel): boolean {
  const config = getLoggingConfig();
  const levels: LogLevel[] = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];
  const currentIndex = levels.indexOf(config.level);
  const targetIndex = levels.indexOf(level);
  return targetIndex <= currentIndex;
}
