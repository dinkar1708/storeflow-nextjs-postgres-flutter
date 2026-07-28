import { NextRequest } from 'next/server';
import { handleJwtLogin } from '@/lib/jwt-login';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login (JWT)
 *     description: Email + password → JWT in `token` for any client. Use in Authorize (BearerAuth). Same users/passwords as NextAuth web login. Rate limited to 5 attempts per 15 minutes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Missing parameters
 *       429:
 *         description: Too many login attempts
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.AUTH);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return handleJwtLogin(request);
}
