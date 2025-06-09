export class AppError extends Error {
  constructor(message, details) {
    super(message);
    this.details = details;
  }
}
