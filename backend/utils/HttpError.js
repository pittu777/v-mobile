/**
 * Central HTTP error type.
 *
 * Controllers throw `HttpError` (or any `Error`) and the central error
 * middleware in `middleware/errorMiddleware.js` turns it into a consistent
 * JSON response. Anything thrown without a status is treated as a 500 and its
 * message is never leaked to the client.
 */
class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    if (details) this.details = details;
    Error.captureStackTrace?.(this, HttpError);
  }

  static badRequest(message = 'Bad request', details) {
    return new HttpError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized', details) {
    return new HttpError(401, message, details);
  }

  static forbidden(message = 'Forbidden', details) {
    return new HttpError(403, message, details);
  }

  static notFound(message = 'Not found', details) {
    return new HttpError(404, message, details);
  }

  static conflict(message = 'Conflict', details) {
    return new HttpError(409, message, details);
  }

  static tooManyRequests(message = 'Too many requests', details) {
    return new HttpError(429, message, details);
  }
}

module.exports = HttpError;