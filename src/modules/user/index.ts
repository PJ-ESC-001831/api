import { User, UserWithToken } from './types';
import DbConnection from '@database/client';
import { labeledLogger } from '../logger';
import { createUser, updateUserToken } from './repository';
import { UnknownUserTypeError, UserCreationError } from './errors';
import { admins } from '@src/database/schema/admins';
import { sellers } from '@src/database/schema/sellers';
import { buyers } from '@src/database/schema/buyers';
import GraphQLClient from '@src/lib/tradesafe/src/client';
import { createToken } from '@src/lib/tradesafe/src/tokens';

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

    if (userType === 'admin') {
      return createUser(userData, admins, db);
    }

    // const userWithToken: UserWithToken = {
    //   ...userData,
    //   tokenId: await createTokenForUser(userData),
    // };

    let schema: typeof sellers | typeof buyers | undefined = undefined;
    if (userType === 'seller') schema = sellers;
    else if (userType === 'buyer') schema = buyers;

    if (!schema) throw new UnknownUserTypeError();

    const [user, tokenId] = await Promise.all([
      createUser(userData, sellers, db),
      createTokenForUser(userData),
    ]);

    // Check whether the token was created.
    if (!toke)
      const updatedUser = await updateUserToken(schema, user.id, tokenId, db);

    return user;
  } catch (error) {
    logger.error('Failed to create seller user: ', error);
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
