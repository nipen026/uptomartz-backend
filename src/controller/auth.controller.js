const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (req, res) => {

  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash
  });
  delete user.dataValues.password;
  res.json(user);
};

exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token });
};