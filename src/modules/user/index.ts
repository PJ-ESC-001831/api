import { User } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { createBuyer, createSeller, createUser } from './repository';
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

/**
 * Creates a new buyer user in the database.
 *
 * @param {User} userData - The user data for the new seller.
 * @returns {Promise<any>} The created seller record.
 * @throws {Error} If the seller creation fails.
 */
export const createBuyerUser = async (userData: User): Promise<any> => {
  try {
    const db = (await database).getDb();
    const seller = await createBuyer(userData, db);
    return seller;
  } catch (error) {
    logger.error('Failed to create seller user: ', error);
    throw new UserCreationError('Could not create seller user.');
  }
};

/**
 * Creates a new admin user in the database.
 *
 * @param {User} userData - The user data for the new admin.
 * @returns {Promise<any>} The created admin record.
 * @throws {Error} If the admin creation fails.
 */
export const createAdminUser = async (userData: User): Promise<any> => {
  try {
    const db = (await database).getDb();
    const admin = await createUser(userData, db);
    return admin;
  } catch (error) {
    logger.error('Failed to create seller user: ', error);
    throw new UserCreationError('Could not create seller user.');
  }
};
