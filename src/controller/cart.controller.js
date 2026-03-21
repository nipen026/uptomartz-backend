const { Cart, Product, Category } = require("../models");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if item already exists in cart
    const existing = await Cart.findOne({
      where: { UserId: req.user.id, ProductId: productId }
    });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      const updated = await Cart.findByPk(existing.id, { include: { model: Product, include: [Category] } });
      return res.json(updated);
    }

    const cart = await Cart.create({
      UserId: req.user.id,
      ProductId: productId,
      quantity: quantity || 1
    });

    const cartWithProduct = await Cart.findByPk(cart.id, { include: { model: Product, include: [Category] } });
    res.json(cartWithProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({
      where: { UserId: req.user.id },
      include: { model: Product, include: [Category] }
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Cart.findOne({ where: { id, UserId: req.user.id } });
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (quantity <= 0) {
      await item.destroy();
      return res.json({ message: "Item removed from cart" });
    }

    item.quantity = quantity;
    await item.save();

    const updated = await Cart.findByPk(item.id, { include: { model: Product, include: [Category] } });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findOne({ where: { id, UserId: req.user.id } });
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    await item.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.destroy({ where: { UserId: req.user.id } });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};