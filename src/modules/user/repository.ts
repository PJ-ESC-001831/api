import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users, sellers } from '@database/schema/users';
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

/**
 * Creates a new seller and corresponding user in the database.
 *
 * @param userData - An object containing user data.
 * @param db - The database connection instance.
 * @returns The created seller record or an error message.
 */
export async function createSeller(
  userData: User,
  db: NodePgDatabase,
): Promise<any> {
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

