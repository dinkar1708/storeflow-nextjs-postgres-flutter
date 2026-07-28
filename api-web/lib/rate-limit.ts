import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
// For production, consider using Redis with @upstash/ratelimit

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  max: number;
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  /**
   * Message to return when rate limit is exceeded
   */
  message?: string;
}

/**
 * Rate limiting middleware
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @returns null if within limits, NextResponse with 429 if exceeded
 */
/**
 * Clear all rate limit data (useful for testing)
 */
export function clearRateLimitStore() {
  Object.keys(store).forEach(key => delete store[key]);
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  // Skip rate limiting in test environment or when disabled
  if (process.env.NODE_ENV === 'test' || process.env.DISABLE_RATE_LIMIT === 'true') {
    return null;
  }

  // Get client identifier (IP address or forwarded IP)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  // Create a key combining IP and pathname for per-endpoint rate limiting
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  // Initialize or get existing rate limit data
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return null;
  }

  // Increment counter
  store[key].count++;

  // Check if limit exceeded
  if (store[key].count > config.max) {
    const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: config.message || 'Too many requests, please try again later',
        retryAfter: `${retryAfter} seconds`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(store[key].resetTime).toISOString(),
        },
      }
    );
  }

  // Within limits - return null to continue
  return null;
}

/**
 * Preset configurations for common endpoints
 */
export const RateLimitPresets = {
  /**
   * Strict limits for authentication endpoints
   * 5 requests per 15 minutes
   */
  AUTH: {
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many authentication attempts, please try again in 15 minutes',
  },

  /**
   * Standard limits for general API endpoints
   * 100 requests per minute
   */
  API: {
    max: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests, please slow down',
  },

  /**
   * Relaxed limits for read-only endpoints
   * 200 requests per minute
   */
  READ: {
    max: 200,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests, please slow down',
  },

  /**
   * Moderate limits for write operations
   * 30 requests per minute
   */
  WRITE: {
    max: 30,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many write requests, please slow down',
  },
};
