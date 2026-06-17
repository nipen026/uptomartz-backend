const { Address } = require("../models");

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { UserId: req.user.id },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { label, name, phone, address, city, district, isDefault } = req.body;

    if (!label || !name || !phone || !address || !city || !district) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { UserId: req.user.id } }
      );
    }

    const newAddress = await Address.create({
      UserId: req.user.id,
      label,
      name,
      phone,
      address,
      city,
      district,
      isDefault: isDefault || false,
    });

    res.json(newAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const addr = await Address.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!addr) return res.status(404).json({ message: "Address not found" });

    const { label, name, phone, address, city, district, isDefault } = req.body;

    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { UserId: req.user.id } }
      );
    }

    if (label) addr.label = label;
    if (name) addr.name = name;
    if (phone) addr.phone = phone;
    if (address) addr.address = address;
    if (city) addr.city = city;
    if (district) addr.district = district;
    if (isDefault !== undefined) addr.isDefault = isDefault;

    await addr.save();
    res.json(addr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const addr = await Address.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!addr) return res.status(404).json({ message: "Address not found" });

    await addr.destroy();
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
