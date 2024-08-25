// src/middleware/logger.ts
import { Request, Response, NextFunction } from 'express';
import {labeledLogger} from '@modules/logger';

const logger = labeledLogger('middleware');

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.info(`${req.method.toUpperCase()} ${req.url}`);
  next();
};

export default requestLogger;
