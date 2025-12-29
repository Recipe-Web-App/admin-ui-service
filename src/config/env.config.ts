/**
 * Environment Configuration
 *
 * Provides centralized environment variable access using Bun.env:
 * - Bun automatically loads .env files (no dotenv needed)
 * - Environment variables always take precedence over .env files
 * - Provides type-safe environment variable access
 */

/**
 * Get an environment variable with optional default value
 */
export function getEnvVar(key: string, defaultValue?: string): string | undefined {
  return Bun.env[key] || defaultValue;
}

/**
 * Get a required environment variable
 * Throws an error if the variable is not set
 */
export function getRequiredEnvVar(key: string): string {
  const value = Bun.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get an environment variable as a boolean
 * Considers 'true', '1', 'yes' as true, everything else as false
 */
export function getEnvBool(key: string, defaultValue = false): boolean {
  const value = Bun.env[key];
  if (!value) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
}

/**
 * Get an environment variable as a number
 */
export function getEnvNumber(key: string, defaultValue?: number): number | undefined {
  const value = Bun.env[key];
  if (!value) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`Environment variable ${key} is not a valid number: ${value}`);
    return defaultValue;
  }
  return parsed;
}

/**
 * Check if we're running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvVar('NODE_ENV', 'development') === 'development';
}

/**
 * Check if we're running in production mode
 */
export function isProduction(): boolean {
  return getEnvVar('NODE_ENV') === 'production';
}

/**
 * Get all environment variables with a specific prefix
 * Useful for grouping related configuration
 */
export function getEnvVarsWithPrefix(prefix: string): Record<string, string> {
  const result: Record<string, string> = {};

  Object.keys(Bun.env).forEach((key) => {
    if (key.startsWith(prefix)) {
      const value = Bun.env[key];
      if (value) {
        result[key] = value;
      }
    }
  });

  return result;
}

/**
 * @deprecated No longer needed - Bun automatically loads .env files
 */
export function loadEnvConfig(): void {
  // No-op: Bun automatically loads .env files
}
