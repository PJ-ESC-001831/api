import clerk from '@clerk/clerk-sdk-node';

import { NewUser } from './types';

export const registerUser = async ({
  emailAddress: email,
  password,
  firstName,
  lastName,
  phoneNumber,
}: NewUser) => {
  const user = await clerk.clerkClient.users.createUser({
    emailAddress: [email],
    phoneNumber: [phoneNumber],
    password,
    firstName,
    lastName,
  });

  return user;
};
