/**
 * Backend Service Configuration
 *
 * Defines the URLs and endpoints for backend services.
 * These are build-time configurations that don't change per environment.
 */

export interface ServiceEndpoints {
  recipes: string;
  users: string;
  mealPlans: string;
  health: string;
}

/**
 * Service configuration for different environments
 */
export const serviceConfig: Record<string, ServiceEndpoints> = {
  development: {
    recipes: '/api/v1/recipes',
    users: '/api/v1/users',
    mealPlans: '/api/v1/meal-plans',
    health: '/api/v1/health',
  },

  staging: {
    recipes: '/api/v1/recipes',
    users: '/api/v1/users',
    mealPlans: '/api/v1/meal-plans',
    health: '/api/v1/health',
  },

  production: {
    recipes: '/api/v1/recipes',
    users: '/api/v1/users',
    mealPlans: '/api/v1/meal-plans',
    health: '/api/v1/health',
  },
};

/**
 * Get service endpoints for current environment
 */
export function getServiceEndpoints(): ServiceEndpoints {
  const env = process.env['NODE_ENV'] || 'development';
  return serviceConfig[env] || serviceConfig['development'];
}

/**
 * Build full URL for a service endpoint
 */
export function buildServiceUrl(endpoint: string): string {
  const baseUrl = process.env['API_URL'] || 'http://localhost:8080';
  return `${baseUrl}${endpoint}`;
}
