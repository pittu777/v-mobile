const { Schema, model, models } = require('mongoose');

/**
 * Email verification and password reset tokens.
 *
 * Verification tokens are short-lived (24h) and single-use; password reset
 * tokens are shorter (1h) because they grant account access. Both are stored
 * as a SHA-256 hash of the emailed value — see `utils/token.js`.
 */
const purposeEnum = ['email_verification', 'password_reset'];

const verificationTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: purposeEnum,
      default: 'email_verification',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

verificationTokenSchema.index({ userId: 1, purpose: 1 });

module.exports =
  models.VerificationToken ||
  model('VerificationToken', verificationTokenSchema);