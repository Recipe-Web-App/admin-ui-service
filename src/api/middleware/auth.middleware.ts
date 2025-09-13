/**
 * Authentication Middleware
 * OAuth2/OIDC token validation and user context
 */

import { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UserInfo, JWTPayload } from '../types/api.types';
import { ErrorResponses } from '../utils/response.util';

// Extend Express Request for TypeScript
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserInfo;
  }
}

// Cache JWKS for performance
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Initialize JWKS from OAuth2 issuer
 */
function getJWKS() {
  if (!jwksCache) {
    const issuer = process.env['AUTH_ISSUER'] || 'http://localhost:8080/auth';
    const jwksUri = new URL('/.well-known/jwks.json', issuer);
    jwksCache = createRemoteJWKSet(jwksUri);
  }
  return jwksCache;
}

/**
 * Validate OAuth2 access token
 */
async function validateOAuth2Token(token: string): Promise<UserInfo | null> {
  try {
    const issuer = process.env['AUTH_ISSUER'] || 'http://localhost:8080/auth';
    const clientId = process.env['AUTH_CLIENT_ID'] || 'admin-ui-client';
    const JWKS = getJWKS();

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWKS, {
      issuer,
      audience: clientId,
    });

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
    console.error('OAuth2 token validation error:', error);
    return null;
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
    const user = await validateOAuth2Token(token);

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
      const user = await validateOAuth2Token(token);

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
  try {
    const issuer = process.env['AUTH_ISSUER'] || 'http://localhost:8080/auth';
    const introspectionEndpoint = `${issuer}/protocol/openid-connect/token/introspect`;

    const response = await fetch(introspectionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token,
        client_id: process.env['AUTH_CLIENT_ID'] || 'admin-ui-client',
      }),
    });

    const result = await response.json();
    return result.active === true;
  } catch (error) {
    console.error('Token introspection error:', error);
    return false;
  }
}
