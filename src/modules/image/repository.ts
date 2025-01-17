import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Image } from './types';
import { images } from '@src/database/schema/images';
import UndefinedDatabaseClientError from '@src/lib/errors/UndefinedDatabaseClientError';
import {
  FailedToCreateImageEntryError,
  FailedToRetrieveImagesError,
} from './errors';
import { eq } from 'drizzle-orm';
import { labeledLogger } from '../logger';

const logger = labeledLogger('module:image/repository');

/**
 * Creates a new image in the database.
 * @param {NodePgDatabase<Record<string, never>> | undefined} db The Drizzle connection to use.
 * @param {Image} imageDetails The new image details.
 * @return {Promise<Promise<{ id: number; }[]> | undefined>} A promise that resolves to the created image.
 */
export async function createImage(
  db: NodePgDatabase<Record<string, never>> | undefined,
  imageData: Image,
): Promise<Pick<Image, 'id'>> {
  if (!db) {
    throw new UndefinedDatabaseClientError();
  }

  const image = await db
    .insert(images)
    .values(imageData)
    .onConflictDoUpdate({
      target: images.uuid,
      set: imageData,
    })
    .returning({ id: images.id })
    .execute();

  if (!image || !image.length) throw new FailedToCreateImageEntryError();

  return image[0];
}

/**
 * Retrieves the `uuid`, `key`, and `bucket` fields of images associated with a specific campaign ID.
 * @param db - The Drizzle database client instance.
 * @param campaignId - The ID of the campaign to retrieve images for.
 * @returns A promise resolving to an array of objects containing `uuid`, `key`, and `bucket` fields.
 * @throws UndefinedDatabaseClientError If the database client is undefined.
 * @throws FailedToRetrieveImagesError Throws error if something went wrong whilst trying to query images for campaign id.
 */
export async function retrieveImagesForCampaignId(
  db: NodePgDatabase<Record<string, never>> | undefined,
  campaignId: number,
): Promise<Pick<Image, 'uuid' | 'key' | 'bucket'>[]> {
  if (!db) {
    throw new UndefinedDatabaseClientError('Database client is undefined.');
  }

  try {
    return await db
      .select({
        uuid: images.uuid,
        key: images.key,
        bucket: images.bucket,
      })
      .from(images)
      .where(eq(images.campaignId, campaignId))
      .execute();
  } catch (error) {
    logger.error(
      `Error retrieving images for campaign ID ${campaignId}:`,
      error,
    );
    throw new FailedToRetrieveImagesError(
      `Failed to retrieve images for campaign ID ${campaignId}.`,
    );
  }
}
