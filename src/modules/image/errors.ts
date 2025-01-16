export class FailedToCreateImageEntryError extends Error {
  constructor(message = 'Failed to create image entry.') {
    super(message);
    this.name = 'FailedToCreateImageEntryError';
  }
}
