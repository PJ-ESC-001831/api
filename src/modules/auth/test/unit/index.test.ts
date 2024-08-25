import dotenv from 'dotenv';
import { AuthService } from '../../service';
import { clerkClient, Invitation, User } from '@clerk/clerk-sdk-node';

dotenv.config();

jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      createUser: jest.fn(),
    },
    invitations: {
      createInvitation: jest.fn(),
    },
  },
}));

describe('AuthService Service', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    jest.resetAllMocks();
  });

  describe('inviteUser', () => {
    it('should create an invitation', async () => {
      const email = 'jacques@mohara.co';
      const mockInvitation: Invitation = {
        id: 'invitation_id',
        emailAddress: email,
      } as Invitation;
      (clerkClient.invitations.createInvitation as jest.Mock).mockResolvedValue(
        mockInvitation,
      );

      const invitation = await service.inviteUser({ emailAddress: email });
      expect(invitation).toBeDefined();
      expect(invitation.emailAddress).toBe(email);
      expect(clerkClient.invitations.createInvitation).toHaveBeenCalledWith({
        emailAddress: email,
      });
    });

    it('should handle errors when creating an invitation', async () => {
      const email = 'jacques@mohara.co';
      const errorMessage = 'Failed to create invitation';
      (clerkClient.invitations.createInvitation as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(service.inviteUser({ emailAddress: email })).rejects.toThrow(
        errorMessage,
      );
      expect(clerkClient.invitations.createInvitation).toHaveBeenCalledWith({
        emailAddress: email,
      });
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const newUser = {
        emailAddress: 'test@example.com',
        phoneNumber: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockUser: User = {
        id: 'user_id',
        ...newUser,
        emailAddresses: [newUser.emailAddress],
      } as unknown as User;
      (clerkClient.users.createUser as jest.Mock).mockResolvedValue(mockUser);

      const createdUser = await service.createUser(newUser);
      expect(createdUser).toBeDefined();
      expect(createdUser.emailAddresses).toEqual([newUser.emailAddress]);
      expect(clerkClient.users.createUser).toHaveBeenCalledWith({
        emailAddress: [newUser.emailAddress],
        phoneNumber: [newUser.phoneNumber],
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      });
    });

    it('should handle errors when creating a user', async () => {
      const newUser = {
        emailAddress: 'test@example.com',
        phoneNumber: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
      };
      const errorMessage = 'Failed to create user';
      (clerkClient.users.createUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(service.createUser(newUser)).rejects.toThrow(errorMessage);
      expect(clerkClient.users.createUser).toHaveBeenCalledWith({
        emailAddress: [newUser.emailAddress],
        phoneNumber: [newUser.phoneNumber],
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      });
    });
  });
});
