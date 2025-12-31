/**
 * Configuration Routes
 * Client configuration and feature flags
 */

import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response.util';
import { AppConfig, FeatureFlags } from '../types/api.types';
import { optionalAuth } from '../middleware/auth.middleware';
import { getAuthConfig, getClientId } from '../../config/auth.config';

const router = Router();

/**
 * GET /api/v1/admin-ui/config
 * Get client configuration
 */
router.get('/config', optionalAuth, (req: Request, res: Response) => {
  const authConfig = getAuthConfig();

  const config: AppConfig = {
    apiUrl: Bun.env['API_URL'] || 'http://localhost:8080/api',
    authIssuer: authConfig.issuer,
    authClientId: getClientId(),
    features: {
      enableAnalytics: Bun.env['ENABLE_ANALYTICS'] === 'true',
      enableRealTimeUpdates: Bun.env['ENABLE_REAL_TIME_UPDATES'] === 'true',
      enableOfflineMode: Bun.env['ENABLE_OFFLINE_MODE'] === 'true',
      enableDarkMode: Bun.env['ENABLE_DARK_MODE'] === 'true',
    },
    ui: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      itemsPerPage: 20,
    },
  };

  // Override UI settings for authenticated users
  if (req.user) {
    // Could fetch user preferences from database here
    config.ui.theme = 'dark'; // Example: user preference
  }

  return sendSuccess(res, config, 'Configuration retrieved successfully');
});

/**
 * GET /api/v1/admin-ui/features
 * Get feature flags
 */
router.get('/features', (req: Request, res: Response) => {
  const features: FeatureFlags = {
    enableAnalytics: Bun.env['ENABLE_ANALYTICS'] === 'true',
    enableRealTimeUpdates: Bun.env['ENABLE_REAL_TIME_UPDATES'] === 'true',
    enableOfflineMode: Bun.env['ENABLE_OFFLINE_MODE'] === 'true',
    enableDarkMode: Bun.env['ENABLE_DARK_MODE'] === 'true',
    // Add more feature flags as needed
    enableBetaFeatures: Bun.env['NODE_ENV'] === 'development',
    enableDebugMode: Bun.env['NODE_ENV'] === 'development',
    enableMaintenanceMode: false,
  };

  return sendSuccess(res, features);
});

/**
 * GET /api/v1/admin-ui/environment
 * Get environment information
 */
router.get('/environment', (req: Request, res: Response) => {
  const envInfo = {
    environment: Bun.env['NODE_ENV'],
    version: Bun.version,
    runtime: 'bun',
    platform: process.platform,
    apiUrl: Bun.env['API_URL'],
    authIssuer: getAuthConfig().issuer,
  };

  return sendSuccess(res, envInfo);
});

export default router;
