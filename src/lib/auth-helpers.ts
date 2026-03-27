import { getDatabase } from './mock-db';
import type { User, AuthToken } from '@/domain/auth/types';

/**
 * Creates a base64-encoded JWT-like token for mock authentication.
 */
export function createToken(user: User): string {
  const payload: AuthToken = {
    userId: user.id,
    role: user.role,
    exp: Date.now() + 86400000, // 24 hours
  };
  return btoa(JSON.stringify(payload));
}

/**
 * Extracts and validates the user from the Authorization header.
 * Returns null if the token is missing, malformed, expired, or the user is not found.
 */
export function getUserFromRequest(request: Request): User | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = JSON.parse(atob(token)) as AuthToken;

    if (!decoded.userId || !decoded.role || !decoded.exp) {
      return null;
    }

    if (decoded.exp < Date.now()) {
      return null;
    }

    const db = getDatabase();
    const user = db.findUserById(decoded.userId);

    return user ?? null;
  } catch {
    return null;
  }
}
