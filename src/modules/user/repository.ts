import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from '@database/schema/users';
import { buyers } from '@database/schema/buyers';
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

  return db?.insert(users).values(userData);
}

/**
 * Creates a new seller and corresponding user in the database.
 *
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
    // Insert the user and retrieve the generated ID
    const [newUser] = await db
      .insert(users)
      .values(userData)
      .returning({ id: users.id });

    // Insert the seller using the retrieved user ID
    const [newSeller] = await db
      .insert(sellers)
      .values({ userId: newUser.id })
      .returning({ id: sellers.id });

    // Return the created seller record
    return newSeller;
  } catch (error) {
    console.error('Error creating seller:', error);
    throw new Error('Failed to create seller');
  }
}

/**
 * Creates a new buyer and corresponding user in the database.
 *
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
    // Insert the user and retrieve the generated ID
    const [newUser] = await db
      .insert(users)
      .values(userData)
      .returning({ id: users.id });

    // Insert the buyer using the retrieved user ID
    const [newBuyer] = await db
      .insert(buyers)
      .values({ userId: newUser.id })
      .returning({ id: buyers.id });

    // Return the created buyer record
    return newBuyer;
  } catch (error) {
    console.error('Error creating buyer:', error);
    throw new Error('Failed to create buyer');
  }
}

