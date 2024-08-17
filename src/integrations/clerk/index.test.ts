import dotenv from 'dotenv';
import { registerUser } from './index';

dotenv.config();

describe('clerk', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const user = await registerUser({
        emailAddress: 'co-maker@tri2b.me',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+27721535649',
      });
      expect(user).toBeDefined();
    });
  });
});
