import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Campaign, CampaignWithSeller } from './types';
import { campaigns } from '@src/database/schema/campaigns';
import { sellers } from '@src/database/schema/sellers';
import { users } from '@src/database/schema/users';
import { Seller } from '../user/types';
import { User } from '@clerk/clerk-sdk-node';

/**
 * Creates a new campaign in the database.
 *
 * @param {NodePgDatabase<Record<string, never>> | undefined} db The Mongoose connection to use.
 * @param {Campaign} campaignData The new campaign details.
 * @return {Promise<Promise<{ id: number; }[]> | undefined>} A promise that resolves to the created campaign.
 */
export async function createCampaign(
  db: NodePgDatabase<Record<string, never>> | undefined,
  campaignData: Campaign,
): Promise<{ id: number }[]> {
  if (!db) {
    return [];
  }

  return db
    ?.insert(campaigns)
    .values(campaignData)
    .returning({ id: campaigns.id })
    .execute();
}

/**
 * Finds a campaign by its ID.
 *
 * @param {NodePgDatabase<Record<string, never>> | undefined} db The Mongoose connection to use.
 * @param {string} id The ID of the campaign to search for.
 * @return {Promise<any>} A promise that resolves to the found campaign or null if not found.
 */
export async function findCampaignById(
  db: NodePgDatabase<Record<string, never>> | undefined,
  id: string,
): Promise<any | undefined> {
  if (!db) {
    return Promise.resolve();
  }

  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, parseInt(id, 10)));
}

export async function getCampaignWithSeller(
  id: number,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<{
  campaigns: Campaign;
  sellers?: Seller;
  users?: User;
} | null> {
  if (!db) {
    return null;
  }

  const [response] = await db
    .select()
    .from(campaigns)
    .leftJoin(sellers, eq(campaigns.sellerId, sellers.id))
    .leftJoin(users, eq(sellers.userId, users.id))
    .where(eq(campaigns.id, id));

  return response as unknown as CampaignWithSeller;
}

/**
 * Updates a campaign with the given fields.
 * 
 * @param {NodePgDatabase<Record<string, never>> | undefined} db The Mongoose connection to use.
 * @param {string} campaignId The ID of the campaign to update
 * @param {Partial<Campaign>} updates The fields to update
 * @return {Promise<Campaign | null>} The updated campaign or null if not found
 */
export async function updateCampaign(
  db: NodePgDatabase<Record<string, never>> | undefined,
  campaignId: string,
  updates: Partial<Campaign>,
): Promise<any | null> {
  try {
    // Filter out undefined values from updates
    const updateFields = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No valid fields provided for update');
    }

    // Perform the update
    const updatedCampaign = await db
      ?.update(campaigns)
      .set(updateFields)
      .where(eq(campaigns.id, parseInt(campaignId, 10)))
      .returning();

    return updatedCampaign || null;
  } catch (error) {
    throw new Error(`Failed to update campaign: ${(error as Error).message}`);
  }
}
