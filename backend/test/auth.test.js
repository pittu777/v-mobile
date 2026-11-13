const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');

/**
 * End-to-end coverage of the auth endpoints and the todo fixes.
 *
 * New accounts are active immediately; the API returns a bearer token after
 * signup so the frontend can enter the app without a verification step.
 */
const VALID = {
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  password: 'supersecret1',
  confirmPassword: 'supersecret1',
};

const extractTokenFrom = (res) => res?.body?.data?.accessToken;

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
