import { Image } from './types';
import { createImage, retrieveImagesForCampaignId } from './repository';
import DbConnection from '@database/client';
import { labeledLogger } from '@modules/logger';
import {
  FailedToCreateImageEntryError,
  FailedToRetrieveImagesError,
} from './errors';
import { getSignedObjectURL } from '../minio';

const logger = labeledLogger('module:image');
const database = new DbConnection().configure();

/**
 * Creates a new image entry in the database.
 * @param imageData - The image data containing the key, bucket, and other metadata.
 * @returns A promise that resolves to the result of the database insertion.
 * @throws FailedToCreateImageEntryError - If the image entry creation fails.
 */
export async function createImageEntry(imageData: Image): Promise<any> {
  logger.info(
    `Creating image entry for key "${imageData.key}" in bucket "${imageData.bucket}".`,
  );

  try {
    const db = (await database).getDb();

    // Call the `createImage` function to insert the image data
    const result = await createImage(db, imageData);

    logger.info(`Successfully created image entry for key "${imageData.key}".`);
    return result;
  } catch (error) {
    logger.error(
      `Error creating image entry for key "${imageData.key}": ${(error as Error).message}`,
    );

    throw new FailedToCreateImageEntryError(
      `Failed to create image entry for key "${imageData.key}".`,
    );
  }
}

/**
 * Fetches the `uuid`, `key`, and `bucket` fields of images associated with a specific campaign ID.
 * @param campaignId - The ID of the campaign to retrieve images for.
 * @returns A promise resolving to an array of objects containing `uuid`, `key`, and `bucket` fields.
 * @throws FailedToRetrieveImagesError - If retrieving images fails.
 */
export async function fetchImagesForCampaign(
  campaignId: number,
): Promise<Pick<Image, 'uuid' | 'key' | 'bucket'>[]> {
  try {
    const db = (await database).getDb();

    const images = await retrieveImagesForCampaignId(db, campaignId);

    logger.info(
      `Successfully retrieved ${images.length} images for campaignId ${campaignId}.`,
    );

    return images;
  } catch (error) {
    logger.error(
      `Error fetching images for campaignId ${campaignId}: ${(error as Error).message}`,
    );

    throw new FailedToRetrieveImagesError(
      `Failed to fetch images for campaignId ${campaignId}.`,
    );
  }
}

