const { Coupon } = require("../models");
const { Op } = require("sequelize");

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [["createdAt", "DESC"]] });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrderValue, usageLimit, expiresAt } = req.body;

    if (!code || !value) {
      return res.status(400).json({ message: "Code and value are required" });
    }

    const existing = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type: type || "fixed",
      value,
      minOrderValue: minOrderValue || 0,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt || null,
    });

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    coupon.active = !coupon.active;
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    await coupon.destroy();
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code, total } = req.body;

    if (!code) return res.status(400).json({ valid: false, message: "Code required" });

    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase(),
        active: true,
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
      },
    });

    if (!coupon) {
      return res.json({ valid: false, message: "Invalid or expired coupon" });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ valid: false, message: "Coupon usage limit reached" });
    }

    if (total < coupon.minOrderValue) {
      return res.json({
        valid: false,
        message: `Minimum order value is HK$${coupon.minOrderValue}`,
      });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round((total * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    res.json({ valid: true, discount, code: coupon.code, type: coupon.type });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
