import { z } from 'zod';

// Define the User Validation Schema
export const createUserRequestSchema = z.object({
  emailAddress: z.string().email().max(256),
  phoneNumber: z.string().max(10).optional(),
  firstName: z.string().min(1).max(256),
  lastName: z.string().min(1).max(256),
  profile: z.object({}).optional(),
  userType: z.enum(['seller', 'buyer', 'admin']),
});
