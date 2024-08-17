const mockSave = jest.fn();
const mockFindOne = jest.fn();

import { Connection, model } from 'mongoose';
import { createUser, findUserByEmail } from './index';
import { createModel, IUser } from '../../models/user';

// Mocking the createModel function and Mongoose connection
jest.mock('../../models/user', () => ({
  createModel: jest.fn(),
}));

describe('User Service', () => {
  let mockConn: jest.Mocked<Connection>;
  let mockModel: jest.Mocked<typeof createModel>;

  beforeEach(() => {
    mockConn = {} as jest.Mocked<Connection>;
    mockModel = jest.fn().mockReturnValue({
      save: mockSave,
      findOne: mockFindOne,
    }) as any;
    (createModel as jest.Mock).mockReturnValue(mockModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const userData: Partial<IUser> = { emailAddress: 'test@example.com' };
      const mockUser = { ...userData, _id: '12345' };
      mockModel.prototype.save.mockResolvedValue(mockUser);

      const result = await createUser(mockConn, userData);

      expect(createModel).toHaveBeenCalledWith(mockConn);
      expect(mockModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email address and return it', async () => {
      const emailAddress = 'test@example.com';
      const mockUser = { emailAddress, _id: '12345' };
      mockModel.prototype.findOne.mockResolvedValue(mockUser);

      const result = await findUserByEmail(mockConn, emailAddress);

      expect(createModel).toHaveBeenCalledWith(mockConn);
      expect(mockModel.prototype.findOne).toHaveBeenCalledWith({
        emailAddress,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const emailAddress = 'notfound@example.com';
      mockModel.prototype.findOne.mockResolvedValue(null);

      const result = await findUserByEmail(mockConn, emailAddress);

      expect(createModel).toHaveBeenCalledWith(mockConn);
      expect(mockModel.prototype.findOne).toHaveBeenCalledWith({
        emailAddress,
      });
      expect(result).toBeNull();
    });
  });
});
