import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const requireAuth = ClerkExpressRequireAuth({
  authorizedParties: ['http://0.0.0.0:3000'],
  jwtKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export default requireAuth;
