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
let tradesafeClient: GraphQLClient;

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
    const db = (await database).getDb();

    userData.publicId = generatePublicId();

    if (userType === 'admin') {
      return createUser(userData, admins, db);
    }

    let schema: typeof sellers | typeof buyers | undefined = undefined;
    if (userType === 'seller') schema = sellers;
    else if (userType === 'buyer') schema = buyers;

    if (!schema) throw new UnknownUserTypeError();

    /*
     * Can't do these in parallel because we need createUser to stop the createTokenForUser
     * function if it detects a duplicate emailAddress.
     */
    const user = await createUser(userData, schema, db);
    const tokenId = await createTokenForUser(userData);

    // Check whether the token was created.
    if (!tokenId) throw new TokenNotAttachedError();

    const updatedUser = await updateUserToken(
      schema,
      user.id,
      tokenId as string,
      db,
    );

    return {
      ...user,
      ...updatedUser,
    };
  } catch (error) {
    throw new UserCreationError('Could not create user.');
  }
};

export const createTokenForUser = async (userData: User) => {
  try {
    tradesafeClient = await GraphQLClient.createAuthenticatedClient(
      process.env.TRADESAFE_CLIENT_ID as string,
      process.env.TRADESAFE_SECRET as string,
    );

    const token = await createToken(tradesafeClient, {
      user: {
        givenName: userData?.firstName,
        familyName: userData?.lastName,
        email: userData?.emailAddress,
        mobile: userData?.phoneNumber as string | undefined,
      },
    });

    if (!token?.id) {
      logger.warn(
        `Unable to create a TradeSafe token for ${userData?.emailAddress}`,
      );
      return undefined;
    }

    return token?.id;
  } catch (error) {
    logger.error(
      'Encountered a fatal error when trying to create a TradeSafe token for the given user: ',
      error,
    );
    throw new UserCreationError('Could not create TradeSafe user.');
  }
};
