import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from '@database/schema/users';
import { buyers } from '@database/schema/buyers';
import { admins } from '@database/schema/admins';
import { sellers } from '@src/database/schema/sellers';

import { User, UserWithToken } from './types';
import {
  DatabaseNotDefinedError,
  UserQueryError,
  UserUpdateError,
} from './errors';
import logger from '../logger';
import { eq } from 'drizzle-orm';

/**
 * Creates a new user in the database.
 *
 * @param {Connection} conn The Mongoose connection to use.
 * @param {Partial<IUser>} userData The new user details.
 * @return {Promise<IUser>} A promise that resolves to the created user.
 */
export async function createUser(
  userData: UserWithToken,
  schema: typeof admins | typeof buyers | typeof sellers,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<{ id: number }> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    return await db.transaction(async (trx) => {
      const [newUser] = await trx
        .insert(users)
        .values(userData)
        .returning({ id: users.id });

      const [newSpecialisedUser] = await trx
        .insert(schema)
        .values({ userId: newUser.id })
        .returning({ id: sellers.id });

      return newSpecialisedUser;
    });
  } catch (error) {
    logger.error(`Error creating ${typeof schema} within transaction:`, error);
    throw new Error(`Failed to create ${typeof schema}`);
  }
}

// UNTESTED
export async function getUserByEmail(
  email: string,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<User | null> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    // Example: selecting the fields from users plus token IDs from buyers and sellers
    const [userRow] = await db
      .select({
        id: users.id,
        emailAddress: users.emailAddress,
        firstName: users.firstName,
        lastName: users.lastName,
        buyer_token_id: buyers.tokenId,
        seller_token_id: sellers.tokenId,
      })
      .from(users)
      // Left joins so that if there's no matching row in buyers/sellers, it won't exclude the user
      .leftJoin(buyers, eq(buyers.userId, users.id))
      .leftJoin(sellers, eq(sellers.userId, users.id))
      .where(eq(users.emailAddress, email))
      .limit(1); // If you only expect one row

    return userRow || null;
  } catch (error) {
    logger.error(`Error when finding a user for ${email}:`, error);
    throw new UserQueryError(
      'Something went wrong whilst finding a user by email.',
    );
  }
}

export async function updateUserToken(
  schema: typeof buyers | typeof sellers,
  userId: number,
  tokenId: string,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<{ id: number; tokenId: string | null } | null> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    // Example: selecting the fields from users plus token IDs from buyers and sellers
    const [updatedUser] = await db
      .update(schema)
      .set({ tokenId })
      .where(eq(schema.userId, userId))
      .returning({
        id: schema.id,
        tokenId: schema.tokenId,
      });

    return updatedUser || null;
  } catch (error) {
    logger.error(`Error when updating a user ${userId}:`, error);
    throw new UserUpdateError(`Something went wrong whilst updating a user.`);
  }
}
