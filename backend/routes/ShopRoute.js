const express = require("express");
const {
  getProducts,
  getCart,
  getOrders,
  getProfile,
} = require("../controllers/shopController");

const router = express.Router();

router.get("/products", getProducts);
router.get("/cart", getCart);
router.get("/orders", getOrders);
router.get("/profile", getProfile);

module.exports = router;
