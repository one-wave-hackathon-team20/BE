import jwt from 'jsonwebtoken';

const JWT_SECRET = 'EnfDdXstCxZd6UcvqUL5KKuPDyM/BYk9mnhnUjrfmf+yOrNoQMFc7a6TtLXCz3jKB4rK8lR2st2ETbkEM8GLUQ==';
const JWT_REFRESH_SECRET = 'EnfDdXstCxZd6UcvqUL5KKuPDyM/BYk9mnhnUjrfmf+yOrNoQMFc7a6TtLXCz3jKB4rK8lR2st2ETbkEM8GLUQ==';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}
