const express = require('express');
const {
  signUp,
  signIn,
  getMe,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: available to anyone.
router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);

// Authenticated: needs a valid access token.
router.get('/auth/me', requireAuth, getMe);

module.exports = router;
