import { User } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { createUser } from './repository';
import { UnknownUserTypeError, UserCreationError } from './errors';
import { admins } from '@src/database/schema/admins';
import { sellers } from '@src/database/schema/sellers';
import { buyers } from '@src/database/schema/buyers';
import { createToken } from '@src/lib/tradesafe/src/tokens';

const logger = labeledLogger('module:user');

const database = new DbConnection().configure();

/**
 * Creates a new user in the database.
 *
 * @param {User} userData - The user data for the new user.
 * @returns {Promise<any>} The created user record.
 * @throws {Error} If the user creation fails.
 */
export const createUserRecord = async (
  userData: User,
  userType: string,
): Promise<any> => {
  try {
    const token = createToken
    const db = (await database).getDb();
    let user;
    if (userType === 'admin') user = await createUser(userData, admins, db);
    else if (userType === 'seller')
      user = await createUser(userData, sellers, db);
    else if (userType === 'buyer')
      user = await createUser(userData, buyers, db);

    if (!user) throw new UnknownUserTypeError();

    return user;
  } catch (error) {
    logger.error('Failed to create seller user: ', error);
    throw new UserCreationError('Could not create user.');
  }
};