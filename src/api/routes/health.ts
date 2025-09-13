/**
 * Health Check Routes for Kubernetes
 * Liveness and readiness probes
 */

import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

/**
 * GET /api/v1/admin-ui/health
 * Kubernetes liveness probe - checks if the application is running
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/admin-ui/ready
 * Kubernetes readiness probe - checks if the application is ready to serve traffic
 */
router.get('/ready', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    ready: true,
    timestamp: new Date().toISOString(),
  });
});

export default router;
