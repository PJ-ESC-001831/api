import { Request, Response } from 'express';

import logger from '@utils/logger';

export const healthCheck = async (req: Request, res: Response) => {
  logger.info('Health check passed');
  return res.json({ status: 'ok' });
};
