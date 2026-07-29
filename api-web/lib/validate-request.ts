import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { createErrorResponse, ErrorCodes } from './error-handler';

/**
 * Validation utility for API requests using Zod
 *
 * Official Docs: https://zod.dev
 *
 * Usage:
 * ```typescript
 * const result = await validateRequest(request, mySchema);
 * if (result.error) return result.error;
 * const validatedData = result.data;
 * ```
 */

export interface ValidationResult<T> {
  data?: T;
  error?: NextResponse;
}

/**
 * Validates request body against a Zod schema
 *
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate against schema
    const validatedData = schema.parse(body);

    return { data: validatedData };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      // Format Zod errors into user-friendly messages
      const errors =
        error.issues?.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })) || [];

      // In development, include detailed error information
      const isDevelopment = process.env.NODE_ENV === 'development';

      return {
        error: NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.VALIDATION_ERROR,
              message: 'Validation failed',
              ...(isDevelopment && { details: errors }),
            },
          },
          { status: 400 }
        ),
      };
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        error: createErrorResponse(ErrorCodes.INVALID_INPUT, 'Invalid JSON format', error, 400),
      };
    }

    // Handle other unexpected errors
    return {
      error: createErrorResponse(ErrorCodes.INVALID_INPUT, 'Invalid request body', error, 400),
    };
  }
}

/**
 * Validates URL parameters against a Zod schema
 *
 * @param params - URL parameters object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 */
export function validateParams<T>(params: unknown, schema: z.ZodSchema<T>): ValidationResult<T> {
  try {
    const validatedData = schema.parse(params);
    return { data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors =
        error.issues?.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })) || [];

      const isDevelopment = process.env.NODE_ENV === 'development';

      return {
        error: NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.VALIDATION_ERROR,
              message: 'Invalid parameters',
              ...(isDevelopment && { details: errors }),
            },
          },
          { status: 400 }
        ),
      };
    }

    return {
      error: createErrorResponse(ErrorCodes.INVALID_INPUT, 'Invalid parameters', error, 400),
    };
  }
}

/**
 * Validates query parameters against a Zod schema
 *
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    // Extract query parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const queryObject: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      queryObject[key] = value;
    });

    const validatedData = schema.parse(queryObject);
    return { data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors =
        error.issues?.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })) || [];

      const isDevelopment = process.env.NODE_ENV === 'development';

      return {
        error: NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.VALIDATION_ERROR,
              message: 'Invalid query parameters',
              ...(isDevelopment && { details: errors }),
            },
          },
          { status: 400 }
        ),
      };
    }

    return {
      error: createErrorResponse(ErrorCodes.INVALID_INPUT, 'Invalid query parameters', error, 400),
    };
  }
}
