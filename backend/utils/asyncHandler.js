/**
 * Wrap an async route handler so a rejected promise reaches Express's error
 * middleware instead of hanging the request.
 *
 * Express 4 does not catch async errors itself — without this wrapper a thrown
 * error becomes an unhandled rejection and the client waits until timeout.
 */
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;