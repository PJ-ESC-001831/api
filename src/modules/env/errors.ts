/**
 * Custom error class for invalid number parsing.
 */
export class InvalidNumberError extends Error {
  constructor(value: string) {
    super(`Invalid number: ${value}`);
    this.name = 'InvalidNumberError';
  }
}
