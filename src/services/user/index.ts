import { Connection } from 'mongoose';
import { createModel, IUser } from '../../models/user';

/**
 * Creates a new user in the database.
 *
 * @param {Connection} conn The Mongoose connection to use.
 * @param {Partial<IUser>} userData The new user details.
 * @return {Promise<IUser>} A promise that resolves to the created user.
 */
export async function createUser(
  conn: Connection,
  userData: Partial<IUser>,
): Promise<IUser> {
  const User = createModel(conn);
  const user = new User(userData);
  await user.save();
  return user;
}

/**
 * Finds a user by email address.
 *
 * @param {Connection} conn The Mongoose connection to use.
 * @param {string} emailAddress The email address to search for.
 * @return {Promise<IUser | null>} A promise that resolves to the found user or null if not found.
 */
export async function findUserByEmail(
  conn: Connection,
  emailAddress: string,
): Promise<IUser | null> {
  const User = createModel(conn);
  return User.findOne({ emailAddress });
}
