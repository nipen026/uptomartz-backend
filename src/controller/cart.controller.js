const { Cart } = require("../models");

exports.addToCart = async (req, res) => {

  const { productId, quantity } = req.body;

  const cart = await Cart.create({
    UserId: req.user.id,
    ProductId: productId,
    quantity
  });

  res.json(cart);
};

exports.getCart = async (req, res) => {

  const cart = await Cart.findAll({
    where: { UserId: req.user.id }
  });

  res.json(cart);
};