import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from '@database/schema/users';
import { buyers } from '@database/schema/buyers';
import { admins } from '@database/schema/admins';
import { sellers } from '@src/database/schema/sellers';

import { UserWithToken } from './types';
import {
  DatabaseNotDefinedError,
  DuplicateEmailAddressError,
  UserCreationError,
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
    if (!(error instanceof Error)) {
      throw new UserCreationError(`Failed to create ${typeof schema}`);
    }

    if (
      error.message.includes('duplicate key value violates unique constraint')
    ) {
      throw new DuplicateEmailAddressError();
    }

    throw new Error(`Failed to create ${typeof schema}`);
  }
}

/**
 * Assigns a new TradeSafe Token to either a buyer or seller record.
 * @param schema
 * @param id of either the buyer or seller record
 * @param tokenId
 * @param db
 * @returns
 */
export async function updateUserToken(
  schema: typeof buyers | typeof sellers,
  id: number,
  tokenId: string,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<{ id: number; tokenId: string | null } | null> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    // Example: selecting the fields from users plus token IDs from buyers and sellers
    const updates = await db
      .update(schema)
      .set({ tokenId })
      .where(eq(schema.id, id))
      .returning({
        id: schema.id,
        tokenId: schema.tokenId,
      });

    if (updates.length === 0) {
      throw new UserUpdateError(
        'The token could not be assigned to an existing user.',
      );
    }

    return updates[0] || null;
  } catch (error) {
    logger.error(`Error when updating a user (${userId}):`, error);
    throw new UserUpdateError(`Something went wrong whilst updating a user.`);
  }
}
