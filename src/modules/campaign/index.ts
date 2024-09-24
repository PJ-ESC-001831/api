import { NextFunction, Request, Response } from 'express';

import logger from '@modules/logger';

export const campaignDetails = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.info(`Retrieving campaign details for id: ${req.params.id}`);
  return res.json({ status: 'ok' });
};

export const createCampaign = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.info('Creating campaign.');
  return res.json({ status: 'ok' });
};
