import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Campaign } from './types';
import { campaigns } from '@src/database/schema/campaigns';

/**
 * Creates a new campaign in the database.
 * @param {NodePgDatabase} conn The Mongoose connection to use.
 * @param {Campaign} campaignData The new campaign details.
 * @return {Promise<any>} A promise that resolves to the created campaign.
 */
export function createCampaign(
  campaignData: Campaign,
  db: NodePgDatabase,
): Promise<any> {
  return db.insert(campaigns).values(campaignData);
}

/**
 * Finds a campaign by its ID.
 * @param {NodePgDatabase} conn The Mongoose connection to use.
 * @param {string} id The ID of the campaign to search for.
 * @return {Promise<any>} A promise that resolves to the found campaign or null if not found.
 */
export function findCampaignById(db: NodePgDatabase, id: string): Promise<any> {
  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, parseInt(id, 10)));
}
