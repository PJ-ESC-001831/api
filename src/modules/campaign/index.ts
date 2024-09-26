import { Campaign } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { campaigns } from '@src/database/schema/campaigns';
import { eq } from 'drizzle-orm';

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
  const db = (await database).getDb();
  const response = await db
    .insert(campaigns)
    .values(campaignData)
    .returning({ id: campaigns.id });
  return response;
}

/**
 * Retrieves a campaign by its ID.
 *
 * @param {number} id The ID of the campaign to retrieve.
 * @return {Promise<any>} The campaign data.
 */
export async function getCampaignById(id: number): Promise<any> {
  logger.info(`Retrieving campaign with id ${id}.`);
  const db = (await database).getDb();
  return db.select(campaigns).where(eq(campaigns.id, id));
}
