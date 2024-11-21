/**
 * Custom error class for API errors, extending the base Error class.
 * Provides additional information such as HTTP status code, metadata, and an optional cause for error chaining.
 */
export class ApiError extends Error {
  // The HTTP status code associated with the error (e.g., 404, 500).
  public readonly statusCode: number;

  // Additional metadata associated with the error, typically used for logging or debugging.
  public readonly meta: Record<string, any>;

  // Optional underlying error that caused this error, used for error chaining and providing a complete stack trace.
  public readonly cause?: Error;

  /**
   * Creates an instance of ApiError.
   * @param statusCode - The HTTP status code for the error. Defaults to 500 if not specified.
   * @param message - A descriptive error message.
   * @param meta - An object containing additional information related to the error. Defaults to an empty object.
   * @param name - The name of the error. Defaults to the class name.
   * @param cause - Optional underlying error that led to this ApiError, providing error chaining support.
   */
  constructor(
    statusCode: number = 500,
    message: string,
    meta: Record<string, any> = {},
    name?: string,
    cause?: Error
  ) {
    super(message); // Call the base Error constructor with the error message
    this.statusCode = statusCode;
    this.meta = meta;
    this.cause = cause;

    // Captures the stack trace and associates it with this class for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Sets the name property to the class name for better stack trace readability
    this.name = name ?? this.constructor.name;
  }

  /**
   * Converts the ApiError instance to a JSON object, typically used for logging or sending error responses in APIs.
   * @returns A JSON object with relevant error details.
   */
  public toJSON(): {
    name: string;
    message: string;
    statusCode: number;
    meta: Record<string, any>;
    stack?: string;
  } {
    return {
      name: this.name,
      message: this.name !== "zod" ? this.message : "Zod Validation Error",
      statusCode: this.statusCode,
      meta: this.meta,
      ...(process.env.NODE_ENV === "development" &&
        this.name !== "zod" && { stack: this.stack }), // Include stack trace in development
    };
  }
}
