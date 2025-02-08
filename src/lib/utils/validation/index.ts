import { labeledLogger } from '@src/modules/logger';
import { ZodError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ObjectsToValidate } from './enums';

const logger = labeledLogger('utils:validation');

/**
 * Middleware to validate the request body against the provided schema.
 *
 * @param {ZodSchema} schema The Zod schema to validate the request body.
 * @return {Function} Middleware function for Express.
 */
export const validateObject =
  (
    schema: ZodSchema,
    objectToValidate: ObjectsToValidate = ObjectsToValidate.BODY,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.debug(`Validating ${objectToValidate} against schema.`);

      let obj: object | undefined;
      switch (objectToValidate) {
        case ObjectsToValidate.PARAMS:
          obj = req.params;
          break;
        case ObjectsToValidate.QUERY:
          obj = req.query;
          break;
        case ObjectsToValidate.FILES:
          obj = req.files;
          break;
        case ObjectsToValidate.BODY:
        default:
          obj = req.body;
          break;
      }

      schema.parse(obj);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error('Validation failed:', error.errors);
        res.status(422).json({ error: error.errors });
      } else {
        logger.error('Unexpected error during validation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
