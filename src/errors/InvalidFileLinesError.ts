export class InvalidFileLinesError extends Error {
    constructor(message: string = 'The file does not have valid lines') {
      super(message);
      this.name = 'InvalidFileLinesError';
    }
  }