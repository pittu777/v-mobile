const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');
const VerificationToken = require('../models/verificationTokenModel');
const { hashToken } = require('../utils/token');

/**
 * End-to-end coverage of the auth endpoints and the todo fixes.
 *
 * The mailer runs in console mode under test, so the verification link is read
 * back out of the created token record rather than an inbox — same token the
 * email would have contained.
 */
const VALID = {
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  password: 'supersecret1',
  confirmPassword: 'supersecret1',
};

const extractTokenFrom = (res) => res?.body?.data?.accessToken;

/**
 * Insert an outstanding token for a user and return the raw value.
 *
 * Raw tokens are never stored — only their SHA-256 hash — so a test that needs
 * to exercise the verify/reset endpoints has to mint one the same way the
 * service does and keep the plaintext itself.
 */
const issueTokenFor = async (userId, purpose, { expiresAt } = {}) => {
  const { generateRawToken } = require('../utils/token');
  const raw = generateRawToken();
  await VerificationToken.create({
    userId,
    purpose,
    tokenHash: hashToken(raw),
    expiresAt: expiresAt ?? new Date(Date.now() + 60_000),
  });
  return raw;
};

describe('GET /api/health', () => {
  it('reports ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, data: { status: 'ok' } });
  });
});

describe('POST /api/auth/signup', () => {
  it('creates an account and returns an envelope with a token', async () => {
    const res = await request(app).post('/api/auth/signup').send(VALID);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toMatchObject({
      email: VALID.email,
      name: VALID.name,
      emailVerified: false,
    });
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(extractTokenFrom(res)).toEqual(expect.any(String));

    // `passwordHash` is `select: false`, so it must be requested explicitly.
    const stored = await User.findOne({ email: VALID.email }).select('+passwordHash');
    expect(stored.passwordHash).not.toBe(VALID.passwordHash);
    expect(await stored.comparePassword(VALID.password)).toBe(true);
  });

  it('rejects a duplicate email with 409', async () => {
    await request(app).post('/api/auth/signup').send(VALID);
    const res = await request(app).post('/api/auth/signup').send(VALID);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it.each([
    ['missing name', { ...VALID, name: '' }],
    ['bad email', { ...VALID, email: 'not-an-email' }],
    ['short password', { ...VALID, password: 'short', confirmPassword: 'short' }],
    [
      'mismatched confirmation',
      { ...VALID, confirmPassword: 'somethingelse' },
    ],
  ])('rejects %s with 400', async (_label, payload) => {
    const res = await request(app).post('/api/auth/signup').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.message).toBe('string');
  });
});

describe('POST /api/auth/signin', () => {
  it('signs in with correct credentials', async () => {
    await request(app).post('/api/auth/signup').send(VALID);

    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: VALID.email, password: VALID.password });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(VALID.email);
    expect(extractTokenFrom(res)).toEqual(expect.any(String));
  });

  it('returns the same 401 for a wrong password and an unknown email', async () => {
    await request(app).post('/api/auth/signup').send(VALID);

    const wrongPassword = await request(app)
      .post('/api/auth/signin')
      .send({ email: VALID.email, password: 'wrongpassword' });

    const unknownEmail = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'nobody@example.com', password: VALID.password });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
  });
});

describe('email verification', () => {
  it('verifies a user with a valid token, and rejects reuse', async () => {
    const signup = await request(app).post('/api/auth/signup').send(VALID);
    const userId = new mongoose.Types.ObjectId(signup.body.data.user.id);
    const rawToken = await issueTokenFor(userId, 'email_verification');

    const first = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: rawToken });
    expect(first.status).toBe(200);
    expect(first.body.data.user.emailVerified).toBe(true);

    const reuse = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: rawToken });
    expect(reuse.status).toBe(400);
  });

  it('rejects an expired token', async () => {
    const signup = await request(app).post('/api/auth/signup').send(VALID);
    const userId = new mongoose.Types.ObjectId(signup.body.data.user.id);
    const raw = await issueTokenFor(userId, 'email_verification', {
      expiresAt: new Date(Date.now() - 1000),
    });

    const res = await request(app).post('/api/auth/verify-email').send({ token: raw });
    expect(res.status).toBe(400);
  });

  it('never reveals whether an email is registered', async () => {
    const known = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: VALID.email });
    const unknown = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'nobody@example.com' });

    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect(known.body.message).toBe(unknown.body.message);
  });
});

describe('password reset', () => {
  const resetFlow = async () => {
    await request(app).post('/api/auth/signup').send(VALID);
    const userId = new mongoose.Types.ObjectId(
      (await User.findOne({ email: VALID.email }))._id,
    );
    const rawToken = await issueTokenFor(userId, 'password_reset');
    return { userId, rawToken };
  };

  it('forgot-password does not reveal whether an account exists', async () => {
    await request(app).post('/api/auth/signup').send(VALID);

    const known = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: VALID.email });
    const unknown = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody@example.com' });

    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect(known.body.message).toBe(unknown.body.message);
  });

  it('resets the password, invalidates the token, and allows signing in with the new one', async () => {
    const { rawToken } = await resetFlow();

    const reset = await request(app).post('/api/auth/reset-password').send({
      token: rawToken,
      password: 'brandnewpassword',
      confirmPassword: 'brandnewpassword',
    });
    expect(reset.status).toBe(200);
    expect(extractTokenFrom(reset)).toEqual(expect.any(String));

    const reuse = await request(app).post('/api/auth/reset-password').send({
      token: rawToken,
      password: 'anotherpassword',
      confirmPassword: 'anotherpassword',
    });
    expect(reuse.status).toBe(400);

    const oldPassword = await request(app)
      .post('/api/auth/signin')
      .send({ email: VALID.email, password: VALID.password });
    const newPassword = await request(app)
      .post('/api/auth/signin')
      .send({ email: VALID.email, password: 'brandnewpassword' });

    expect(oldPassword.status).toBe(401);
    expect(newPassword.status).toBe(200);
  });

  it('rejects a reset with a too-short password', async () => {
    const { rawToken } = await resetFlow();

    const res = await request(app).post('/api/auth/reset-password').send({
      token: rawToken,
      password: 'short',
      confirmPassword: 'short',
    });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('requires a bearer token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the profile for a valid token', async () => {
    const signup = await request(app).post('/api/auth/signup').send(VALID);
    const token = signup.body.data.accessToken;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(VALID.email);
  });

  it('rejects a tampered token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.real.token');

    expect(res.status).toBe(401);
  });
});