import { NextFunction, Request, Response } from 'express';

import logger from '@utils/logger';

export const campaignDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(`Retrieving campaign details for id: ${req.params.id}`);
  return res.json({ status: 'ok' });
};
