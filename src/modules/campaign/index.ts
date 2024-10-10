import { Campaign } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { campaigns } from '@src/database/schema/campaigns';
import { eq } from 'drizzle-orm';
import { CampaignNotFoundError, FailedToCreateCampaignError } from './errors';

const logger = labeledLogger('module:campaign');
const database = new DbConnection().configure();

/**
 * Creates a new campaign in the database.
 *
 * @param {Campaign} campaignData The data of the campaign to create.
 * @return {Promise<any>} A promise that resolves when the campaign is created.
 */
export async function createCampaign(campaignData: Campaign): Promise<any> {
  logger.info('Creating campaign.');

  // Validate campaign data
  if (!campaignData || !campaignData.title || !campaignData.description) {
    logger.error('Invalid campaign data provided.');
    throw new Error('Campaign data must include title and description.');
  }

  try {
    const db = (await database).getDb();

    // Insert the campaign and return the newly created campaign ID
    const response = await db
      ?.insert(campaigns)
      .values(campaignData)
      .returning({ id: campaigns.id })
      .execute();

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

    return entry[0]; // Return the first campaign object
  } catch (error) {
    logger.error(
      `Error retrieving campaign with id ${id}: ${(error as Error).message}`,
    );
    throw new CampaignNotFoundError();
  }
}

