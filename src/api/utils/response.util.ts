/**
 * API Response Utilities
 * Standardized response formatting and error handling
 */

import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ApiError, ApiErrorCode, ApiResponse } from '../types/api.types';

// Extend Express Response locals for TypeScript
declare module 'express-serve-static-core' {
  interface Locals {
    requestId?: string;
  }
}

/**
 * Send a successful response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = StatusCodes.OK,
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId,
  };

  return res.status(statusCode).json(response);
}

/**
 * Send an error response
 */
export function sendError(
  res: Response,
  code: ApiErrorCode,
  message: string,
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  details?: Record<string, unknown>,
): Response {
  const error: ApiError = {
    code,
    message,
    details,
    stack: process.env['NODE_ENV'] === 'development' ? new Error().stack : undefined,
  };

  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId,
  };

  return res.status(statusCode).json(response);
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  badRequest: (res: Response, message: string, details?: Record<string, unknown>) =>
    sendError(res, 'BAD_REQUEST', message, StatusCodes.BAD_REQUEST, details),

  unauthorized: (res: Response, message: string = ReasonPhrases.UNAUTHORIZED) =>
    sendError(res, 'AUTHENTICATION_ERROR', message, StatusCodes.UNAUTHORIZED),

  forbidden: (res: Response, message: string = ReasonPhrases.FORBIDDEN) =>
    sendError(res, 'AUTHORIZATION_ERROR', message, StatusCodes.FORBIDDEN),

  notFound: (res: Response, resource = 'Resource') =>
    sendError(res, 'NOT_FOUND', `${resource} not found`, StatusCodes.NOT_FOUND),

  validationError: (res: Response, errors: Record<string, unknown>) =>
    sendError(
      res,
      'VALIDATION_ERROR',
      'Validation failed',
      StatusCodes.UNPROCESSABLE_ENTITY,
      errors,
    ),

  rateLimitExceeded: (res: Response) =>
    sendError(
      res,
      'RATE_LIMIT_EXCEEDED',
      ReasonPhrases.TOO_MANY_REQUESTS,
      StatusCodes.TOO_MANY_REQUESTS,
    ),

  internalError: (res: Response, message: string = ReasonPhrases.INTERNAL_SERVER_ERROR) =>
    sendError(res, 'INTERNAL_SERVER_ERROR', message, StatusCodes.INTERNAL_SERVER_ERROR),

  serviceUnavailable: (res: Response, message: string = ReasonPhrases.SERVICE_UNAVAILABLE) =>
    sendError(res, 'SERVICE_UNAVAILABLE', message, StatusCodes.SERVICE_UNAVAILABLE),
};

/**
 * Wrap async route handlers to catch errors
 */
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Format pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function createPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
