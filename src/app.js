require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { sequelize } = require("./models");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const paymentRoutes = require("./routes/payment.routes");
const addressRoutes = require("./routes/address.routes");

// const errorHandler = require("./middlewares/error.middleware");

const app = express();



/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());

// app.use(helmet());

// app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



/* ---------------- STATIC FILES ---------------- */

app.use("/uploads", express.static("uploads"));



/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/addresses", addressRoutes);



/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.json({
    message: "Grocery API running 🚀"
  });
});



/* ---------------- ERROR HANDLER ---------------- */

// app.use(errorHandler);



module.exports = app;