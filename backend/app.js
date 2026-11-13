require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const todoRoutes = require('./routes/TodoRoute');
const shopRoutes = require('./routes/ShopRoute');
const authRoutes = require('./routes/AuthRoute');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json({ limit: '1mb' }));

// Allow any origin in development; in production, set CORS_ORIGIN to a
// comma-separated list of trusted origins.
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction
  ? (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
  : [];

app.use(
  cors(
    allowedOrigins.length > 0
      ? { origin: allowedOrigins, credentials: true }
      : { origin: true, credentials: true },
  ),
);

// Liveness probe — cheap, unauthenticated, and safe for uptime checks.
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok', uptime: process.uptime() },
    message: 'OK',
  });
});

app.use('/api', authRoutes);
app.use('/api', todoRoutes);
app.use('/api', shopRoutes);

// Unmatched routes and thrown errors both end here, so no handler can leave a
// request hanging or respond with a non-JSON body.
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

// Export the app so tests can exercise it with supertest; only listen when run
// directly (`node app.js`), never on import.
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error.message);
      process.exit(1);
    });
}

module.exports = app;