import { User } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { createUser, updateUserToken } from './repository';
import {
  TokenNotAttachedError,
  UnknownUserTypeError,
  UserCreationError,
} from './errors';
import { admins } from '@src/database/schema/admins';
import { sellers } from '@src/database/schema/sellers';
import { buyers } from '@src/database/schema/buyers';
import GraphQLClient from '@src/lib/tradesafe/src/client';
import { createToken } from '@src/lib/tradesafe/src/tokens';
import { generatePublicId } from '@src/lib/utils/string';

const logger = labeledLogger('module:user');

const database = new DbConnection().configure();
let tradesafeClient: GraphQLClient = new GraphQLClient().config(
  process.env.TRADESAFE_CLIENT_ID as string,
  process.env.TRADESAFE_SECRET as string,
);

/**
 * Creates a new user record in the database and assigns a TradeSafe token if applicable.
 *
 * @param {User} userData - The user data for the new user.
 * @param {string} userType - The type of user ('admin', 'seller', 'buyer').
 * @returns {Promise<User>} The created user record with an attached TradeSafe token if applicable.
 * @throws {UserCreationError} If user creation fails.
 */
export const createUserRecord = async (
  userData: User,
  userType: string,
): Promise<Pick<User, 'id'> & { tokenId?: string }> => {
  try {
    const db = (await database).getDb();
    userData.publicId = generatePublicId();

    if (userType === 'admin') {
      return createUser(userData, admins, db);
    }

    const schema =
      userType === 'seller'
        ? sellers
        : userType === 'buyer'
          ? buyers
          : undefined;
    if (!schema) throw new UnknownUserTypeError();

    // Create user first, ensuring no duplicate email issues.
    const user = await createUser(userData, schema, db);

    // Generate TradeSafe token.
    const tokenId = await createTokenForUser(userData);
    if (!tokenId) throw new TokenNotAttachedError();

    // Attach TradeSafe token to user.
    const updatedUser = await updateUserToken(schema, user.id, tokenId, db);

    return { ...user, ...updatedUser } as Pick<User, 'id'> & { tokenId?: string };
  } catch (error) {
    logger.error('User creation failed:', error);
    throw new UserCreationError('Could not create user.');
  }
};

/**
 * Creates a TradeSafe token for a user.
 *
 * @param {User} userData - The user data required for token generation.
 * @returns {Promise<string | undefined>} The generated TradeSafe token ID, or undefined if creation fails.
 * @throws {UserCreationError} If token creation encounters a fatal error.
 */
export const createTokenForUser = async (
  userData: User,
): Promise<string | undefined> => {
  try {
    await tradesafeClient.authenticate();

    const token = await createToken(tradesafeClient, {
      user: {
        givenName: userData.firstName,
        familyName: userData.lastName,
        email: userData.emailAddress,
        mobile: userData.phoneNumber as string | undefined,
      },
    });

    if (!token?.id) {
      logger.warn(
        `Failed to generate TradeSafe token for ${userData.emailAddress}`,
      );
      return undefined;
    }

    return token.id;
  } catch (error) {
    logger.error('Fatal error creating TradeSafe token for user:', error);
    throw new UserCreationError('Could not create TradeSafe user.');
  }
};
