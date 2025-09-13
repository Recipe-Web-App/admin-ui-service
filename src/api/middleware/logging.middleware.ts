/**
 * Logging Middleware
 * Request/response logging for observability
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggingMetadata } from '../types/api.types';

// Extend Express Request for TypeScript
declare module 'express-serve-static-core' {
  interface Request {
    metadata?: LoggingMetadata;
  }
}

/**
 * Generate request ID and attach metadata
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  const startTime = Date.now();

  // Attach request ID to response locals
  res.locals.requestId = requestId;

  // Attach metadata to request
  req.metadata = {
    requestId,
    userId: undefined, // Will be populated by auth middleware
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.socket.remoteAddress || 'unknown',
    method: req.method,
    url: req.originalUrl,
    startTime,
  };

  // Log request
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Request ID: ${requestId}`,
  );

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    console[logLevel](
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ` +
        `Status: ${res.statusCode} - Duration: ${duration}ms - Request ID: ${requestId}`,
    );

    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request detected: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });

  next();
}

/**
 * Error logging middleware
 */
export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  const requestId = res.locals.requestId || 'unknown';

  console.error(`[${new Date().toISOString()}] ERROR - Request ID: ${requestId}`, {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
    user: req.metadata?.userId,
  });

  next(err);
}
