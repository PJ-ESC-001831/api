import client from '@utils/drizzle';

import Repository from '../repository';
import User from '@database/schema/User';

class UserRepository extends Repository {
  async list(): Promise<(typeof User)[]> {
    return this.getClient().;
  }
}
