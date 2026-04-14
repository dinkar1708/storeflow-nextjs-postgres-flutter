declare module 'bcryptjs';

declare module 'swagger-ui-react' {
  import type { ComponentType } from 'react';

  export interface SwaggerUIProps {
    url?: string;
    docExpansion?: string;
    filter?: boolean;
    persistAuthorization?: boolean;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}

declare module 'swagger-ui-react/swagger-ui.css';
declare module '*.css';
