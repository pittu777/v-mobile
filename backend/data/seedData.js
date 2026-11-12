const products = [
  {
    id: "prod_1",
    name: "Wireless noise-cancelling headphones",
    category: "Electronics",
    price: 4999,
    rating: "4.8",
  },
  {
    id: "prod_2",
    name: "Minimalist everyday backpack",
    category: "Fashion",
    price: 2499,
    rating: "4.6",
  },
  {
    id: "prod_3",
    name: "Smart fitness tracker band",
    category: "Fitness",
    price: 3299,
    rating: "4.7",
  },
  {
    id: "prod_4",
    name: "Ceramic pour-over coffee maker",
    category: "Home",
    price: 1899,
    rating: "4.9",
  },
];

const cart = [
  { productId: "prod_1", quantity: 1 },
  { productId: "prod_2", quantity: 1 },
];

const orders = [
  {
    id: "ORD-2026-1048",
    date: "18 Jul 2026",
    status: "In transit",
    items: [
      { name: "Wireless noise-cancelling headphones", quantity: 1 },
      { name: "Minimalist everyday backpack", quantity: 1 },
    ],
    total: 7498,
  },
  {
    id: "ORD-2026-1032",
    date: "04 Jul 2026",
    status: "Delivered",
    items: [{ name: "Ceramic pour-over coffee maker", quantity: 1 }],
    total: 1899,
  },
];

const profile = {
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  initials: "AS",
  role: "Pro Member",
  stats: [
    { label: "Orders", value: "12" },
    { label: "Tasks done", value: "48" },
    { label: "Saved", value: "9" },
  ],
};

module.exports = { products, cart, orders, profile };
