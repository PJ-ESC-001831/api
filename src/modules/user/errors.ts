export class UserCreationError extends Error {
  constructor(message: string = 'Failed to create user.') {
    super(message);
    this.name = 'UserCreationError';
  }
}

export class UnknownUserTypeError extends Error {
  constructor(message: string = 'Invalid user type received.') {
    super(message);
    this.name = 'UnknownUserTypeError';
  }
}

export class DatabaseNotDefinedError extends Error {
  constructor(message: string = 'Database connection not defined.') {
    super(message);
    this.name = 'DatabaseNotDefinedError';
  }
}

export class UserQueryError extends Error {
  constructor(
    message: string = 'Something went wrong with a query to the users table.',
  ) {
    super(message);
    this.name = 'UserQueryError';
  }
}

export class UserUpdateError extends Error {
  constructor(
    message: string = 'Something went wrong with an update to the users table.',
  ) {
    super(message);
    this.name = 'UserUpdateError';
  }
}