import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

abstract class Repository {
  protected client: any;
  protected schema: any;

  async getClient(): Promise<NodePgDatabase<Record<string, never>>> {
    return drizzle(this.client, this.schema);
  }
}

export default Repository;
