import { Client } from 'pg';

import { labeledLogger } from '../logger';

const { info, error } = labeledLogger('utils:drizzle');

/**
 * Configures and returns a PostgreSQL client.
 * @async
 * @return {Promise<Client>} A promise that resolves to a configured PostgreSQL client.
 */
const configureClient = async () => {
  try {
    info('Configuring Drizzle client.');
    const clientConfig = new Client({
      host: process.env.DATABASE_HOST as string,
      port: parseInt(process.env.DATABASE_PORT as string, 10),
      user: process.env.POSTGRES_USER as string,
      password: process.env.POSTGRES_PASSWORD as string,
      database: process.env.POSTGRES_DB as string,
    });

    info('Drizzle client configured. Establishing connection.');
    await clientConfig.connect();

    info('Drizzle client connection established.');
    return clientConfig;
  } catch (e) {
    error('Drizzle client configuration failed.', e);
    throw e;
  }
};

export default configureClient;
