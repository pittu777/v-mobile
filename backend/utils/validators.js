/**
 * Validate the strings an email/password flow cares about.
 *
 * Deliberately dependency-free: the auth routes need a handful of checks and
 * pulling in a validation library for them would be heavier than the code it
 * replaces. Errors are thrown as 400s so the central handler formats them.
 */
const HttpError = require('./HttpError');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;
const NAME_MAX = 80;

const requireEmail = (value, label = 'Email') => {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!email) throw HttpError.badRequest(`${label} is required.`);
  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    throw HttpError.badRequest('Enter a valid email address.');
  }
  return email;
};

const requirePassword = (value, label = 'Password') => {
  if (typeof value !== 'string' || value.length === 0) {
    throw HttpError.badRequest(`${label} is required.`);
  }
  if (value.length < PASSWORD_MIN) {
    throw HttpError.badRequest(
      `${label} must be at least ${PASSWORD_MIN} characters.`,
    );
  }
  if (value.length > PASSWORD_MAX) {
    throw HttpError.badRequest(
      `${label} must be at most ${PASSWORD_MAX} characters.`,
    );
  }
  return value;
};

const requireName = (value, label = 'Name') => {
  const name = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  if (!name) throw HttpError.badRequest(`${label} is required.`);
  if (name.length > NAME_MAX) {
    throw HttpError.badRequest(`${label} must be at most ${NAME_MAX} characters.`);
  }
  return name;
};

/** Optional email: returns `null` when absent, validated email otherwise. */
const optionalEmail = (value, label = 'Email') => {
  if (value === undefined || value === null || value === '') return null;
  return requireEmail(value, label);
};

const requirePasswordConfirmation = (password, confirmation) => {
  if (typeof confirmation !== 'string' || confirmation.length === 0) {
    throw HttpError.badRequest('Please confirm your password.');
  }
  if (password !== confirmation) {
    throw HttpError.badRequest('Passwords do not match.');
  }
  return confirmation;
};

module.exports = {
  EMAIL_PATTERN,
  PASSWORD_MIN,
  PASSWORD_MAX,
  requireEmail,
  requirePassword,
  requireName,
  optionalEmail,
  requirePasswordConfirmation,
};