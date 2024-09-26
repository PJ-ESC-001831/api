import { NextFunction, Request, Response } from 'express';

import { labeledLogger } from '@modules/logger';
import { createCampaign as createNewCampaign } from '.';

const logger = labeledLogger('module:campaign/controller');

/**
 * Retrieves campaign details based on the campaign ID provided in the request parameters.
 *
 * @param {Request} req The request object containing the campaign ID in the parameters.
 * @param {Response} res The response object used to send the response.
 * @param {NextFunction} _next The next middleware function in the stack (unused).
 * @return {Promise<void>} A promise that resolves to void.
 */
export const campaignDetails = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  logger.info(`Retrieving campaign details for id: ${req.params.id}`);
  res.json({ status: 'ok' });
};

/**
 * Creates a new campaign.
 *
 * @param {Request} req The request object (unused).
 * @param {Response} res The response object used to send the response.
 * @param {NextFunction} _next The next middleware function in the stack (unused).
 * @return {Promise<void>} A promise that resolves to void.
 */
export const createCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { ...campaignData } = req.body;

  try {
    const result = await createNewCampaign(campaignData);
    res.status(200).json({
      data: {
        campaign: result,
      },
    });
  } catch (error) {
    next(error);
  }
};
