import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from '@database/schema/users';
import { buyers } from '@database/schema/buyers';
import { sellers } from '@src/database/schema/sellers';

import { User } from './types';
import { DatabaseNotDefinedError } from './errors';

/**
 * Creates a new user in the database.
 *
 * @param {Connection} conn The Mongoose connection to use.
 * @param {Partial<IUser>} userData The new user details.
 * @return {Promise<IUser>} A promise that resolves to the created user.
 */
export async function createUser(
  userData: User,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<any> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  return db.insert(users).values(userData);
}

/**
 * Creates a new seller and corresponding user in the database.
 * @param userData - An object containing user data.
 * @param db - The database connection instance.
 * @returns The created seller record or an error message.
 */
export async function createSeller(
  userData: User,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<any> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    return await db.transaction(async (trx) => {
      const [newUser] = await trx
        .insert(users)
        .values(userData)
        .returning({ id: users.id });

      const [newSeller] = await trx
        .insert(sellers)
        .values({ userId: newUser.id })
        .returning({ id: sellers.id });

      return newSeller;
    });
  } catch (error) {
    console.error('Error creating seller within transaction:', error);
    throw new Error('Failed to create seller');
  }
}

/**
 * Creates a new buyer and corresponding user in the database.
 * @param userData - An object containing user data.
 * @param db - The database connection instance.
 * @returns The created buyer record or an error message.
 */
export async function createBuyer(
  userData: User,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<any> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    return await db.transaction(async (trx) => {
      const [newUser] = await trx
        .insert(users)
        .values(userData)
        .returning({ id: users.id });

      const [newBuyer] = await trx
        .insert(buyers)
        .values({ userId: newUser.id })
        .returning({ id: buyers.id });

      return newBuyer;
    });
  } catch (error) {
    console.error('Error creating buyer within transaction:', error);
    throw new Error('Failed to create buyer');
  }
}


