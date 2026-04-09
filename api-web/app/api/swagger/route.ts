import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';

export const dynamic = 'force-dynamic';

const DOC_TAG_ORDER = [
  {
    name: 'Authentication',
    description:
      '**POST /api/auth/login** returns a JWT (`token`) for **Authorize** → BearerAuth. Same endpoint for web SPAs, mobile, and tools. Browser pages may use NextAuth cookies instead.',
  },
  { name: 'Categories', description: 'Product categories' },
  { name: 'Products', description: 'Catalog' },
  { name: 'Orders', description: 'Customer and staff orders' },
  { name: 'Admin', description: 'Admin-only management' },
  { name: 'Analytics', description: 'Sales analytics (admin)' },
] as const;

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'StoreFlow API',
        version: '1.0.0',
        description: 'Automatic API docs for StoreFlow Backend generated for Flutter app',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  });

  return NextResponse.json({
    ...spec,
    tags: [...DOC_TAG_ORDER],
  });
}
