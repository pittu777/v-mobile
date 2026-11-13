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