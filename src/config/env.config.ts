/**
 * Environment Configuration Loader
 *
 * Provides centralized environment variable loading that:
 * - Loads .env files in local development
 * - Falls back to process.env variables in production/Kubernetes
 * - Ensures environment variables always take precedence over .env files
 * - Provides type-safe environment variable access
 */

import { config } from 'dotenv';
import { join } from 'path';

// Track if dotenv has been loaded to avoid multiple loads
let dotenvLoaded = false;

/**
 * Load environment variables from .env file if in development
 * This is called automatically on first import but can be called manually
 */
export function loadEnvConfig(): void {
  if (dotenvLoaded) {
    return;
  }

  // Only load .env in development or when NODE_ENV is not set
  const nodeEnv = process.env['NODE_ENV'];
  const isProduction = nodeEnv === 'production';

  if (!isProduction) {
    try {
      // Try to load .env from project root
      const envPath = join(process.cwd(), '.env');
      config({ path: envPath, override: false }); // override: false means env vars take precedence
      console.log(`✓ Loaded environment configuration from .env file`);
    } catch {
      // Silently fail if .env doesn't exist - this is expected in production
      console.log(`ℹ No .env file found, using environment variables only`);
    }
  }

  dotenvLoaded = true;
}

/**
 * Get an environment variable with optional default value
 * Automatically loads .env on first call
 */
export function getEnvVar(key: string, defaultValue?: string): string | undefined {
  loadEnvConfig();
  return process.env[key] || defaultValue;
}

/**
 * Get a required environment variable
 * Throws an error if the variable is not set
 */
export function getRequiredEnvVar(key: string): string {
  loadEnvConfig();
  const value = process.env[key];
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
  loadEnvConfig();
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
}

/**
 * Get an environment variable as a number
 */
export function getEnvNumber(key: string, defaultValue?: number): number | undefined {
  loadEnvConfig();
  const value = process.env[key];
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
  loadEnvConfig();
  return getEnvVar('NODE_ENV', 'development') === 'development';
}

/**
 * Check if we're running in production mode
 */
export function isProduction(): boolean {
  loadEnvConfig();
  return getEnvVar('NODE_ENV') === 'production';
}

/**
 * Get all environment variables with a specific prefix
 * Useful for grouping related configuration
 */
export function getEnvVarsWithPrefix(prefix: string): Record<string, string> {
  loadEnvConfig();
  const result: Record<string, string> = {};

  Object.keys(process.env).forEach((key) => {
    if (key.startsWith(prefix)) {
      const value = process.env[key];
      if (value) {
        result[key] = value;
      }
    }
  });

  return result;
}

// Auto-load on import
loadEnvConfig();
