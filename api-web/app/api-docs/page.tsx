'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  // Disable API docs in production
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600">API documentation is disabled in production</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SwaggerUI
        url="/api/swagger"
        docExpansion="list"
        filter={true}
        persistAuthorization={true}
      />
    </div>
  );
}
