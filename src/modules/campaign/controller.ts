import { NextFunction, Request, Response } from 'express';

import { labeledLogger } from '@modules/logger';
import {
  createCampaign as createNewCampaign,
  getCampaignById,
  updateCampaign,
} from '.';

const logger = labeledLogger('module:campaign/controller');

/**
 * Retrieves campaign details based on the campaign ID provided in the request parameters.
 * 
 * @param {Request} req The request object containing the campaign ID in the parameters.
 * @param {Response} res The response object used to send the response.
 * @param {NextFunction} _next The next middleware function in the stack (unused).
 * @return {Promise<Response>} A promise that resolves to void.
 */
export const getCampaign = async (
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
export const postCampaign = async (
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

/**
 * Updates a campaign with the provided data.
 *
 * @param {Request} req The request object containing campaign ID and data.
 * @param {Response} res The response object for sending responses.
 * @param {NextFunction} next The next middleware function in the stack.
 * @return {Promise<Response | void>} A promise that resolves to a response object or void.
 */
export const patchCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const campaignId = req.params.id;
  const campaignData = req.body;

  try {
    const result = await updateCampaign(campaignId, campaignData);

    if (!result) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    return res.status(200).json({
      data: {
        id: result.id,
      },
    });
  } catch (error) {
    logger.error(`Failed to update campaign: ${error}`);
    next(error);
  }
};

/**
 * Attaches images to a campaign.
 */
export const postCampaignImages = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  logger.info('Attaching images to a campaign.');

  try {
    return res.status(200).json({ message: 'Images attached to campaign.' });
  } catch (error) {
    logger.error(`Failed to attach images to campaign: ${error}`);
    next(error);
  }
};
