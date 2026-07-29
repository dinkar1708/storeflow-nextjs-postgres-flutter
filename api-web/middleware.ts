import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequestId, REQUEST_ID_HEADER } from './lib/request-id';

const SWAGGER_REALM = 'StoreFlow API docs';

// CORS Configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'];

function swaggerDocsAuthRequired(pathname: string): boolean {
  return pathname === '/api-docs' || pathname === '/api/swagger';
}

function checkSwaggerBasicAuth(request: NextRequest): boolean {
  const user = process.env.SWAGGER_DOCS_USERNAME;
  const pass = process.env.SWAGGER_DOCS_PASSWORD;
  if (!user || !pass) {
    return true;
  }

  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) {
    return false;
  }

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }

  const sep = decoded.indexOf(':');
  if (sep < 0) {
    return false;
  }

  const login = decoded.slice(0, sep);
  const password = decoded.slice(sep + 1);
  return login === user && password === pass;
}

function unauthorizedSwaggerResponse(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${SWAGGER_REALM}", charset="UTF-8"`,
    },
  });
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  // In development, allow all localhost origins
  if (process.env.NODE_ENV === 'development') {
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return true;
    }
  }

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Add CORS headers to response
 */
function addCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
    response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  }
  return response;
}

/**
 * CSRF Protection: Verify Origin/Referer for state-changing operations
 * For JWT-based APIs, checking Origin header is the primary CSRF defense
 */
function checkCSRF(request: NextRequest): boolean {
  const method = request.method;

  // Only check state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true;
  }

  // In development, be more lenient
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Check Origin header first (most reliable)
  if (origin) {
    return isOriginAllowed(origin);
  }

  // Fallback to Referer header
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      return isOriginAllowed(refererOrigin);
    } catch {
      return false;
    }
  }

  // No Origin or Referer header - reject in production
  return false;
}

/**
 * Optional HTTP Basic Auth for `/api-docs` and `/api/swagger` when both
 * `SWAGGER_DOCS_USERNAME` and `SWAGGER_DOCS_PASSWORD` are set.
 *
 * CORS configuration for API routes with configurable allowed origins.
 *
 * CSRF protection via Origin/Referer header verification for state-changing operations.
 *
 * Development-only request logging for `/api/*` (does not read bodies).
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Generate or extract request ID for tracing
  const requestId = getRequestId(request);

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS' && pathname.startsWith('/api')) {
    const preflightResponse = new NextResponse(null, { status: 204 });
    preflightResponse.headers.set(REQUEST_ID_HEADER, requestId);
    return addCorsHeaders(preflightResponse, origin);
  }

  // Check Swagger authentication
  if (swaggerDocsAuthRequired(pathname) && !checkSwaggerBasicAuth(request)) {
    return unauthorizedSwaggerResponse();
  }

  // CSRF Protection for API routes
  if (pathname.startsWith('/api') && !checkCSRF(request)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: {
          code: 'CSRF_VALIDATION_FAILED',
          message: 'Invalid origin for this request',
        },
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Development logging with request ID
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/api')) {
    console.log(`[${requestId}] ${request.method} ${pathname}${search}`);
  }

  // Continue with request and add CORS headers + request ID
  const response = NextResponse.next();
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return addCorsHeaders(response, origin);
}

export const config = {
  matcher: ['/api/:path*', '/api-docs'],
};
