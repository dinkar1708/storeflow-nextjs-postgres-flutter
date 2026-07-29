/**
 * Application constants
 *
 * Centralizes magic numbers, strings, and configuration values
 */

// ============================================================================
// Security Constants
// ============================================================================

export const BCRYPT_ROUNDS = 12;

export const JWT_EXPIRATION = '7d'; // 7 days

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REGEX: {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /[0-9]/,
    SPECIAL: /[@$!%*?&#]/,
  },
} as const;

// ============================================================================
// Rate Limiting Constants
// ============================================================================

export const RATE_LIMITS = {
  AUTH: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  ORDERS: {
    MAX_REQUESTS: 30,
    WINDOW_MS: 60 * 1000, // 1 minute
  },
  GENERAL: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60 * 1000, // 1 minute
  },
} as const;

// ============================================================================
// Pagination Constants
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============================================================================
// Database Constants
// ============================================================================

export const MAX_STRING_LENGTH = {
  NAME: 100,
  EMAIL: 255,
  DESCRIPTION: 1000,
  NOTES: 500,
} as const;

// ============================================================================
// Order Status Constants
// ============================================================================

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// ============================================================================
// HTTP Status Codes (commonly used)
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ============================================================================
// Cache Duration Constants (in seconds)
// ============================================================================

export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

// ============================================================================
// CORS Constants
// ============================================================================

export const CORS_MAX_AGE = 86400; // 24 hours in seconds

export const ALLOWED_HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const;

export const ALLOWED_HTTP_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin',
] as const;
