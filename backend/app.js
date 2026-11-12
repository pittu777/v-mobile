
require('dotenv').config();

const express = require('express');
const connectDB = require("./config/db");
const cors = require("cors")
const todoRoutes = require("./routes/TodoRoute");
const shopRoutes = require("./routes/ShopRoute");
const app = express();
app.use(express.json());
app.use(cors())
connectDB();

app.use("/api",todoRoutes);
app.use("/api", shopRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
