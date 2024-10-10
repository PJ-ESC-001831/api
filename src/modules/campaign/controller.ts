import { NextFunction, Request, Response } from 'express';

import { labeledLogger } from '@modules/logger';
import { createCampaign as createNewCampaign, getCampaignById } from '.';

const logger = labeledLogger('module:campaign/controller');

/**
 * Retrieves campaign details based on the campaign ID provided in the request parameters.
 *
 * @param {Request} req The request object containing the campaign ID in the parameters.
 * @param {Response} res The response object used to send the response.
 * @param {NextFunction} _next The next middleware function in the stack (unused).
 * @return {Promise<Response>} A promise that resolves to void.
 */
export const campaignDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  logger.info(`Retrieving campaign details for id: ${req.params.id}`);

  try {
    const result = await getCampaignById(parseInt(req.params.id, 10));

    if (result === null) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    return res.json({ data: result });
  } catch (error) {
    logger.error(`Failed to retrieve campaign details: ${error}`);
    next(error);
  }
};

/**
 * Creates a new campaign.
 *
 * @param {Request} req The request object (unused).
 * @param {Response} res The response object used to send the response.
 * @param {NextFunction} next The next middleware function in the stack (unused).
 * @return {Promise<Response>} A promise that resolves to void.
 */
export const createCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { ...campaignData } = req.body;

  try {
    const [{ id }] = await createNewCampaign(campaignData);

    return res.status(200).json({
      data: {
        id,
      },
    });
  } catch (error) {
    logger.error(`Failed to create campaign: ${error}`);
    next(error);
  }
};
