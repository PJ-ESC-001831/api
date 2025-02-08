import { labeledLogger } from '@src/modules/logger';
import crypto from 'crypto';

const logger = labeledLogger('utils:string');

/**
 * Generates a secure, URL-safe, 16-character public ID.
 * @returns {string}
 */
export function generatePublicId(): string {
  const randomHex = crypto.randomBytes(8).toString('hex');

  logger.info(`Generated the a publicId of ${randomHex}`);

  return randomHex;
}
