/**
 * Application Configuration
 *
 * Defines performance settings, caching, and other application-level configurations.
 * These are build-time configurations that can vary by environment.
 */

export interface AppConfig {
  // Performance settings
  cache: {
    ttl: number; // seconds
    maxSize: number; // MB
    checkPeriod: number; // seconds
    angularCacheTimeout: number; // seconds
  };

  // Request settings
  request: {
    timeout: number; // milliseconds
    maxSize: string; // e.g. '10mb'
    retries: number;
    retryDelay: number; // milliseconds
  };

  // CORS settings (for local development only)
  cors: {
    origins: string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };

  // Feature flags
  features: {
    enableSSR: boolean;
    enablePWA: boolean;
    enableAnalytics: boolean;
    enableDevTools: boolean;
  };

  // UI settings
  ui: {
    theme: 'light' | 'dark' | 'auto';
    pageSize: number;
    maxFileUploadSize: number; // MB
    animationDuration: number; // milliseconds
  };
}

/**
 * Application configuration for different environments
 */
export const appConfig: Record<string, AppConfig> = {
  development: {
    cache: {
      ttl: 300, // 5 minutes
      maxSize: 50,
      checkPeriod: 60,
      angularCacheTimeout: 300,
    },
    request: {
      timeout: 30000,
      maxSize: '10mb',
      retries: 3,
      retryDelay: 1000,
    },
    cors: {
      origins: ['http://localhost:4200', 'http://localhost:4000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    },
    features: {
      enableSSR: true,
      enablePWA: false,
      enableAnalytics: false,
      enableDevTools: true,
    },
    ui: {
      theme: 'light',
      pageSize: 25,
      maxFileUploadSize: 5,
      animationDuration: 300,
    },
  },

  staging: {
    cache: {
      ttl: 600, // 10 minutes
      maxSize: 100,
      checkPeriod: 120,
      angularCacheTimeout: 600,
    },
    request: {
      timeout: 30000,
      maxSize: '10mb',
      retries: 3,
      retryDelay: 1000,
    },
    cors: {
      origins: ['https://staging-admin.recipe-app.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    features: {
      enableSSR: true,
      enablePWA: true,
      enableAnalytics: true,
      enableDevTools: false,
    },
    ui: {
      theme: 'light',
      pageSize: 50,
      maxFileUploadSize: 10,
      animationDuration: 200,
    },
  },

  production: {
    cache: {
      ttl: 1800, // 30 minutes
      maxSize: 200,
      checkPeriod: 300,
      angularCacheTimeout: 1800,
    },
    request: {
      timeout: 15000,
      maxSize: '5mb',
      retries: 2,
      retryDelay: 2000,
    },
    cors: {
      origins: ['https://admin.recipe-app.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    features: {
      enableSSR: true,
      enablePWA: true,
      enableAnalytics: true,
      enableDevTools: false,
    },
    ui: {
      theme: 'light',
      pageSize: 100,
      maxFileUploadSize: 20,
      animationDuration: 150,
    },
  },
};

/**
 * Get application configuration for current environment
 */
export function getAppConfig(): AppConfig {
  const env = process.env['NODE_ENV'] || 'development';
  return appConfig[env] || appConfig['development'];
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  return getAppConfig().features[feature];
}

/**
 * Get SSR enabled status from environment or config
 */
export function isSSREnabled(): boolean {
  const envSSR = process.env['ANGULAR_SSR_ENABLED'];
  if (envSSR !== undefined) {
    return envSSR === 'true' || envSSR === '1';
  }
  return getAppConfig().features.enableSSR;
}
