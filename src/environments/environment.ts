export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authConfig: {
    issuer: 'http://localhost:8080/auth',
    clientId: 'admin-ui-client-dev',
    scope: 'openid profile email admin',
    responseType: 'code',
    usePkce: true,
    requireHttps: false,
    strictDiscoveryDocumentValidation: false,
  },
  features: {
    analytics: false,
    realTimeUpdates: true,
    offlineMode: false,
    darkMode: true,
  },
  monitoring: {
    sentryDsn: '',
    logLevel: 'debug' as const,
  },
};
