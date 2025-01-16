import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Image } from './types';
import { images } from '@src/database/schema/images';
import UndefinedDatabaseClientError from '@src/lib/errors/UndefinedDatabaseClientError';
import { FailedToCreateImageEntryError } from './errors';

/**
 * Creates a new image in the database.
 *
 * @param {NodePgDatabase<Record<string, never>> | undefined} db The Drizzle connection to use.
 * @param {Image} imageDetails The new image details.
 * @return {Promise<Promise<{ id: number; }[]> | undefined>} A promise that resolves to the created image.
 */
export async function createImage(
  db: NodePgDatabase<Record<string, never>> | undefined,
  imageData: Image,
): Promise<{ id: number }> {
  if (!db) {
    throw new UndefinedDatabaseClientError();
  }

  const image = await db
    ?.insert(images)
    .values(imageData)
    .returning({ id: images.id })
    .execute();

  if (!image || !image.length) throw new FailedToCreateImageEntryError();

  return image[0];
}
