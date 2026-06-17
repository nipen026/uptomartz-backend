const { Op } = require("sequelize");
const { Product, Category } = require("../models");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, CategoryId, isBestSeller, description } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      price,
      stock,
      description,
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
  try {
    const { category, search } = req.query;
    const where = {};

    if (category) where.CategoryId = category;
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const products = await Product.findAll({
      where,
      include: Category
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: Category
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isBestSeller: true },
      include: Category
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, price, stock, description, CategoryId, isBestSeller } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (description !== undefined) product.description = description;
    if (CategoryId !== undefined) product.CategoryId = CategoryId || null;
    if (isBestSeller !== undefined) {
      product.isBestSeller = isBestSeller === "true" || isBestSeller === true;
    }
    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    }

    await product.save();
    const updated = await Product.findByPk(product.id, { include: Category });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};