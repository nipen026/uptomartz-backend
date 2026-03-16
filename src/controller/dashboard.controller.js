const { Order } = require("../models");
const { Op } = require("sequelize");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();

    const delivered = await Order.count({
      where: { status: "delivered" },
    });

    const pending = await Order.count({
      where: { status: "pending" },
    });

    const cancelled = await Order.count({
      where: { status: "cancelled" },
    });

    const revenue = await Order.sum("total", {
      where: { status: "delivered" },
    });

    res.json({
      totalOrders,
      delivered,
      pending,
      cancelled,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};