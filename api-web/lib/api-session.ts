import { getServerSession } from 'next-auth';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { authOptions } from './auth';

/** Same secret as JWT login (POST /api/auth/login). */
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export type ApiUser = {
  id: string;
  email: string;
  role: string;
  name?: string | null;
};

/**
 * Web session (cookie) or `Authorization: Bearer <JWT>` from POST /api/auth/login.
 * Use in route handlers so Swagger "Authorize" works alongside browser login.
 */
export async function getApiUser(request: NextRequest): Promise<ApiUser | null> {
  const session = await getServerSession(authOptions);
  if (session?.user && (session.user as any).id) {
    return {
      id: (session.user as any).id as string,
      email: session.user.email ?? '',
      name: session.user.name,
      role: (session.user as any).role as string,
    };
  }

  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return null;
  }
  const token = auth.slice(7).trim();
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    const id = payload.id as string | undefined;
    const email = (payload.email as string | undefined) ?? '';
    const role = payload.role as string | undefined;
    if (!id || !role) {
      return null;
    }
    return { id, email, role };
  } catch {
    return null;
  }
}
