const express = require('express');
const {
  signUp,
  signIn,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: available to anyone.
router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);
router.post('/auth/verify-email', verifyEmail);
router.post('/auth/resend-verification', resendVerification);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Authenticated: needs a valid access token.
router.get('/auth/me', requireAuth, getMe);

module.exports = router;