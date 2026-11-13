const { Schema, model, models } = require('mongoose');

/**
 * The five commerce/profile fixture shapes, modelled explicitly.
 *
 * `Product` doubles as the base for a `CartItem` (product fields plus
 * quantity) and for an `OrderItem` (name, quantity, unit price) so the seed
 * data and every response derived from it share one source of truth.
 */
const productSchema = new Schema(
  {
    // Fixtures use their own stable string ids (prod_1, prod_2, ...) so the
    // frontend can map each product to a local icon.
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: String,
      required: true,
      trim: true,
      // Kept as a string because the seed data carries "4.8" and the shop
      // renders it verbatim next to a star icon.
      default: '0.0',
    },
  },
  { timestamps: true },
);

const cartItemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Human-readable in the fixture ("18 Jul 2026"); the ISO date is also kept
    // so the field can be sorted or reformatted later without re-parsing.
    date: {
      type: String,
      required: true,
      trim: true,
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ['Delivered', 'In transit', 'Processing', 'Cancelled'],
      default: 'Processing',
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const profileStatSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    initials: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      default: 'Member',
    },
    stats: {
      type: [profileStatSchema],
      default: [],
    },
  },
  { timestamps: true },
);

// The models themselves are unused today (the commerce screens are read-only
// fixtures), but exporting them means the seed script and any future live
// collection can be typed against the same shape as the API responses.
const Product = models.Product || model('Product', productSchema);
const CartItem = models.CartItem || model('CartItem', cartItemSchema);
const Order = models.Order || model('Order', orderSchema);
const Profile = models.Profile || model('Profile', profileSchema);

module.exports = {
  Product,
  CartItem,
  Order,
  Profile,
  productSchema,
  cartItemSchema,
  orderItemSchema,
  orderSchema,
  profileSchema,
  profileStatSchema,
};