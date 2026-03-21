require("dotenv").config();
const { sequelize, Category, Product } = require("./src/models");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");
    await sequelize.sync({ alter: true });

    // Get existing categories
    const categories = await Category.findAll();
    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c.id; });
    console.log("Categories found:", Object.keys(catMap).join(", "));

    // Fix Red Apples image
    const [appleFixed] = await Product.update(
      { image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&h=500&fit=crop" },
      { where: { name: "Fresh Red Apples" } }
    );
    console.log(appleFixed > 0 ? "Fixed: Fresh Red Apples image" : "Fresh Red Apples not found");

    // 20 new products
    const newProducts = [
      // Fruits & Vegetables
      { name: "Fresh Strawberries", description: "Sweet and juicy farm-fresh strawberries. 250g punnet.", price: 129, stock: 65, isBestSeller: true, CategoryId: catMap["Fruits & Vegetables"], image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop" },
      { name: "Avocado Hass", description: "Creamy ripe Hass avocados, perfect for toast and salads. Pack of 2.", price: 179, stock: 40, isBestSeller: false, CategoryId: catMap["Fruits & Vegetables"], image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop" },
      { name: "Fresh Broccoli", description: "Crisp green broccoli florets, rich in vitamins. 500g bunch.", price: 69, stock: 55, isBestSeller: false, CategoryId: catMap["Fruits & Vegetables"], image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=500&fit=crop" },

      // Dairy & Bread
      { name: "Cheddar Cheese Block", description: "Aged sharp cheddar cheese, perfect for sandwiches. 200g block.", price: 199, stock: 45, isBestSeller: true, CategoryId: catMap["Dairy & Bread"], image: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=500&h=500&fit=crop" },
      { name: "Butter Unsalted", description: "Pure creamy unsalted butter for cooking and baking. 500g pack.", price: 260, stock: 70, isBestSeller: false, CategoryId: catMap["Dairy & Bread"], image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop" },
      { name: "Sourdough Bread", description: "Artisan sourdough bread with a crispy crust. Freshly baked 400g loaf.", price: 89, stock: 35, isBestSeller: false, CategoryId: catMap["Dairy & Bread"], image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&h=500&fit=crop" },

      // Snacks
      { name: "Peanut Butter Crunchy", description: "All-natural crunchy peanut butter with no added sugar. 350g jar.", price: 245, stock: 55, isBestSeller: true, CategoryId: catMap["Snacks"], image: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=500&h=500&fit=crop" },
      { name: "Granola Bars Oats & Honey", description: "Wholesome oats and honey granola bars. Pack of 6.", price: 159, stock: 80, isBestSeller: false, CategoryId: catMap["Snacks"], image: "https://images.unsplash.com/photo-1558401391-7899b tried-2c0e?w=500&h=500&fit=crop" },
      { name: "Popcorn Butter Flavor", description: "Ready-to-eat butter flavored popcorn. 100g bag.", price: 49, stock: 150, isBestSeller: false, CategoryId: catMap["Snacks"], image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&h=500&fit=crop" },

      // Beverages
      { name: "Cold Brew Coffee", description: "Smooth and rich cold brew coffee. Ready to drink. 250ml bottle.", price: 149, stock: 60, isBestSeller: true, CategoryId: catMap["Beverages"], image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=500&fit=crop" },
      { name: "Coconut Water Natural", description: "100% natural tender coconut water. No preservatives. 500ml.", price: 55, stock: 100, isBestSeller: false, CategoryId: catMap["Beverages"], image: "https://images.unsplash.com/photo-1536029521765-45f8e8b5ae11?w=500&h=500&fit=crop" },
      { name: "Mango Smoothie", description: "Thick and creamy mango smoothie made with real fruit. 300ml.", price: 89, stock: 45, isBestSeller: false, CategoryId: catMap["Beverages"], image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&h=500&fit=crop" },

      // Instant Food
      { name: "Oats Masala Flavour", description: "Instant masala oats, ready in 3 minutes. Pack of 6 sachets.", price: 120, stock: 90, isBestSeller: false, CategoryId: catMap["Instant Food"], image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=500&h=500&fit=crop" },
      { name: "Cup Noodles Chicken", description: "Instant chicken flavored cup noodles. Just add hot water. 70g.", price: 45, stock: 200, isBestSeller: true, CategoryId: catMap["Instant Food"], image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop" },

      // Household
      { name: "Laundry Detergent Liquid", description: "Powerful stain-removing liquid detergent with fresh scent. 1 litre.", price: 249, stock: 60, isBestSeller: false, CategoryId: catMap["Household"], image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop" },
      { name: "Kitchen Paper Towels", description: "Super absorbent 2-ply kitchen paper towel rolls. Pack of 2.", price: 129, stock: 85, isBestSeller: false, CategoryId: catMap["Household"], image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=500&fit=crop" },

      // Personal Care
      { name: "Aloe Vera Body Lotion", description: "Hydrating aloe vera body lotion for smooth skin. 300ml pump.", price: 220, stock: 50, isBestSeller: false, CategoryId: catMap["Personal Care"], image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop" },
      { name: "Bamboo Toothbrush Set", description: "Eco-friendly bamboo toothbrush with charcoal bristles. Pack of 4.", price: 199, stock: 40, isBestSeller: true, CategoryId: catMap["Personal Care"], image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&h=500&fit=crop" },

      // Baby Care
      { name: "Baby Wet Wipes", description: "Alcohol-free gentle baby wet wipes. Pack of 80 sheets.", price: 149, stock: 75, isBestSeller: false, CategoryId: catMap["Baby Care"], image: "https://images.unsplash.com/photo-1584839404005-0e5bfc69b8f5?w=500&h=500&fit=crop" },
      { name: "Baby Cereal Rice", description: "Fortified rice cereal for babies 6+ months. 300g box.", price: 185, stock: 45, isBestSeller: false, CategoryId: catMap["Baby Care"], image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&h=500&fit=crop" },
    ];

    let created = 0;
    for (const p of newProducts) {
      const [, wasCreated] = await Product.findOrCreate({
        where: { name: p.name },
        defaults: p,
      });
      if (wasCreated) created++;
      console.log(`${wasCreated ? "+" : "="} ${p.name}`);
    }

    console.log(`\nDone! ${created} new products added. Total should now be 40.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
