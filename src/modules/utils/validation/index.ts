import { labeledLogger } from '@src/modules/logger';
import { ZodError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

const logger = labeledLogger('module:utils/validation');

/**
 * Middleware to validate the request body against the provided schema.
 *
 * @param {ZodSchema} schema The Zod schema to validate the request body.
 * @return {Function} Middleware function for Express.
 */
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error('Validation failed:', error.errors);
        res.status(400).json({ error: error.errors });
      } else {
        logger.error('Unexpected error during validation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
