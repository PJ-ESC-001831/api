import { User } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { createSeller } from './repository';
import { UserCreationError } from './errors';

const logger = labeledLogger('module:user');

const database = new DbConnection().configure();

/**
 * Creates a new seller user in the database.
 *
 * @param {User} userData - The user data for the new seller.
 * @returns {Promise<any>} The created seller record.
 * @throws {Error} If the seller creation fails.
 */
export const createSellerUser = async (userData: User): Promise<any> => {
  try {
    const db = (await database).getDb();
    const seller = await createSeller(userData, db);
    return seller;
  } catch (error) {
    logger.error('Failed to create seller user: ', error);
    throw new UserCreationError('Could not create seller user.');
  }
};
