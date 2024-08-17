class MongoUriNotSetException extends Error {
  constructor(message: string = 'Mongo URI is not set in env file') {
    super(message);
  }
}
