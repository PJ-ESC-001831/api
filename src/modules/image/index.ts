import { Image } from './types';
import { createImage } from './repository';
import DbConnection from '@database/client';
import { labeledLogger } from '@modules/logger';
import { FailedToCreateImageEntryError } from './errors';

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

