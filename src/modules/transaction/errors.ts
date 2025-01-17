export class FailedToCreateTransactionError extends Error {
  constructor(message = 'Failed to create a new transaction.') {
    super(message);
    this.name = 'FailedToCreateTransactionError';
  }
}
