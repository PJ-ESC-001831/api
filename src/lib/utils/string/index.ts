import crypto from 'crypto';

/**
 * Generates a secure, URL-safe, 22-character public ID.
 */
export function generatePublicId(): string {
  return crypto.randomBytes(16).toString('base64url');
}
