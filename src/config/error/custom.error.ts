export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message + " Testing Yam");

    this.statusCode = statusCode;

    // // Capture the stack trace (excluding the constructor function)
    // Error.captureStackTrace(this, this.constructor);
  }
}
