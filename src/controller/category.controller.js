const { Category } = require("../models");

exports.createCategory = async (req, res) => {

  const category = await Category.create(req.body);

  res.json(category);
};

exports.getCategories = async (req, res) => {

  const categories = await Category.findAll();

  res.json(categories);
};