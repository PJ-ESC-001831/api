import { clerkClient, Invitation, User } from '@clerk/clerk-sdk-node';
import { NewUser } from './types';
import { labeledLogger } from '@src/utils/logger';

/**
 * Clerk service class to handle user and invitation management.
 */
export class Clerk {
  private readonly client = clerkClient;
  private readonly logger = labeledLogger(this.constructor.name);

  constructor() {}

  /**
   * Creates a new user in the Clerk system.
   *
   * @param {NewUser} user - The new user details.
   * @return {Promise<User>} - A promise that resolves to the created user.
   */
  public async createUser(user: NewUser): Promise<User> {
    this.logger.info('Creating user', user);
    const createdUser = await this.client.users.createUser({
      emailAddress: [user.emailAddress],
      phoneNumber: user.phoneNumber ? [user.phoneNumber] : [],
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    this.logger.info(`User created for: ${user.emailAddress}`);
    return createdUser;
  }

  /**
   * Creates an invitation for a new user.
   *
   * @param {string} email - The email address to send the invitation to.
   * @return {Promise<Invitation>} - A promise that resolves to the created invitation.
   */
  public async createInvitation(email: string): Promise<Invitation> {
    this.logger.info(`Creating invitation for email: ${email}`);
    const invitation = await this.client.invitations.createInvitation({
      emailAddress: email,
    });
    this.logger.info(`Invitation created for: ${email}`);
    return invitation;
  }

  /**
   * Invites a new user by creating an invitation.
   *
   * @param {NewUser} user - The new user details.
   * @return {Promise<Invitation>} - A promise that resolves to the created invitation.
   */
  public async inviteUser(user: NewUser): Promise<Invitation> {
    this.logger.info(`Inviting user with email: ${user.emailAddress}`);
    return this.createInvitation(user.emailAddress);
  }
}
