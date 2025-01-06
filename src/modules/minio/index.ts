import * as Minio from 'minio';

import { labeledLogger } from '@modules/logger';

const logger = labeledLogger('module:minio/index');

// Initialize MinIO client
let client: Minio.Client;
export const getMinioClient = (): Minio.Client | null => {
  try {
    if (client) {
      logger.info('Using existing Minio instance.');
      return client;
    }

    logger.info(`Connecting to Minio instance at ${process.env.MINIO_ENDPOINT}.`);
    client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000', 10), // Default port is 9000
      useSSL: false, // Set to true if your MinIO uses HTTPS
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
    logger.info('Successfully connected to the Minio instance.');
    return client;
  } catch (e) {
    logger.error('Failed to connect to the Minio instance.')
  }

  return null;
};

export default getMinioClient;
