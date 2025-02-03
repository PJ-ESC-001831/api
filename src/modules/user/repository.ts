import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from '@database/schema/users';
import { buyers } from '@database/schema/buyers';
import { admins } from '@database/schema/admins';
import { sellers } from '@src/database/schema/sellers';

import { UserWithToken } from './types';
import { DatabaseNotDefinedError } from './errors';

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
    console.error(`Error creating ${typeof schema} within transaction:`, error);
    throw new Error(`Failed to create ${typeof schema}`);
  }
}
