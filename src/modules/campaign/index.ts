import { Campaign } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { campaigns } from '@src/database/schema/campaigns';
import { eq } from 'drizzle-orm';
import {
  CampaignNotFoundError,
  FailedToCreateCampaignError,
  FailedToUpdateCampaignError,
} from './errors';
import * as campaignRepository from './repository';
import { adjustCostBase } from './utils';

const logger = labeledLogger('module:campaign');
const database = new DbConnection().configure();

/**
 * Creates a new campaign in the database.
 * @param {Campaign} campaignData The data of the campaign to create.
 * @return {Promise<any>} A promise that resolves when the campaign is created.
 */
export async function createCampaign(campaignData: Campaign): Promise<any> {
  logger.info('Creating campaign.');

  try {
    const db = (await database).getDb();

    const adjustedCampaignData = adjustCostBase(campaignData);

    // Insert the campaign and return the newly created campaign ID
    const response = campaignRepository.createCampaign(
      db,
      adjustedCampaignData as Campaign,
    );

    if (!response || response.length === 0) {
      logger.error('Failed to create campaign.');
      throw new Error('Failed to create campaign.');
    }

    logger.info(`Campaign created with ID: ${response[0]?.id}`);
    return response;
  } catch (error) {
    logger.error(`Error creating campaign: ${(error as Error).message}`);
    throw new FailedToCreateCampaignError();
  }
}

/**
 * Retrieves a campaign by its ID.
 *
 * @param {number} id The ID of the campaign to retrieve.
 * @return {Promise<any>} The campaign data.
 */
export async function getCampaignById(id: number): Promise<any> {
  logger.info(`Retrieving campaign with id ${id}.`);

  try {
    const db = (await database).getDb();

    // Perform the query and limit the results to one
    const entry = await db
      ?.select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1)
      .execute();

    // Check if entry is undefined or empty
    if (!entry || entry.length === 0) {
      logger.warn(`Campaign with id ${id} not found.`);
      return null;
    }

    const adjustedEntry = adjustCostBase(entry[0], true);

    return adjustedEntry; // Return the first campaign object
  } catch (error) {
    logger.error(
      `Error retrieving campaign with id ${id}: ${(error as Error).message}`,
    );
    throw new CampaignNotFoundError();
  }
}

/**
 * Updates a campaign in the database.
 *
 * @param {string} campaignId The ID of the campaign to update.
 * @param {Partial<Campaign>} updates The fields to update.
 * @return {Promise<Campaign | null>} The updated campaign or null if not found.
 */
export async function updateCampaign(
  campaignId: string,
  updates: Partial<Campaign>,
): Promise<Campaign | null> {
  logger.info(`Updating campaign with ID: ${campaignId}.`);

  try {
    const db = (await database).getDb();
    const adjustedUpdates = adjustCostBase(updates);

    const updatedCampaign = await campaignRepository.updateCampaign(
      db,
      campaignId,
      adjustedUpdates as Campaign,
    );

    if (!updatedCampaign) {
      logger.warn(`Campaign with id ${campaignId} not found.`);
      throw new CampaignNotFoundError();
    }

    logger.info(`Campaign with ID: ${campaignId} updated successfully.`);
    return updatedCampaign;
  } catch (error) {
    logger.error(
      `Error updating campaign with ID: ${campaignId}: ${(error as Error).message}`,
    );
    throw new FailedToUpdateCampaignError(
      `Failed to update campaign: ${(error as Error).message}`,
    );
  }
}
