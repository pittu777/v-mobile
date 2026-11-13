const crypto = require('crypto');

/**
 * Small crypto helpers shared by the auth features.
 *
 * `hashToken` is used for the *lookup* hash stored alongside a verification or
 * reset token. The raw token is only ever emailed to the user, so a database
 * leak cannot be replayed against the API.
 */
const TOKEN_BYTES = 32;

const generateRawToken = () => crypto.randomBytes(TOKEN_BYTES).toString('hex');

const hashToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

const safeEqual = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

module.exports = { generateRawToken, hashToken, safeEqual, TOKEN_BYTES };