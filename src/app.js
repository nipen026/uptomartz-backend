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



/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.json({
    message: "Grocery API running 🚀"
  });
});



/* ---------------- ERROR HANDLER ---------------- */

// app.use(errorHandler);



/* ---------------- DATABASE ---------------- */

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log("Database connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

});