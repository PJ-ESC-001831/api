import mongoose, { Connection } from 'mongoose';
import { labeledLogger } from '../logger';

const { info, error } = labeledLogger('utils:Mongoose');

export const getDatabaseConnection = async (): Promise<Connection> => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new MongoUriNotSetException();
    }

    info('Creating Mongoose connection to MongoDB.');
    const conn = await mongoose.createConnection(uri, {}).asPromise();

    conn.on('connected', () => info('Connection established successfully.'));
    conn.on('open', () => info('Connection opened.'));
    conn.on('disconnected', () => info('Connection disconnected.'));
    conn.on('reconnected', () => info('Connection reconnected.'));
    conn.on('disconnecting', () => info('Disconnecting from MongoDB.'));
    conn.on('close', () => info('Connection closed.'));
    conn.on('error', (e) => error('Error occurred:', e));

    return conn;
  } catch (e) {
    error('Failed to connect to MongoDB with Mongoose', e);
    throw e;
  }
};
