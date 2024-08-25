import { Request, Response } from 'express';

import logger from '@modules/logger';

export const healthCheck = async (_req: Request, res: Response) => {
  logger.info('Health check passed');
  return res.json({ status: 'ok' });
};
