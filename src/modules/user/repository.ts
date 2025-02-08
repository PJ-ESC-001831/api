import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from '@database/schema/users';
import { buyers } from '@database/schema/buyers';
import { admins } from '@database/schema/admins';
import { sellers } from '@src/database/schema/sellers';

import { User, UserWithToken } from './types';
import {
  DatabaseNotDefinedError,
  DuplicateEmailAddressError,
  UserCreationError,
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

export async function getSeller(
  id: number,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<Partial<User> | null> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    const [seller] = await db
      .select()
      .from(sellers)
      .leftJoin(users, eq(sellers.userId, users.id))
      .where(eq(sellers.id, id));

    return seller as Partial<User>;
  } catch (error) {
    if (!(error instanceof Error)) throw new UserQueryError();

    logger.error(error);

    throw new UserQueryError(error.message);
  }
}

export async function getBuyer(
  id: number,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<Partial<User> | null> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    const [buyer] = await db
      .select()
      .from(buyers)
      .leftJoin(users, eq(buyers.userId, users.id))
      .where(eq(buyers.id, id));

    return buyer as Partial<User>;
  } catch (error) {
    if (!(error instanceof Error)) throw new UserQueryError();

    logger.error(error);

    throw new UserQueryError(error.message);
  }
}

export async function getUser(
  id: number,
  db: NodePgDatabase<Record<string, never>> | undefined,
): Promise<(Partial<User> & { token?: string }) | null> {
  if (!db) {
    throw new DatabaseNotDefinedError();
  }

  try {
    const user = db.select().from(users).where(eq(users.id, id));

    return user as Partial<User>;
  } catch (error) {
    if (!(error instanceof Error)) throw new UserQueryError();

    logger.error(error);

    throw new UserQueryError(error.message);
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
    const [updatedUser] = await db
      .update(schema)
      .set({ tokenId })
      .where(eq(schema.id, id))
      .returning({
        id: schema.id,
        tokenId: schema.tokenId,
      });

    if (!updatedUser) {
      throw new UserUpdateError(
        'The token could not be assigned to an existing user.',
      );
    }

    return updatedUser || null;
  } catch (error) {
    logger.error(`Error when updating a user (${id}):`, error);
    throw new UserUpdateError(`Something went wrong whilst updating a user.`);
  }
}
