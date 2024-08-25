// src/middleware/logger.ts
import { NextFunction, Request, Response } from 'express';
import logger from '@modules/logger';

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
      res.status(400).json({ error: 'Something went wrong.' });
  }
};

export default requestErrorHandler;
