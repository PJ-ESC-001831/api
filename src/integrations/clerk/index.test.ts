import dotenv from 'dotenv';
import { Clerk } from './index';

dotenv.config();

describe('clerk', () => {
  let service: Clerk;
  beforeEach(() => {
    service = new Clerk();
    jest.resetAllMocks();
  });

  describe('inviteUser', () => {
    it('should create an invitation', async () => {
      const email = 'jacques@mohara.co';
      const invitation = await service.inviteUser({ emailAddress: email });
      expect(invitation).toBeDefined();
    });
  });
});
