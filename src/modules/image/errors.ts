export class FailedToCreateImageEntryError extends Error {
  constructor(message = 'Failed to create image entry.') {
    super(message);
    this.name = 'FailedToCreateImageEntryError';
  }
}

export class FailedToRetrieveImagesError extends Error {
  constructor(message = 'Failed to retrieve images for the given filter.') {
    super(message);
    this.name = 'FailedToRetrieveImagesError';
  }
}
