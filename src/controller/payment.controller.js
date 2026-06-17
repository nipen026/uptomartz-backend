const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Order, Cart, OrderItem, Product } = require("../models");

exports.createPaymentOrder = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { UserId: req.user.id },
      include: Product,
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    cartItems.forEach((item) => {
      total += item.quantity * item.Product.price;
    });

    // HKD amount in cents (smallest unit)
    const amountInCents = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "hkd",
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user.id.toString() },
    });

    const order = await Order.create({
      UserId: req.user.id,
      total,
      paymentMethod: "online",
      status: "pending",
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
    });

    for (let item of cartItems) {
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.Product.id,
        quantity: item.quantity,
        price: item.Product.price,
      });
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Payment order error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      await Order.update(
        { paymentStatus: "failed", status: "cancelled" },
        { where: { id: orderId } }
      );
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.stripePaymentId = paymentIntentId;
    order.paymentStatus = "paid";
    order.status = "confirmed";
    await order.save();

    await Cart.destroy({ where: { UserId: req.user.id } });

    const fullOrder = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, include: [Product] }],
    });

    res.json({ message: "Payment verified", order: fullOrder });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: error.message });
  }
};
