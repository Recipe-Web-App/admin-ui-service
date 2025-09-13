export const environment = {
  production: true,
  apiUrl: 'https://api.recipeapp.com',
  authConfig: {
    issuer: 'https://auth.recipeapp.com',
    clientId: 'admin-ui-client',
    scope: 'openid profile email admin',
    responseType: 'code',
    usePkce: true,
    requireHttps: true,
    strictDiscoveryDocumentValidation: false,
  },
  features: {
    analytics: true,
    realTimeUpdates: true,
    offlineMode: true,
    darkMode: true,
  },
  monitoring: {
    sentryDsn: 'your-sentry-dsn',
    logLevel: 'error' as const,
  },
};
