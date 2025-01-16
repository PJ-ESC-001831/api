export class MinioClientNotDefinedError extends Error {
  constructor(message = 'The Minio client is not defined.') {
    super(message);
    this.name = 'MinioClientNotDefinedError';
  }
}

export class FailedToCreateBucketError extends Error {
  constructor(
    message = 'Failed to create the requested bucket on the Minio client.',
  ) {
    super(message);
    this.name = 'FailedToCreateBucketError';
  }
}
