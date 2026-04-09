'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
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
