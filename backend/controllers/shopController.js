const { products, cart, orders, profile } = require('../data/seedData');
const asyncHandler = require('../utils/asyncHandler');
const { sendData } = require('../utils/respond');

/**
 * Read-only commerce/profile fixtures.
 *
 * These endpoints exist so the Shop, Cart, Orders and Profile screens have
 * something real to render without a commerce backend. They never mutate
 * anything — the seed module is the only source of truth.
 */
const getProducts = asyncHandler(async (_req, res) => sendData(res, products));

const getCart = asyncHandler(async (_req, res) => {
  const items = cart
    .map(({ productId, quantity }) => {
      const product = products.find((item) => item.id === productId);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);

  return sendData(res, items);
});

const getOrders = asyncHandler(async (_req, res) => sendData(res, orders));

const getProfile = asyncHandler(async (_req, res) => sendData(res, profile));

module.exports = { getProducts, getCart, getOrders, getProfile };