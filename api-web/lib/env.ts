import { z } from 'zod';

/**
 * Environment Variable Validation
 *
 * Validates all required environment variables at startup.
 * Fails fast with clear error messages if configuration is invalid.
 *
 * Official Docs: https://zod.dev
 */

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL').min(1, 'DATABASE_URL is required'),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional: CORS Configuration
  ALLOWED_ORIGINS: z.string().optional(),

  // Optional: Swagger Documentation Auth
  SWAGGER_DOCS_USERNAME: z.string().optional(),
  SWAGGER_DOCS_PASSWORD: z.string().optional(),

  // Optional: Rate Limiting (future)
  DISABLE_RATE_LIMIT: z.string().transform(val => val === 'true').optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this at application startup
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:');
      console.error('');

      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });

      console.error('');
      console.error('Please check your .env file and ensure all required variables are set.');
      console.error('See .env.example for reference.');

      process.exit(1);
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Safe to use after validateEnv() has been called
 */
export function getEnv(): Env {
  return envSchema.parse(process.env);
}

// Auto-validate in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}
