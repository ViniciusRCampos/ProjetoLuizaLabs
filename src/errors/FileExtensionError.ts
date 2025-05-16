export class FileExtensionError extends Error {
    constructor(message: string = 'The file extension is not supported') {
      super(message);
      this.name = 'FileExtensionError';
    }
  }