export default class UndefinedDatabaseClientError extends Error {
  constructor(message = 'The database client is not defined.') {
    super(message);
    this.name = 'UndefinedDatabaseClientError';
  }
}
