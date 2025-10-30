/**
 * API Validation Utilities
 * Input validation using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { ErrorResponses } from './response.util';

/**
 * Validation middleware factory
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.reduce(
          (acc: Record<string, string>, err) => {
            const path = err.path.join('.');
            acc[path] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        );

        ErrorResponses.validationError(res, errors);
        return;
      }
      next(error);
    }
  };
}

/**
 * Validate request body only
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatZodErrors(error);
        ErrorResponses.validationError(res, errors);
        return;
      }
      next(error);
    }
  };
}

/**
 * Validate query parameters only
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatZodErrors(error);
        ErrorResponses.validationError(res, errors);
        return;
      }
      next(error);
    }
  };
}

/**
 * Format Zod errors for response
 */
function formatZodErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce(
    (acc: Record<string, string>, err) => {
      const path = err.path.join('.');
      acc[path] = err.message;
      return acc;
    },
    {} as Record<string, string>,
  );
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // Pagination query parameters
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),

  // UUID parameter
  uuidParam: z.object({
    id: z.string().uuid(),
  }),

  // Email validation
  email: z.string().email(),

  // JWT token in Authorization header
  authHeader: z.object({
    authorization: z.string().regex(/^Bearer .+$/, 'Invalid authorization header format'),
  }),

  // Date range
  dateRange: z
    .object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
      },
      { message: 'Start date must be before end date' },
    ),
};

/**
 * Create a sanitized string schema
 */
export function sanitizedString(options?: {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}) {
  let schema = z.string().trim();

  if (options?.minLength) {
    schema = schema.min(options.minLength);
  }
  if (options?.maxLength) {
    schema = schema.max(options.maxLength);
  }
  if (options?.pattern) {
    schema = schema.regex(options.pattern);
  }

  return schema;
}
