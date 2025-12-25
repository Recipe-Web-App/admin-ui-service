/**
 * Main API Router
 * Aggregates all API routes with /api/v1/admin-ui prefix
 */

import { Router } from 'express';
import configRoutes from './config';
import healthRoutes from './health';

const router = Router();

// Mount health check routes
router.use('/', configRoutes);
router.use('/', healthRoutes);

export default router;
