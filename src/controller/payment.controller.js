const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Order, Cart, OrderItem, Product } = require("../models");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order + our DB order from cart
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

    // amount in paise
    const amountInPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    // Create our DB order with pending payment
    const order = await Order.create({
      UserId: req.user.id,
      total,
      paymentMethod: "online",
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
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
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment order error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify payment signature + finalize order
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Mark order as failed
      await Order.update(
        { paymentStatus: "failed", status: "cancelled" },
        { where: { id: orderId } }
      );
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment verified - update order
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = "paid";
    order.status = "confirmed";
    await order.save();

    // Clear user's cart
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
