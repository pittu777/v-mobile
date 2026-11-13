const User = require('../models/userModel');
const HttpError = require('../utils/HttpError');
const { verifyAccessToken } = require('../utils/jwt');

/**
 * Read the bearer token from `Authorization: Bearer <token>`.
 * Case-insensitive on the scheme, tolerant of extra whitespace.
 */
const readBearerToken = (header) => {
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
};

/**
 * Gate a route behind a valid access token.
 *
 * The user document is re-read on every request rather than trusted from the
 * token claims, so deleting or renaming a user takes effect immediately instead
 * of waiting for the token to expire.
 */
const requireAuth = async (req, _res, next) => {
  try {
    const token = readBearerToken(req.headers.authorization);
    if (!token) {
      throw HttpError.unauthorized('Authentication required.');
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw HttpError.unauthorized('The account for this session no longer exists.');
    }

    req.user = user;
    req.auth = { id: String(user._id), email: user.email, role: user.role };
    return next();
  } catch (error) {
    return next(error);
  }
};

/** Gate a route behind the `admin` role. Must run after `requireAuth`. */
const requireAdmin = (req, _res, next) => {
  if (!req.user) {
    return next(HttpError.unauthorized('Authentication required.'));
  }
  if (req.user.role !== 'admin') {
    return next(HttpError.forbidden('This action requires an admin account.'));
  }
  return next();
};

module.exports = { requireAuth, requireAdmin, readBearerToken };