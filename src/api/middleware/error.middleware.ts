/**
 * Error Handling Middleware
 * Global error handler for API routes
 */

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorResponses } from '../utils/response.util';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error | ApiError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // If response was already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle known error types
  if (err instanceof ApiError) {
    return ErrorResponses.internalError(res, err.message);
  }

  if (err instanceof ZodError) {
    const errors = err.errors.reduce(
      (acc, error) => {
        const path = error.path.join('.');
        acc[path] = error.message;
        return acc;
      },
      {} as Record<string, string>,
    );

    return ErrorResponses.validationError(res, errors);
  }

  if (err.name === 'UnauthorizedError') {
    return ErrorResponses.unauthorized(res, err.message);
  }

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return ErrorResponses.badRequest(res, err.message);
  }

  // Handle rate limit errors
  if (err.name === 'TooManyRequestsError') {
    return ErrorResponses.rateLimitExceeded(res);
  }

  // Default error response
  const isDevelopment = process.env['NODE_ENV'] === 'development';
  const message = isDevelopment ? err.message : 'An unexpected error occurred';

  return ErrorResponses.internalError(res, message);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response) {
  return ErrorResponses.notFound(res, `Route ${req.method} ${req.originalUrl}`);
}

/**
 * Async error wrapper for route handlers
 */
export function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
}
