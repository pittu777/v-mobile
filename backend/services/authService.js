const User = require('../models/userModel');
const VerificationToken = require('../models/verificationTokenModel');
const HttpError = require('../utils/HttpError');
const { generateRawToken, hashToken } = require('../utils/token');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  isConsoleFallback,
} = require('../services/mailer');

/**
 * Signup, login, verification and reset all live here so the controllers stay
 * thin and the rules around tokens (hashing, expiry, single use) are written
 * down exactly once.
 */
const VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

const TOKEN_TTL = {
  email_verification: VERIFICATION_TTL_MS,
  password_reset: RESET_TTL_MS,
};

const ttlLabel = (ms) => (ms >= VERIFICATION_TTL_MS ? '24 hours' : '1 hour');

const publicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const appBaseUrl = () =>
  (process.env.APP_BASE_URL || 'http://localhost:8081').replace(/\/$/, '');

/**
 * Issue a token for a purpose.
 *
 * Any previous unused token for the same user+purpose is invalidated first so
 * the newest link is the only one that works — clicking "resend" twice should
 * not leave two live links.
 */
const issueToken = async ({ user, purpose }) => {
  const rawToken = generateRawToken();

  await VerificationToken.updateMany(
    { userId: user._id, purpose, usedAt: null },
    { $set: { usedAt: new Date() } },
  );

  await VerificationToken.create({
    userId: user._id,
    purpose,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + TOKEN_TTL[purpose]),
  });

  return rawToken;
};

const consumeToken = async ({ rawToken, purpose }) => {
  if (typeof rawToken !== 'string' || !rawToken.trim()) {
    throw HttpError.badRequest('A token is required.');
  }

  const record = await VerificationToken.findOne({
    tokenHash: hashToken(rawToken.trim()),
    purpose,
    usedAt: null,
  });

  // Same message whether the token is unknown, expired or already used: the
  // response must not tell an attacker which of those it was.
  if (!record || record.expiresAt.getTime() < Date.now()) {
    throw HttpError.badRequest('This link is invalid or has expired.');
  }

  record.usedAt = new Date();
  await record.save();

  return record;
};

const sendVerificationLink = async ({ user, rawToken }) => {
  const url = `${appBaseUrl()}/verify-email?token=${encodeURIComponent(rawToken)}`;
  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    url,
    expiresInLabel: ttlLabel(VERIFICATION_TTL_MS),
  });
  return url;
};

const sendResetLink = async ({ user, rawToken }) => {
  const url = `${appBaseUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;
  await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    url,
    expiresInLabel: ttlLabel(RESET_TTL_MS),
  });
  return url;
};

const signUp = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    // Deliberately a 409 rather than a "check your inbox" dodge: the signup
    // form needs to tell the user the address is taken.
    throw HttpError.conflict('An account with this email already exists.');
  }

  const user = await User.create({ name, email, passwordHash: password });

  const rawToken = await issueToken({ user, purpose: 'email_verification' });
  const verificationUrl = await sendVerificationLink({ user, rawToken });

  // Only expose the link when no mail transport exists — otherwise the caller
  // could read a token that was meant to travel by email only.
  return {
    user: publicUser(user),
    ...(isConsoleFallback() ? { verificationUrl } : {}),
  };
};

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  // Same message for unknown email and wrong password — a distinct "no such
  // account" response would confirm which addresses are registered.
  if (!user || !(await user.comparePassword(password))) {
    throw HttpError.unauthorized('Invalid email or password.');
  }

  return { user: publicUser(user) };
};

const verifyEmail = async ({ token }) => {
  const record = await consumeToken({ rawToken: token, purpose: 'email_verification' });
  const user = await User.findById(record.userId);

  if (!user) {
    throw HttpError.notFound('The account for this link no longer exists.');
  }

  if (!user.emailVerified) {
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();
  }

  return { user: publicUser(user) };
};

const resendVerification = async ({ email }) => {
  const user = await User.findOne({ email });

  // Always resolves: revealing whether an address is registered would turn
  // this endpoint into an account-enumeration oracle.
  if (!user || user.emailVerified) {
    return { sent: true };
  }

  const rawToken = await issueToken({ user, purpose: 'email_verification' });
  const verificationUrl = await sendVerificationLink({ user, rawToken });

  return {
    sent: true,
    ...(isConsoleFallback() ? { verificationUrl } : {}),
  };
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  // Same non-disclosure rule as resendVerification.
  if (!user) {
    return { sent: true };
  }

  const rawToken = await issueToken({ user, purpose: 'password_reset' });
  const resetUrl = await sendResetLink({ user, rawToken });

  return { sent: true, ...(isConsoleFallback() ? { resetUrl } : {}) };
};

const resetPassword = async ({ token, password }) => {
  const record = await consumeToken({ rawToken: token, purpose: 'password_reset' });
  const user = await User.findById(record.userId).select('+passwordHash');

  if (!user) {
    throw HttpError.notFound('The account for this link no longer exists.');
  }

  user.passwordHash = password;
  await user.save();

  // A completed reset invalidates every outstanding reset token.
  await VerificationToken.updateMany(
    { userId: user._id, purpose: 'password_reset' },
    { $set: { usedAt: new Date() } },
  );

  return { user: publicUser(user) };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw HttpError.notFound('Account not found.');
  return publicUser(user);
};

module.exports = {
  signUp,
  signIn,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getProfile,
  publicUser,
  VERIFICATION_TTL_MS,
  RESET_TTL_MS,
};