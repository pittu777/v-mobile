const jwt = require('jsonwebtoken');
const HttpError = require('./HttpError');

/**
 * Access-token issuing.
 *
 * The token carries only what the app needs to identify the caller (`sub`,
 * `email`, `role`) — no password material, no PII beyond the address the user
 * already typed. Expiry is bounded and must be configured; there is no
 * insecure fallback, so a missing secret fails loudly at boot instead of
 * silently signing with a known key.
 */
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET is missing or too short. Set it to at least 32 random characters in backend/.env.',
    );
  }
  return secret;
};

const getTtlSeconds = () => {
  const raw = process.env.JWT_EXPIRES_IN;
  if (!raw) return DEFAULT_TTL_SECONDS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_TTL_SECONDS;
  return Math.floor(parsed);
};

/**
 * Sign an access token for a user.
 *
 * Accepts either a Mongoose document (`_id`) or the public shape returned to
 * clients (`id`) — the auth controllers sign after converting, so both forms
 * must work or the token ends up with no subject and `/auth/me` fails.
 */
const signAccessToken = (user) => {
  const subject = user?._id ?? user?.id;
  if (!subject) {
    throw new Error('signAccessToken requires a user with an _id or id.');
  }

  return jwt.sign({ email: user.email, role: user.role }, getSecret(), {
    subject: String(subject),
    expiresIn: getTtlSeconds(),
    issuer: process.env.JWT_ISSUER || 'mymobileapp-api',
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, getSecret(), {
      issuer: process.env.JWT_ISSUER || 'mymobileapp-api',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw HttpError.unauthorized('Your session has expired. Please sign in again.');
    }
    throw HttpError.unauthorized('Invalid session token.');
  }
};

module.exports = { signAccessToken, verifyAccessToken, getTtlSeconds, DEFAULT_TTL_SECONDS };