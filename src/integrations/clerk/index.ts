import { clerkClient, Invitation, User } from '@clerk/clerk-sdk-node';

import { NewUser } from './types';
import { labeledLogger } from '@src/utils/logger';

export class Clerk {
  constructor(
    private readonly client = clerkClient,
    private readonly logger = labeledLogger(this.constructor.name),
  ) {}

  protected async createUser(user: NewUser): Promise<User> {
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

  protected async createInvitation(email: string): Promise<Invitation> {
    const invitation = await this.client.invitations.createInvitation({
      emailAddress: email,
    });

    return invitation;
  }

  public async inviteUser(user: NewUser): Promise<Invitation> {
    return this.createInvitation(user.emailAddress);
  }
}
