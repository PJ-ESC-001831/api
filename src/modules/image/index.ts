import { Image } from './types';
import { createImage } from './repository';
import DbConnection from '@database/client';
import { labeledLogger } from '@modules/logger';
import { FailedToCreateImageEntryError } from './errors';

const logger = labeledLogger('module:image');
const database = new DbConnection().configure();

export async function createImageEntry(imageData: Image) {
  logger.info(`Creating ${imageData.key} in ${imageData.bucket}`);
  try {
    const db = (await database).getDb();
    const result = await createImage(db, imageData);
    return result;
  } catch (error) {
    logger.error(`Error creating image entry: ${(error as Error).message}`);
    throw new FailedToCreateImageEntryError();
  }
}
