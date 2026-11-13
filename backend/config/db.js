const mongoose = require('mongoose');

/**
 * Open the MongoDB connection.
 *
 * The previous version caught the connection error and logged it, which let
 * `npm start` report success while every request failed later with an opaque
 * 500. Connection problems now reject, and `app.js` exits non-zero so the
 * failure is visible at boot.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URL || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGO_URL is not set. Copy .env.example to .env and set it.');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(uri, {
    // Fail fast on a bad topology instead of buffering commands indefinitely.
    serverSelectionTimeoutMS:
      Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000,
  });

  console.log(`Connected to MongoDB at ${connection.connection.host}`);

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });

  return connection;
};

module.exports = connectDB;