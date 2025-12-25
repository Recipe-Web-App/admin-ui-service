/**
 * Authentication Configuration
 *
 * Defines authentication settings that are build-time constants.
 * Environment-specific values like client ID come from environment variables or .env files.
 */

import { getEnvVar, getEnvBool } from './env.config';

export interface AuthConfig {
  issuer: string;
  scope: string[];
  responseType: string;
  redirectUri: string;
  logoutRedirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  introspectionEndpoint: string;
  revocationEndpoint: string;
  userInfoEndpoint: string;
  discoveryEndpoint: string;
  timeout: number;
}

/**
 * Authentication configuration for different environments
 */
export const authConfig: Record<string, AuthConfig> = {
  development: {
    issuer: 'http://localhost:8080/api/v1/auth',
    scope: ['openid', 'profile', 'email', 'admin'],
    responseType: 'code',
    redirectUri: 'http://localhost:4000/auth/callback',
    logoutRedirectUri: 'http://localhost:4000/auth/logout',
    authorizationEndpoint: '/oauth2/authorize',
    tokenEndpoint: '/oauth2/token',
    introspectionEndpoint: '/oauth2/introspect',
    revocationEndpoint: '/oauth2/revoke',
    userInfoEndpoint: '/oauth2/userinfo',
    discoveryEndpoint: '/.well-known/oauth-authorization-server',
    timeout: 30000,
  },

  staging: {
    issuer: 'https://staging-auth.recipe-app.com/api/v1/auth',
    scope: ['openid', 'profile', 'email', 'admin'],
    responseType: 'code',
    redirectUri: 'https://staging-admin.recipe-app.com/auth/callback',
    logoutRedirectUri: 'https://staging-admin.recipe-app.com/auth/logout',
    authorizationEndpoint: '/oauth2/authorize',
    tokenEndpoint: '/oauth2/token',
    introspectionEndpoint: '/oauth2/introspect',
    revocationEndpoint: '/oauth2/revoke',
    userInfoEndpoint: '/oauth2/userinfo',
    discoveryEndpoint: '/.well-known/oauth-authorization-server',
    timeout: 30000,
  },

  production: {
    issuer: 'https://sous-chef-proxy.local/api/v1/auth',
    scope: ['openid', 'profile', 'email', 'admin'],
    responseType: 'code',
    redirectUri: 'https://admin.recipe-app.com/auth/callback',
    logoutRedirectUri: 'https://admin.recipe-app.com/auth/logout',
    authorizationEndpoint: '/oauth2/authorize',
    tokenEndpoint: '/oauth2/token',
    introspectionEndpoint: '/oauth2/introspect',
    revocationEndpoint: '/oauth2/revoke',
    userInfoEndpoint: '/oauth2/userinfo',
    discoveryEndpoint: '/.well-known/oauth-authorization-server',
    timeout: 30000,
  },
};

/**
 * Get authentication configuration for current environment
 */
export function getAuthConfig(): AuthConfig {
  const env = getEnvVar('NODE_ENV', 'development')!;
  return authConfig[env] || authConfig['development'];
}

/**
 * Get client ID from environment (this should remain an env var)
 */
export function getClientId(): string {
  return getEnvVar('OAUTH2_CLIENT_ID', 'admin-ui-client')!;
}

/**
 * OAuth2 Service Configuration Helpers
 */

/**
 * Check if OAuth2 service is enabled
 */
export function isOAuth2Enabled(): boolean {
  return getEnvBool('OAUTH2_SERVICE_ENABLED');
}

/**
 * Check if OAuth2 introspection is enabled (vs local JWT validation)
 */
export function isIntrospectionEnabled(): boolean {
  return getEnvBool('OAUTH2_INTROSPECTION_ENABLED');
}

/**
 * Check if service-to-service authentication is enabled
 */
export function isServiceToServiceEnabled(): boolean {
  return getEnvBool('OAUTH2_SERVICE_TO_SERVICE_ENABLED');
}

/**
 * Get JWT secret for local token validation
 * Only used when introspection is disabled
 */
export function getJWTSecret(): string | null {
  const secret = getEnvVar('JWT_SECRET');
  if (!secret) {
    console.warn('JWT_SECRET not configured - local JWT validation will fail');
    return null;
  }
  return secret;
}

/**
 * Get OAuth2 client secret (for introspection)
 */
export function getClientSecret(): string | null {
  const secret = getEnvVar('OAUTH2_CLIENT_SECRET');
  if (!secret) {
    console.warn('OAUTH2_CLIENT_SECRET not configured - introspection will fail');
    return null;
  }
  return secret;
}

/**
 * OAuth2 Endpoint Helpers
 */

/**
 * Get full authorization endpoint URL
 */
export function getAuthorizationUrl(): string {
  const config = getAuthConfig();
  return `${config.issuer}${config.authorizationEndpoint}`;
}

/**
 * Get full token endpoint URL
 */
export function getTokenUrl(): string {
  const config = getAuthConfig();
  return `${config.issuer}${config.tokenEndpoint}`;
}

/**
 * Get full introspection endpoint URL
 */
export function getIntrospectionUrl(): string {
  const config = getAuthConfig();
  return `${config.issuer}${config.introspectionEndpoint}`;
}

/**
 * Get full revocation endpoint URL
 */
export function getRevocationUrl(): string {
  const config = getAuthConfig();
  return `${config.issuer}${config.revocationEndpoint}`;
}

/**
 * Get full user info endpoint URL
 */
export function getUserInfoUrl(): string {
  const config = getAuthConfig();
  return `${config.issuer}${config.userInfoEndpoint}`;
}

/**
 * Get full discovery endpoint URL
 */
export function getDiscoveryUrl(): string {
  const config = getAuthConfig();
  return `${config.issuer}${config.discoveryEndpoint}`;
}
