process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_that_is_at_least_32_characters_long_000000';
process.env.JWT_ISSUER = 'mymobileapp-api-test';
process.env.APP_BASE_URL = 'http://localhost:8081';
process.env.CORS_ORIGIN = '';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

/**
 * Start an in-memory MongoDB for the whole suite.
 *
 * `app.js` reads its config at import time, so the env vars above must be set
 * before it is required — hence this module being loaded from `setupFiles`
 * rather than `setupFilesAfterEnv`.
 */
const startMemoryDb = async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongoServer.getUri();
  await mongoose.connect(process.env.MONGO_URL);
};

const stopMemoryDb = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop();
};

const clearCollections = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
};

module.exports = { startMemoryDb, stopMemoryDb, clearCollections };