import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from '@database/schema/users';
import { User } from './types';

/**
 * Creates a new user in the database.
 *
 * @param {Connection} conn The Mongoose connection to use.
 * @param {Partial<IUser>} userData The new user details.
 * @return {Promise<IUser>} A promise that resolves to the created user.
 */
export async function createUser(
  userData: User,
  db: NodePgDatabase,
): Promise<any> {
  return db.insert(users).values(userData);
}
