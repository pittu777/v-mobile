const HttpError = require('../utils/HttpError');

/** 404 for an unmatched route, so it reaches the error handler as JSON. */
const notFoundHandler = (req, _res, next) => {
  next(HttpError.notFound(`Route ${req.method} ${req.originalUrl} does not exist.`));
};

/**
 * Terminal error handler.
 *
 * Must keep all four arguments — Express identifies error middleware by arity.
 * `err.statusCode` is only honoured if it's a real 4xx/5xx; a plain `Error`
 * becomes a 500 and its message is replaced with a generic string so internal
 * details never reach the client.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const isTrusted = err instanceof HttpError;
  const statusCode =
    isTrusted && Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : 500;

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  const body = {
    success: false,
    message: statusCode >= 500 ? 'Something went wrong on our side.' : err.message,
    code: statusCode >= 500 ? 'INTERNAL_ERROR' : err.code || err.name,
  };

  if (isTrusted && err.details) body.details = err.details;

  res.status(statusCode).json(body);
};

module.exports = { notFoundHandler, errorHandler };