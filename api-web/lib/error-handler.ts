import { NextResponse } from 'next/server';

/**
 * Error codes for standardized API error responses
 */
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

/**
 * Creates a standardized error response
 * In production: only generic messages and error codes
 * In development: includes detailed error information
 */
export function createErrorResponse(
  code: ErrorCode,
  userMessage: string,
  error?: unknown,
  statusCode: number = 500
): NextResponse<ErrorResponse> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log detailed error server-side
  if (error) {
    console.error(`[${code}]`, error);
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code,
      message: userMessage,
    },
  };

  // Only include detailed error info in development
  if (isDevelopment && error) {
    if (error instanceof Error) {
      errorResponse.error.details = {
        message: error.message,
        stack: error.stack,
      };
    } else {
      errorResponse.error.details = error;
    }
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Handles common Prisma errors and returns appropriate error responses
 */
export function handlePrismaError(error: unknown): NextResponse<ErrorResponse> {
  // Check for Prisma-specific errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const prismaError = error as { code: string; meta?: any };

    switch (prismaError.code) {
      case 'P2002': // Unique constraint violation
        return createErrorResponse(
          ErrorCodes.DUPLICATE_ENTRY,
          'A record with this information already exists',
          error,
          409
        );

      case 'P2025': // Record not found
        return createErrorResponse(
          ErrorCodes.NOT_FOUND,
          'The requested resource was not found',
          error,
          404
        );

      case 'P2003': // Foreign key constraint violation
        return createErrorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Invalid reference to related resource',
          error,
          400
        );

      default:
        return createErrorResponse(
          ErrorCodes.DATABASE_ERROR,
          'A database error occurred',
          error,
          500
        );
    }
  }

  // Generic database error
  return createErrorResponse(
    ErrorCodes.DATABASE_ERROR,
    'A database error occurred',
    error,
    500
  );
}

/**
 * Generic error handler for API routes
 * Automatically determines appropriate response based on error type
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // Check if it's a Prisma error
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return handlePrismaError(error);
  }

  // Check for specific error types
  if (error instanceof Error) {
    // Check error message for common patterns
    if (error.message.includes('Insufficient stock')) {
      return createErrorResponse(
        ErrorCodes.INSUFFICIENT_STOCK,
        error.message,
        error,
        409
      );
    }

    if (error.message.includes('not found')) {
      return createErrorResponse(
        ErrorCodes.NOT_FOUND,
        'The requested resource was not found',
        error,
        404
      );
    }

    if (error.message.includes('already exists')) {
      return createErrorResponse(
        ErrorCodes.DUPLICATE_ENTRY,
        'A record with this information already exists',
        error,
        409
      );
    }
  }

  // Default to internal error
  return createErrorResponse(
    ErrorCodes.INTERNAL_ERROR,
    'An unexpected error occurred. Please try again later.',
    error,
    500
  );
}
