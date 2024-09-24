export class UserCreationError extends Error {
  constructor(message: string = 'Failed to create user.') {
    super(message);
    this.name = 'UserCreationError';
  }
}
