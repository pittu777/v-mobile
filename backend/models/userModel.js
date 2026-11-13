const { Schema, model, models } = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * A registered account.
 *
 * `passwordHash` is `select: false` so it never rides along on a normal
 * `find()` — queries that need it must ask for it explicitly with
 * `.select('+passwordHash')`, which keeps "did I forget to strip the hash"
 * bugs from being possible by default.
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      maxlength: [80, 'Name must be at most 80 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      maxlength: [254, 'Email is too long.'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

/**
 * Hash the password whenever it is assigned, not just on create.
 *
 * `isModified` matters for password reset: re-saving a loaded user must not
 * re-hash an already-hashed value.
 */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!candidate || !this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.passwordHash);
};

module.exports = models.User || model('User', userSchema);