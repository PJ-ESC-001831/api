import { User } from '../../types';
import DbConnection from '@database/client';
import { createUser } from '../../repository';

describe('User Repository', () => {
  let db: any;
  let client: any;

  beforeAll(async () => {
    const connection = new DbConnection();
    await connection.configure();
    db = await connection.getDb();
    client = connection.getClient();
  });

  afterAll(() => {
    client.release();
  });

  it('should create a new user', async () => {
    const userData: User = {
      emailAddress: 'test@email.com',
      firstName: 'Test',
      lastName: 'User',
    };

    const user = await createUser(userData, db);
    expect(user).toMatchObject(userData);
  });
});
