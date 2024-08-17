// Mocking the createModel function and Mongoose connection
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockCreateModel = jest.fn();

import { Connection } from 'mongoose';
import { createUser, findUserByEmail } from './index'; // Adjust the import path as needed
import { createModel, IUser } from '../../models/user';

jest.mock('../../models/user', () => ({
  createModel: mockCreateModel,
}));

describe('User Service', () => {
  let mockConn: jest.Mocked<Connection>;

  beforeEach(() => {
    mockConn = {} as jest.Mocked<Connection>;
    mockCreateModel.mockReturnValue({
      save: mockSave,
      findOne: mockFindOne,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const userData: Partial<IUser> = { emailAddress: 'test@example.com' };
      const mockUser = { ...userData, _id: '12345' };
      mockSave.mockResolvedValue(mockUser);

      const result = await createUser(mockConn, userData);

      expect(createModel).toHaveBeenCalledWith(mockConn);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email address and return it', async () => {
      const emailAddress = 'test@example.com';
      const mockUser = { emailAddress, _id: '12345' };
      mockFindOne.mockResolvedValue(mockUser);

      const result = await findUserByEmail(mockConn, emailAddress);

      expect(createModel).toHaveBeenCalledWith(mockConn);
      expect(mockFindOne).toHaveBeenCalledWith({ emailAddress });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const emailAddress = 'notfound@example.com';
      mockFindOne.mockResolvedValue(null);

      const result = await findUserByEmail(mockConn, emailAddress);

      expect(createModel).toHaveBeenCalledWith(mockConn);
      expect(mockFindOne).toHaveBeenCalledWith({ emailAddress });
      expect(result).toBeNull();
    });
  });
});
