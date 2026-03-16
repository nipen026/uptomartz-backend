const { Order, Cart, OrderItem, Product } = require("../models");

exports.createOrder = async (req, res) => {

  const cartItems = await Cart.findAll({
    where: { UserId: req.user.id },
    include: Product
  });

  let total = 0;

  cartItems.forEach(item => {
    total += item.quantity * item.Product.price;
  });

  const order = await Order.create({
    UserId: req.user.id,
    totalAmount: total
  });

  for (let item of cartItems) {

    await OrderItem.create({
      OrderId: order.id,
      ProductId: item.Product.id,
      quantity: item.quantity,
      price: item.Product.price
    });

  }

  await Cart.destroy({ where: { UserId: req.user.id } });

  res.json(order);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { UserId: req.user.id },
    include: [
      {
        model: OrderItem,
        include: [Product]
      }
    ]
  });
  res.json(orders);
};

exports.getAllOrdersForAdmin = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      {
        model: OrderItem,
        include: [Product]
      }
    ]
  });
  res.json(orders);
};