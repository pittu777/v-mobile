require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Product, Order, Profile } = require('../models/shopModel');
const { products, orders, profile } = require('../data/seedData');

/**
 * Load the commerce fixtures into MongoDB.
 *
 * The screens currently read the fixtures straight from `data/seedData.js`
 * (they never touch these collections), so this script exists to prove the
 * schemas accept the real seed data and to give a future live-read path
 * something valid to serve.
 *
 * Usage: npm run seed:shop   (add -- --fresh to drop the collections first)
 */
const run = async () => {
  const fresh = process.argv.includes('--fresh');

  await connectDB();

  if (fresh) {
    await Promise.all([Product.deleteMany({}), Order.deleteMany({}), Profile.deleteMany({})]);
    console.log('Cleared existing shop collections.');
  }

  const productDocs = await Product.insertMany(
    products.map((product) => ({ ...product })),
    { ordered: false },
  );
  const orderDocs = await Order.insertMany(
    orders.map((order) => ({ ...order })),
    { ordered: false },
  );
  const profileDoc = await Profile.findOneAndUpdate(
    { email: profile.email },
    { ...profile },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(
    `Seeded ${productDocs.length} products, ${orderDocs.length} orders, 1 profile (${profileDoc.email}).`,
  );

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});