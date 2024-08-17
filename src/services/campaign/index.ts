import { Connection } from 'mongoose';
import { createModel, ICampaign } from '../../models/campaign';

/**
 * Creates a new campaign in the database.
 * @param {Connection} conn The Mongoose connection to use.
 * @param {Partial<ICampaign>} campaignData The new campaign details.
 * @return {Promise<ICampaign>} A promise that resolves to the created campaign.
 */
export async function createCampaign(
  conn: Connection,
  campaignData: Partial<ICampaign>,
): Promise<ICampaign> {
  const Campaign = createModel(conn);
  const campaign = new Campaign(campaignData);
  await campaign.save();
  return campaign;
}

/**
 * Finds a campaign by its ID.
 * @param {Connection} conn The Mongoose connection to use.
 * @param {string} id The ID of the campaign to search for.
 * @return {Promise<ICampaign | null>} A promise that resolves to the found campaign or null if not found.
 */
export async function findCampaignById(
  conn: Connection,
  id: string,
): Promise<ICampaign | null> {
  const Campaign = createModel(conn);
  return Campaign.findById(id);
}
