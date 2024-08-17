import { clerkClient } from '@clerk/clerk-sdk-node';

import { NewUser } from './types';
import logger from '@src/utils/logger';

export class Clerk {
  constructor(
    private readonly client = clerkClient,
    private readonly logger = logger,
  ) {}
}

export const sendSignInLink = async (emailAddress: string) => {
  const emailInstance = await clerkClient.emailAddresses.createEmailAddress({
    userId: 'user_123',
    emailAddress,
  });
};

export const registerUser = async ({
  emailAddress: email,
  password,
  firstName,
  lastName,
  phoneNumber,
}: NewUser) => {
  const user = await clerkClient.users.createUser({
    emailAddress: [email],
    phoneNumber: [phoneNumber],
    password,
    firstName,
    lastName,
  });

  return user;
};
