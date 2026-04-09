import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SWAGGER_REALM = 'StoreFlow API docs';

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
 * Optional HTTP Basic Auth for `/api-docs` and `/api/swagger` when both
 * `SWAGGER_DOCS_USERNAME` and `SWAGGER_DOCS_PASSWORD` are set.
 *
 * Development-only request logging for `/api/*` (does not read bodies).
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (swaggerDocsAuthRequired(pathname) && !checkSwaggerBasicAuth(request)) {
    return unauthorizedSwaggerResponse();
  }

  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/api')) {
    console.log(`[API] ${request.method} ${pathname}${search}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/api-docs'],
};
