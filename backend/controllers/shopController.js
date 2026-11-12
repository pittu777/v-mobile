const { products, cart, orders, profile } = require("../data/seedData");

const getProducts = (_req, res) => {
  res.status(200).json(products);
};

const getCart = (_req, res) => {
  const items = cart
    .map(({ productId, quantity }) => {
      const product = products.find((item) => item.id === productId);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);

  res.status(200).json(items);
};

const getOrders = (_req, res) => {
  res.status(200).json(orders);
};

const getProfile = (_req, res) => {
  res.status(200).json(profile);
};

module.exports = { getProducts, getCart, getOrders, getProfile };
