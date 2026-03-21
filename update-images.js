require("dotenv").config();
const { sequelize, Product } = require("./src/models");

const productImages = {
  "Fresh Red Apples": "https://images.unsplash.com/photo-1560806887-1e4b6f3c3b1e?w=500&h=500&fit=crop",
  "Organic Bananas": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop",
  "Baby Spinach Pack": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop",
  "Farm Fresh Whole Milk": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop",
  "Greek Yogurt Plain": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop",
  "Multigrain Bread Loaf": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop",
  "Classic Salted Chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&h=500&fit=crop",
  "Dark Chocolate Bar": "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&h=500&fit=crop",
  "Mixed Nuts Trail Pack": "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500&h=500&fit=crop",
  "Fresh Orange Juice": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=500&fit=crop",
  "Green Tea Bags": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&h=500&fit=crop",
  "Sparkling Water Lime": "https://images.unsplash.com/photo-1603394151492-ba3568d5988f?w=500&h=500&fit=crop",
  "Instant Ramen Noodles": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&h=500&fit=crop",
  "Ready-to-Eat Dal Makhani": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=500&fit=crop",
  "Liquid Dish Wash Gel": "https://images.unsplash.com/photo-1585441695325-21557ab8fc36?w=500&h=500&fit=crop",
  "All-Purpose Surface Cleaner": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=500&fit=crop",
  "Herbal Shampoo": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop",
  "Charcoal Face Wash": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop",
  "Baby Diapers Pack": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
  "Baby Lotion Gentle": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop",
};

async function updateImages() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    let updated = 0;
    for (const [name, imageUrl] of Object.entries(productImages)) {
      const [count] = await Product.update(
        { image: imageUrl },
        { where: { name } }
      );
      if (count > 0) {
        updated++;
        console.log(`Updated: ${name}`);
      } else {
        console.log(`Not found: ${name}`);
      }
    }

    console.log(`\nDone! ${updated} products updated with images.`);
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err);
    process.exit(1);
  }
}

updateImages();
