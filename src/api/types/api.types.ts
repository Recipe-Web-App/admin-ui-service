/**
 * API Type Definitions for Admin UI Service
 * Centralized TypeScript interfaces and types for API endpoints
 */

// Base API Response Structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  timestamp: string;
  requestId?: string;
}

// API Error Structure
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

// Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  version: string;
  uptime: number;
  timestamp: string;
  checks: {
    database?: HealthCheckDetail;
    redis?: HealthCheckDetail;
    externalApi?: HealthCheckDetail;
  };
}

export interface HealthCheckDetail {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  message?: string;
  lastChecked: string;
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  authIssuer: string;
  authClientId: string;
  features: FeatureFlags;
  ui: UiConfig;
}

export interface FeatureFlags {
  enableAnalytics: boolean;
  enableRealTimeUpdates: boolean;
  enableOfflineMode: boolean;
  enableDarkMode: boolean;
  [key: string]: boolean;
}

export interface UiConfig {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  itemsPerPage: number;
}

// Authentication Types
export interface JWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<
    string,
    {
      roles?: string[];
    }
  >;
}

export interface AuthValidationRequest {
  token: string;
  requirePermissions?: string[];
}

export interface AuthValidationResponse {
  valid: boolean;
  user?: UserInfo;
  permissions?: string[];
  expiresAt?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  lastLogin?: string;
}

// Admin Operation Types
export interface VersionInfo {
  version: string;
  buildNumber: string;
  commitHash: string;
  buildDate: string;
  environment: string;
}

export interface BuildInfo {
  nodeVersion: string;
  angularVersion: string;
  dependencies: Record<string, string>;
  buildTime: number;
  buildEnv: Record<string, string>;
}

// Metrics Types
export interface Metrics {
  requests: {
    total: number;
    lastMinute: number;
    lastHour: number;
  };
  performance: {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  };
  errors: {
    total: number;
    lastHour: number;
    errorRate: number;
  };
  system: {
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    uptime: number;
  };
}

// Request/Response Middleware Types
export interface LoggingMetadata {
  requestId: string;
  userId?: string;
  userAgent?: string;
  ip: string;
  method: string;
  url: string;
  startTime: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: unknown) => string;
}

// Error Types
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'BAD_REQUEST'
  | 'CONFLICT';

// Environment Types
export interface ApiEnvironment {
  nodeEnv: string;
  port: number;
  logLevel: string;
  corsOrigins: string[];
  jwtSecret?: string;
  redisUrl?: string;
  databaseUrl?: string;
}
