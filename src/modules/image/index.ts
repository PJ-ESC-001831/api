import { Image } from './types';
import { createImage } from './repository';
import DbConnection from '@database/client';
import { labeledLogger } from '@modules/logger';

const logger = labeledLogger('module:image');
const database = new DbConnection().configure();

export async function createImageEntry(imageDate: Image) {
  logger.info(`Creating image on: `)
}
