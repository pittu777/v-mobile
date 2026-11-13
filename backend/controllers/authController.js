const asyncHandler = require('../utils/asyncHandler');
const { requireEmail, requirePassword, requireName, requirePasswordConfirmation } = require('../utils/validators');
const { sendData, sendCreated } = require('../utils/respond');
const authService = require('../services/authService');

/**
 * Auth endpoints.
 *
 * Every handler validates its input before touching the database, and every
 * response goes through the shared envelope in `utils/respond.js`.
 *
 * Accounts are active immediately after signup; no email step is required.
 */
const signUp = asyncHandler(async (req, res) => {
  const name = requireName(req.body?.name);
  const email = requireEmail(req.body?.email);
  const password = requirePassword(req.body?.password);
  requirePasswordConfirmation(password, req.body?.confirmPassword);

  const { user, accessToken } = await authService.signUp({ name, email, password });

  return sendCreated(
    res,
    { user, accessToken },
    'Account created.',
  );
});

const signIn = asyncHandler(async (req, res) => {
  const email = requireEmail(req.body?.email);
  const password = requirePassword(req.body?.password);

  const { user, accessToken } = await authService.signIn({ email, password });

  return sendData(res, { user, accessToken }, { message: 'Signed in.' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.auth.id);
  return sendData(res, { user });
});

module.exports = {
  signUp,
  signIn,
  getMe,
};
