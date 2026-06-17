const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Coupon = sequelize.define("Coupon", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM("fixed", "percentage"),
    defaultValue: "fixed",
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  minOrderValue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
});

module.exports = Coupon;
