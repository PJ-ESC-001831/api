// src/middleware/logger.ts
import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger';

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.info(`${req.method.toUpperCase()} ${req.url}`);
  next();
};

export default requestLogger;