import { labeledLogger } from '@src/modules/logger';
import { Client } from 'minio';
import {
  FailedToCreateBucketError,
  MinioClientNotDefinedError,
} from './errors';

const logger = labeledLogger('module:utils/validation');

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
  minioClient: Client | null,
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
