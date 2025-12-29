/**
 * CORS Middleware
 * Cross-Origin Resource Sharing configuration
 */

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * CORS configuration options
 */
export interface CorsOptions {
  origins: string[];
  credentials: boolean;
  maxAge: number;
}

/**
 * Default CORS configuration
 */
const defaultCorsOptions: CorsOptions = {
  origins: Bun.env['CORS_ORIGINS']?.split(',') || ['http://localhost:4200'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * CORS middleware factory
 */
export function cors(options: Partial<CorsOptions> = {}) {
  const config = { ...defaultCorsOptions, ...options };

  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    // Check if origin is allowed
    if (origin && (config.origins.includes('*') || config.origins.includes(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (config.origins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Request-ID',
    );
    res.setHeader('Access-Control-Max-Age', config.maxAge.toString());

    if (config.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(StatusCodes.NO_CONTENT);
      return;
    }

    next();
  };
}

/**
 * Strict CORS for production
 */
export function strictCors() {
  const allowedOrigins =
    Bun.env['NODE_ENV'] === 'production'
      ? Bun.env['CORS_ORIGINS']?.split(',') || []
      : ['http://localhost:4200', 'http://localhost:4000'];

  return cors({
    origins: allowedOrigins,
    credentials: true,
    maxAge: 3600, // 1 hour in production
  });
}
