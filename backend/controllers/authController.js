const asyncHandler = require('../utils/asyncHandler');
const { requireEmail, requirePassword, requireName, requirePasswordConfirmation } = require('../utils/validators');
const { signAccessToken } = require('../utils/jwt');
const { sendData, sendCreated, sendMessage } = require('../utils/respond');
const authService = require('../services/authService');

/**
 * Auth endpoints.
 *
 * Every handler validates its input before touching the database, and every
 * response goes through the shared envelope in `utils/respond.js`.
 */
const signUp = asyncHandler(async (req, res) => {
  const name = requireName(req.body?.name);
  const email = requireEmail(req.body?.email);
  const password = requirePassword(req.body?.password);
  requirePasswordConfirmation(password, req.body?.confirmPassword);

  const { user, verificationUrl } = await authService.signUp({ name, email, password });

  return sendCreated(
    res,
    { user, accessToken: signAccessToken(user) },
    'Account created. Check your email to verify your address.',
  );
});

const signIn = asyncHandler(async (req, res) => {
  const email = requireEmail(req.body?.email);
  const password = requirePassword(req.body?.password);

  const { user } = await authService.signIn({ email, password });

  return sendData(res, { user, accessToken: signAccessToken(user) }, { message: 'Signed in.' });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const { user } = await authService.verifyEmail({ token });

  return sendData(res, { user }, { message: 'Email verified.' });
});

const resendVerification = asyncHandler(async (req, res) => {
  const email = requireEmail(req.body?.email);
  await authService.resendVerification({ email });

  return sendMessage(res, 'If that account needs verification, a new link is on its way.');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = requireEmail(req.body?.email);
  await authService.forgotPassword({ email });

  return sendMessage(res, 'If that account exists, a reset link is on its way.');
});

const resetPassword = asyncHandler(async (req, res) => {
  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const password = requirePassword(req.body?.password, 'New password');
  requirePasswordConfirmation(password, req.body?.confirmPassword);

  const { user } = await authService.resetPassword({ token, password });

  return sendData(res, { user, accessToken: signAccessToken(user) }, { message: 'Password updated.' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.auth.id);
  return sendData(res, { user });
});

module.exports = {
  signUp,
  signIn,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
};