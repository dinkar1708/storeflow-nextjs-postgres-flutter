import { NextRequest } from 'next/server';

/**
 * Request ID utilities for distributed tracing
 *
 * Generates and extracts request IDs for tracking requests through logs
 * Compatible with Edge runtime (no Node.js crypto module)
 */

export const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Generate a UUID v4 compatible with Edge runtime
 * Uses crypto.randomUUID() which is available in Edge
 */
function generateUUID(): string {
  // Use Web Crypto API (available in Edge runtime)
  return crypto.randomUUID();
}

/**
 * Get request ID from headers or generate a new one
 */
export function getRequestId(request: NextRequest): string {
  const existingId = request.headers.get(REQUEST_ID_HEADER);
  return existingId || generateUUID();
}

/**
 * Generate a new request ID
 */
export function generateRequestId(): string {
  return generateUUID();
}
