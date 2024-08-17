import express, { Request, Response } from 'express';
import { Clerk } from '@clerk/clerk-sdk-node';

const router = express.Router();

router.get('/invite/callback', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('Invalid token');
  }

  try {
    // Verify the invitation token
    const user = await Clerk.users.verifyInvitationToken(token);

    if (!user) {
      return res.status(400).send('Invalid or expired token');
    }

    // Authenticate the user and create a session
    const session = await Clerk.sessions.createSession({
      userId: user.id,
    });

    // Set the session cookie (assuming you are using cookies for session management)
    res.cookie('clerk_session', session.id, { httpOnly: true });

    // Redirect to the appropriate page (e.g., dashboard)
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error verifying invitation token:', error);
    res.status(500).send('Internal server error');
  }
});

export default router;
