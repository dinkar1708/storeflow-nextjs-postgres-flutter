import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SWAGGER_REALM = 'StoreFlow API docs';

// CORS Configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ];

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin',
];

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
 * Optional HTTP Basic Auth for `/api-docs` and `/api/swagger` when both
 * `SWAGGER_DOCS_USERNAME` and `SWAGGER_DOCS_PASSWORD` are set.
 *
 * CORS configuration for API routes with configurable allowed origins.
 *
 * Development-only request logging for `/api/*` (does not read bodies).
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS' && pathname.startsWith('/api')) {
    const preflightResponse = new NextResponse(null, { status: 204 });
    return addCorsHeaders(preflightResponse, origin);
  }

  // Check Swagger authentication
  if (swaggerDocsAuthRequired(pathname) && !checkSwaggerBasicAuth(request)) {
    return unauthorizedSwaggerResponse();
  }

  // Development logging
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/api')) {
    console.log(`[API] ${request.method} ${pathname}${search}`);
  }

  // Continue with request and add CORS headers
  const response = NextResponse.next();
  return addCorsHeaders(response, origin);
}

export const config = {
  matcher: ['/api/:path*', '/api-docs'],
};
