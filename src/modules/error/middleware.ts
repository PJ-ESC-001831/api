// src/middleware/logger.ts
import { NextFunction, Request, Response } from 'express';
import { labeledLogger } from '@modules/logger';

const logger = labeledLogger('middleware');

const requestErrorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(`${error.stack}`);

  switch (error.message) {
    case 'Unauthenticated':
      return res.status(401).json({ error: 'Unauthenticated' });
    default:
      return res.status(400).json({ error: 'Something went wrong.' });
  }
};

export default requestErrorHandler;
