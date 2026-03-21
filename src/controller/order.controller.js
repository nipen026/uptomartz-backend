const { Order, Cart, OrderItem, Product, User } = require("../models");

exports.createOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const cartItems = await Cart.findAll({
      where: { UserId: req.user.id },
      include: Product
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    cartItems.forEach(item => {
      total += item.quantity * item.Product.price;
    });

    const order = await Order.create({
      UserId: req.user.id,
      total,
      paymentMethod: paymentMethod || "cod",
      status: "confirmed"
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

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [Product] }]
    });

    res.json(fullOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
      order: [["createdAt", "DESC"]]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ["id", "name", "email"] }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, UserId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }]
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["confirmed", "picking", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    const fullOrder = await Order.findByPk(id, {
      include: [{ model: OrderItem, include: [Product] }]
    });
    res.json(fullOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};