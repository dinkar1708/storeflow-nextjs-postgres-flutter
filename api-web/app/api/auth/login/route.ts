import { NextRequest } from 'next/server';
import { handleJwtLogin } from '@/lib/jwt-login';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login (JWT)
 *     description: Email + password → JWT in `token` for any client. Use in Authorize (BearerAuth). Same users/passwords as NextAuth web login.
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
 */
export async function POST(request: NextRequest) {
  return handleJwtLogin(request);
}
