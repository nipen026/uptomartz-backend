require("dotenv").config();
const { sequelize, Category, Product } = require("./src/models");

const categories = [
  { name: "Fruits & Vegetables" },
  { name: "Dairy & Bread" },
  { name: "Snacks" },
  { name: "Beverages" },
  { name: "Instant Food" },
  { name: "Household" },
  { name: "Personal Care" },
  { name: "Baby Care" },
];

const products = [
  // Fruits & Vegetables (cat 1)
  { name: "Fresh Red Apples", description: "Crisp and juicy red apples, perfect for snacking or baking. 1kg pack.", price: 149, stock: 80, isBestSeller: true, catIndex: 0 },
  { name: "Organic Bananas", description: "Naturally ripened organic bananas. Rich in potassium. Bunch of 6.", price: 49, stock: 120, isBestSeller: false, catIndex: 0 },
  { name: "Baby Spinach Pack", description: "Tender baby spinach leaves, washed and ready to eat. 200g pack.", price: 59, stock: 60, isBestSeller: false, catIndex: 0 },

  // Dairy & Bread (cat 2)
  { name: "Farm Fresh Whole Milk", description: "Creamy full-fat whole milk from grass-fed cows. 1 litre.", price: 68, stock: 100, isBestSeller: true, catIndex: 1 },
  { name: "Greek Yogurt Plain", description: "Thick and creamy Greek yogurt with live cultures. 400g tub.", price: 120, stock: 50, isBestSeller: false, catIndex: 1 },
  { name: "Multigrain Bread Loaf", description: "Freshly baked multigrain bread with seeds. 400g loaf.", price: 55, stock: 70, isBestSeller: false, catIndex: 1 },

  // Snacks (cat 3)
  { name: "Classic Salted Chips", description: "Thin and crispy potato chips with just the right salt. 150g bag.", price: 35, stock: 200, isBestSeller: true, catIndex: 2 },
  { name: "Dark Chocolate Bar", description: "Premium 70% dark chocolate bar. Rich and smooth. 100g.", price: 99, stock: 90, isBestSeller: false, catIndex: 2 },
  { name: "Mixed Nuts Trail Pack", description: "Roasted almonds, cashews, and walnuts blend. 250g pack.", price: 299, stock: 45, isBestSeller: true, catIndex: 2 },

  // Beverages (cat 4)
  { name: "Fresh Orange Juice", description: "100% freshly squeezed orange juice with no added sugar. 1 litre.", price: 110, stock: 65, isBestSeller: true, catIndex: 3 },
  { name: "Green Tea Bags", description: "Natural green tea bags with antioxidants. Pack of 25.", price: 180, stock: 85, isBestSeller: false, catIndex: 3 },
  { name: "Sparkling Water Lime", description: "Refreshing lime-infused sparkling water. 750ml bottle.", price: 45, stock: 150, isBestSeller: false, catIndex: 3 },

  // Instant Food (cat 5)
  { name: "Instant Ramen Noodles", description: "Quick-cook ramen noodles with spicy seasoning. Pack of 4.", price: 80, stock: 180, isBestSeller: true, catIndex: 4 },
  { name: "Ready-to-Eat Dal Makhani", description: "Authentic dal makhani, just heat and eat. 300g pack.", price: 95, stock: 55, isBestSeller: false, catIndex: 4 },

  // Household (cat 6)
  { name: "Liquid Dish Wash Gel", description: "Powerful grease-cutting dish wash gel with lemon. 500ml.", price: 99, stock: 90, isBestSeller: false, catIndex: 5 },
  { name: "All-Purpose Surface Cleaner", description: "Antibacterial multi-surface cleaner spray. 500ml bottle.", price: 149, stock: 70, isBestSeller: false, catIndex: 5 },

  // Personal Care (cat 7)
  { name: "Herbal Shampoo", description: "Gentle herbal shampoo for all hair types. Paraben-free. 250ml.", price: 199, stock: 60, isBestSeller: false, catIndex: 6 },
  { name: "Charcoal Face Wash", description: "Deep cleansing activated charcoal face wash. 100ml tube.", price: 175, stock: 50, isBestSeller: true, catIndex: 6 },

  // Baby Care (cat 8)
  { name: "Baby Diapers Pack", description: "Ultra-soft baby diapers with 12-hour leak protection. Pack of 30.", price: 499, stock: 40, isBestSeller: true, catIndex: 7 },
  { name: "Baby Lotion Gentle", description: "Hypoallergenic moisturizing baby lotion. 200ml bottle.", price: 225, stock: 55, isBestSeller: false, catIndex: 7 },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Ensure tables exist
    await sequelize.sync({ alter: true });

    // Upsert categories
    const categoryRecords = [];
    for (const cat of categories) {
      const [record] = await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat,
      });
      categoryRecords.push(record);
      console.log(`Category: ${record.name} (id=${record.id})`);
    }

    // Create products
    let created = 0;
    for (const p of products) {
      const category = categoryRecords[p.catIndex];
      const [, wasCreated] = await Product.findOrCreate({
        where: { name: p.name },
        defaults: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          isBestSeller: p.isBestSeller,
          CategoryId: category.id,
        },
      });
      if (wasCreated) created++;
      console.log(`${wasCreated ? "+" : "="} Product: ${p.name} → ${category.name}`);
    }

    console.log(`\nDone! ${created} new products added across ${categoryRecords.length} categories.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
