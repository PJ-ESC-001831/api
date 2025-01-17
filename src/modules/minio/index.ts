import * as Minio from 'minio';

import { labeledLogger } from '@modules/logger';
import {
  FailedToCreateBucketError,
  FailedToGenerateSignedURLError,
  MinioClientNotDefinedError,
} from './errors';
import { Client } from '@clerk/clerk-sdk-node';

const logger = labeledLogger('module:minio/index');

/**
 * Creates a bucket in a MinIO server if it does not already exist.
 * @param {string} bucketName - The name of the bucket to create.
 * @param {Client} minioClient - An instance of the MinIO client.
 * @returns {Promise<void>} - A promise that resolves when the operation completes.
 *
 * @example
 * import { Client } from 'minio';
 * const minioClient = new Client({
 *   endPoint: 'play.min.io',
 *   port: 9000,
 *   useSSL: true,
 *   accessKey: 'your-access-key',
 *   secretKey: 'your-secret-key',
 * });
 *
 * await createBucket('my-bucket', minioClient);
 */
export async function createBucket(
  bucketName: string,
  minioClient: Minio.Client | null,
): Promise<void> {
  try {
    if (!minioClient) throw new MinioClientNotDefinedError();
    // Check if the bucket already exists
    const bucketExists = await minioClient.bucketExists(bucketName);

    if (bucketExists) {
      logger.info(`Bucket "${bucketName}" already exists.`);
      return;
    }

    // Create the bucket if it doesn't exist
    await minioClient.makeBucket(bucketName);
    logger.info(`Bucket "${bucketName}" created successfully.`);
    return;
  } catch (error) {
    // Log any errors during the bucket creation process
    logger.error(`Error creating bucket "${bucketName}":`, error);
    throw new FailedToCreateBucketError();
  }
}

/**
 * Generates a presigned URL for accessing an object in a MinIO bucket.
 * @param bucketName - The name of the bucket containing the object.
 * @param objectName - The key of the object in the bucket.
 * @param minioClient - An instance of the MinIO client.
 * @param expiry - The expiration time for the signed URL in seconds (default is 3600 seconds or 1 hour).
 * @returns A promise that resolves to the signed URL.
 * @throws MinioClientNotDefinedError If the MinIO client is null or undefined.
 * @throws FailedToGenerateSignedURLError If generating the signed URL fails.
 */
export async function getSignedObjectURL(
  bucketName: string,
  objectName: string,
  minioClient: Minio.Client | null,
  expiry: number = 3600,
): Promise<string> {
  if (!minioClient) {
    throw new MinioClientNotDefinedError();
  }

  try {
    return await minioClient.presignedGetObject(bucketName, objectName, expiry);
  } catch (error) {
    logger.error('Error generating signed URL:', error);
    throw new FailedToGenerateSignedURLError(
      `Failed to generate signed URL for object "${objectName}" in bucket "${bucketName}".`,
    );
  }
}

/**
 * Returns a singleton instance of the MinIO client.
 * @returns A MinIO client instance or null if the connection fails.
 */
let client: Minio.Client | null;
export function getMinioClient(): Minio.Client | null {
  try {
    if (client) {
      logger.info('Using existing MinIO client instance.');
      return client;
    }

    const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = parseInt(process.env.MINIO_PORT || '9000', 10);
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;

    if (!accessKey || !secretKey) {
      logger.error('MinIO access key or secret key is missing.');
      return null;
    }

    logger.info(`Connecting to MinIO instance at ${endPoint}:${port}...`);
    client = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    logger.info('Successfully connected to the MinIO instance.');
    return client;
  } catch (error) {
    logger.error(
      `Failed to connect to the MinIO instance: ${(error as { message: string }).message}`,
      {
        error,
      },
    );
    return null;
  }
}

export default getMinioClient;
