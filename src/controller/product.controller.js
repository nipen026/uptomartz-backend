const { Product, Category } = require("../models");

exports.createProduct = async (req, res) => {

  try {

    const { name, price, stock, CategoryId, isBestSeller } = req.body;

    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      price,
      stock,
      CategoryId,
      isBestSeller,
      image: imagePath
    });

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProducts = async (req, res) => {

  const products = await Product.findAll({
    include: Category
  });

  res.json(products);
};


exports.getBestSellerProducts = async (req, res) => {

  const products = await Product.findAll({
    where: { isBestSeller: true }
  });

  res.json(products);
};