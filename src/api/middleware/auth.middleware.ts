/**
 * Authentication Middleware
 * OAuth2/OIDC token validation and user context
 */

import { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UserInfo, JWTPayload } from '../types/api.types';
import { ErrorResponses } from '../utils/response.util';
import {
  getAuthConfig,
  getClientId,
  isOAuth2Enabled,
  isIntrospectionEnabled,
  getJWTSecret,
  getClientSecret,
  getDiscoveryUrl,
  getIntrospectionUrl,
} from '../../config/auth.config';

// Extend Express Request for TypeScript
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserInfo;
  }
}

// Cache JWKS and discovery for performance
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;
let discoveryCache: Record<string, unknown> | null = null;

/**
 * Get OAuth2 discovery metadata
 */
async function getDiscoveryMetadata(): Promise<Record<string, unknown>> {
  if (!discoveryCache) {
    const discoveryUrl = getDiscoveryUrl();

    try {
      const response = await fetch(discoveryUrl);
      if (!response.ok) {
        throw new Error(`Discovery failed: ${response.status}`);
      }
      discoveryCache = await response.json();
    } catch (error) {
      console.error('OAuth2 discovery failed, falling back to default JWKS:', error);
      // Fallback to standard JWKS endpoint
      const config = getAuthConfig();
      discoveryCache = {
        jwks_uri: `${config.issuer}/.well-known/jwks.json`,
      };
    }
  }
  return discoveryCache as Record<string, unknown>;
}

/**
 * Initialize JWKS from OAuth2 discovery
 */
async function getJWKS() {
  if (!jwksCache) {
    const discovery = await getDiscoveryMetadata();
    const jwksUriPath = (discovery['jwks_uri'] as string) || '/.well-known/jwks.json';
    const jwksUri = new URL(jwksUriPath, getAuthConfig().issuer);
    jwksCache = createRemoteJWKSet(jwksUri);
  }
  return jwksCache;
}

/**
 * Validate token via OAuth2 introspection endpoint
 */
async function validateViaIntrospection(token: string): Promise<UserInfo | null> {
  try {
    const clientId = getClientId();
    const clientSecret = getClientSecret();

    if (!clientSecret) {
      console.error('OAuth2 client secret not configured for introspection');
      return null;
    }

    const introspectionEndpoint = getIntrospectionUrl();

    const response = await fetch(introspectionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        token,
        token_type_hint: 'access_token',
      }),
    });

    const result = await response.json();

    if (!result.active) {
      return null;
    }

    // Extract user information from introspection response
    const user: UserInfo = {
      id: result.sub || 'unknown',
      email: result.email || '',
      name: result.name || result.preferred_username || '',
      roles: result.realm_access?.roles || [],
      permissions: result.resource_access?.[clientId]?.roles || [],
      lastLogin: new Date().toISOString(),
    };

    return user;
  } catch (error) {
    console.error('Token introspection error:', error);
    return null;
  }
}

/**
 * Validate token via local JWT verification
 */
async function validateViaLocalJWT(token: string): Promise<UserInfo | null> {
  try {
    const authConfig = getAuthConfig();
    const clientId = getClientId();
    const jwtSecret = getJWTSecret();

    if (!jwtSecret) {
      console.error('JWT secret not configured for local validation');
      return null;
    }

    let payload;

    try {
      // Try JWKS first (for RS256 tokens)
      const JWKS = await getJWKS();
      const result = await jwtVerify(token, JWKS, {
        issuer: authConfig.issuer,
        audience: clientId,
      });
      payload = result.payload;
    } catch (error) {
      console.warn('JWKS verification failed, trying HMAC secret for HS256:', error);
      // Fallback to HMAC (HS256) with secret
      const secretKey = new TextEncoder().encode(jwtSecret);
      const result = await jwtVerify(token, secretKey, {
        issuer: authConfig.issuer,
        audience: clientId,
      });
      payload = result.payload;
    }

    // Extract user information from token claims
    const typedPayload = payload as unknown as JWTPayload;
    const user: UserInfo = {
      id: typedPayload.sub || 'unknown',
      email: typedPayload.email || '',
      name: typedPayload.name || typedPayload.preferred_username || '',
      roles: typedPayload.realm_access?.roles || [],
      permissions: typedPayload.resource_access?.[clientId]?.roles || [],
      lastLogin: new Date().toISOString(),
    };

    return user;
  } catch (error) {
    console.error('Local JWT validation error:', error);
    return null;
  }
}

/**
 * Main token validation function - uses configured validation mode
 */
async function validateToken(token: string): Promise<UserInfo | null> {
  // Check if OAuth2 service is enabled
  if (!isOAuth2Enabled()) {
    console.debug('OAuth2 service is disabled');
    return null;
  }

  // Use introspection or local JWT validation based on configuration
  if (isIntrospectionEnabled()) {
    return await validateViaIntrospection(token);
  } else {
    return await validateViaLocalJWT(token);
  }
}

/**
 * Authentication middleware - validates OAuth2 access token
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    ErrorResponses.unauthorized(res, 'No authorization header provided');
    return;
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    ErrorResponses.unauthorized(res, 'Invalid authorization header format');
    return;
  }

  try {
    const user = await validateToken(token);

    if (!user) {
      ErrorResponses.unauthorized(res, 'Invalid or expired token');
      return;
    }

    // Attach user to request
    req.user = user;

    // Attach user ID to metadata for logging
    if (req.metadata) {
      req.metadata.userId = user.id;
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    ErrorResponses.unauthorized(res, 'Authentication failed');
  }
}

/**
 * Optional authentication - doesn't fail if no token provided
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer === 'Bearer' && token) {
    try {
      const user = await validateToken(token);

      if (user) {
        req.user = user;

        if (req.metadata) {
          req.metadata.userId = user.id;
        }
      }
    } catch (error) {
      // Silently fail for optional auth
      console.debug('Optional auth failed:', error);
    }
  }

  next();
}

/**
 * Authorization middleware - checks user permissions
 */
export function authorize(...requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ErrorResponses.unauthorized(res);
      return;
    }

    const hasPermission = requiredPermissions.every((permission) =>
      req.user!.permissions.includes(permission),
    );

    if (!hasPermission) {
      ErrorResponses.forbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
}

/**
 * Role-based authorization
 */
export function requireRole(...requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ErrorResponses.unauthorized(res);
      return;
    }

    const hasRole = requiredRoles.some((role) => req.user!.roles.includes(role));

    if (!hasRole) {
      ErrorResponses.forbidden(res, 'Insufficient role privileges');
      return;
    }

    next();
  };
}

/**
 * Validate token endpoint for OAuth2 introspection
 */
export async function introspectToken(token: string): Promise<boolean> {
  if (!isOAuth2Enabled() || !isIntrospectionEnabled()) {
    return false;
  }

  const user = await validateViaIntrospection(token);
  return user !== null;
}
