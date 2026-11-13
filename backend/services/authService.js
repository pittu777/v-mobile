const User = require('../models/userModel');
const HttpError = require('../utils/HttpError');
const { signAccessToken } = require('../utils/jwt');

/**
 * Auth service.
 *
 * Signup, signin, and profile retrieval live here so the controllers stay thin
 * and the authentication rules are written down exactly once.
 */

const publicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const signUp = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw HttpError.conflict('An account with this email already exists.');
  const user = await User.create({ name, email, passwordHash: password });
  return { user: publicUser(user), accessToken: signAccessToken(user) };
};

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) {
    throw HttpError.unauthorized('Invalid email or password.');
  }
  return { user: publicUser(user), accessToken: signAccessToken(user) };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw HttpError.notFound('Account not found.');
  return publicUser(user);
};

module.exports = {
  signUp,
  signIn,
  getProfile,
  publicUser,
};
