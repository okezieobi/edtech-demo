export default class AppError extends Error {
  data: { timestamp: Date };

  type: string;

  constructor(message: string = 'Unspecified error', type: string = 'App', data: any = {}) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
    // Custom debugging information
    this.type = type;
    this.data = {
      ...data,
      timestamp: new Date(),
    };
    // Maintains proper stack trace for where our error was thrown (only available on V8)
  }
}
