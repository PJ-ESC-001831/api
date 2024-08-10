// src/middleware/logger.ts
import { NextFunction, Request, Response } from 'express';
import logger from '@utils/logger';

const requestErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error(`${error.stack}`);

  switch (error.message) {
    case 'Unauthenticated':
      res.status(401).json({ error: 'Unauthenticated' });
      break;
    default:
      res.status(500).json({ error: 'Internal server error' });
  }
};

export default requestErrorHandler;
