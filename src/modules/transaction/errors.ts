export class FailedToCreateTransactionError extends Error {
  constructor(message = 'Failed to create a new transaction.') {
    super(message);
    this.name = 'FailedToCreateTransactionError';
  }
}

export class TransactionNotFoundError extends Error {
  constructor(message = 'Failed to find the transaction.') {
    super(message);
    this.name = 'TransactionNotFoundError';
  }
}
