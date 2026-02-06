import { NextRequest } from 'next/server';
import { verifyAccessToken } from '../auth/jwt';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userEmail?: string;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string; userEmail: string } | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = verifyAccessToken(token);
    return {
      userId: payload.userId,
      userEmail: payload.email,
    };
  } catch (error) {
    return null;
  }
}
