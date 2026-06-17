const sequelize = require("../config/database")

const User = require("./user.model")
const Category = require("./category.model")
const Product = require("./product.model")
const Cart = require("./cart.model")
const Order = require("./order.model")
const OrderItem = require("./orderItem.model")
const Address = require("./address.model")
const Coupon = require("./coupon.model")

// CATEGORY -> PRODUCTS
Category.hasMany(Product)
Product.belongsTo(Category)

// USER -> CART
User.hasMany(Cart)
Cart.belongsTo(User)

Product.hasMany(Cart)
Cart.belongsTo(Product)

// USER -> ORDER
User.hasMany(Order)
Order.belongsTo(User)

// ORDER -> ORDER ITEMS
Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

// USER -> ADDRESS
User.hasMany(Address)
Address.belongsTo(User)

module.exports = {
 sequelize,
 User,
 Category,
 Product,
 Cart,
 Order,
 OrderItem,
 Address,
 Coupon,
}
