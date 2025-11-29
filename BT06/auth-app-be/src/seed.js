const { sequelize } = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");

    await sequelize.sync({ force: true });
    console.log("✅ Database synced (tables recreated)");

    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const [admin] = await User.findOrCreate({
      where: { email: "admin@example.com" },
      defaults: {
        email: "admin@example.com",
        password: adminPassword,
        name: "Admin User",
        role: "admin",
      },
    });
    console.log("✅ Admin user created:", admin.email);

    const userPassword = await bcrypt.hash("User@123", 10);
    const [user] = await User.findOrCreate({
      where: { email: "user@example.com" },
      defaults: {
        email: "user@example.com",
        password: userPassword,
        name: "Regular User",
        role: "user",
      },
    });
    console.log("✅ Regular user created:", user.email);

    const categories = [
      {
        name: "Điện thoại",
        description: "Điện thoại thông minh các loại",
        slug: "dien-thoai",
      },
      {
        name: "Laptop",
        description: "Laptop cho công việc và học tập",
        slug: "laptop",
      },
      {
        name: "Tai nghe",
        description: "Tai nghe, headphone chất lượng cao",
        slug: "tai-nghe",
      },
      {
        name: "Phụ kiện",
        description: "Phụ kiện điện thoại, laptop",
        slug: "phu-kien",
      },
    ];

    const createdCategories = [];
    for (const cat of categories) {
      const [category] = await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: cat,
      });
      createdCategories.push(category);
      console.log("✅ Category created:", category.name);
    }

    const products = [
      {
        name: "iPhone 15 Pro Max",
        description: "Flagship iPhone mới nhất với chip A17 Pro",
        price: 29990000,
        stock: 50,
        views: 1250,
        discount: 10,
        imageUrl: "https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max",
        categoryId: createdCategories[0].id,
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Smartphone Android cao cấp với S Pen",
        price: 27990000,
        stock: 40,
        views: 980,
        discount: 15,
        imageUrl: "https://via.placeholder.com/300x300?text=Galaxy+S24+Ultra",
        categoryId: createdCategories[0].id,
      },
      {
        name: "Xiaomi 14 Pro",
        description: "Smartphone chất lượng giá tốt",
        price: 15990000,
        stock: 60,
        views: 750,
        discount: 20,
        imageUrl: "https://via.placeholder.com/300x300?text=Xiaomi+14+Pro",
        categoryId: createdCategories[0].id,
      },
      {
        name: "MacBook Pro 16 M3",
        description: "Laptop chuyên nghiệp cho developer",
        price: 55990000,
        stock: 20,
        views: 2100,
        discount: 0,
        imageUrl: "https://via.placeholder.com/300x300?text=MacBook+Pro+16",
        categoryId: createdCategories[1].id,
      },
      {
        name: "Dell XPS 15",
        description: "Laptop Windows cao cấp",
        price: 42990000,
        stock: 25,
        views: 1500,
        discount: 5,
        imageUrl: "https://via.placeholder.com/300x300?text=Dell+XPS+15",
        categoryId: createdCategories[1].id,
      },
      {
        name: "ThinkPad X1 Carbon",
        description: "Laptop doanh nhân nhẹ bền",
        price: 38990000,
        stock: 30,
        views: 890,
        discount: 0,
        imageUrl: "https://via.placeholder.com/300x300?text=ThinkPad+X1",
        categoryId: createdCategories[1].id,
      },
      {
        name: "AirPods Pro 2",
        description: "Tai nghe không dây chống ồn từ Apple",
        price: 6490000,
        stock: 100,
        views: 3200,
        discount: 12,
        imageUrl: "https://via.placeholder.com/300x300?text=AirPods+Pro+2",
        categoryId: createdCategories[2].id,
      },
      {
        name: "Sony WH-1000XM5",
        description: "Tai nghe over-ear chống ồn tốt nhất",
        price: 8990000,
        stock: 80,
        views: 2800,
        discount: 8,
        imageUrl: "https://via.placeholder.com/300x300?text=Sony+WH-1000XM5",
        categoryId: createdCategories[2].id,
      },
      {
        name: "Ốp lưng iPhone 15",
        description: "Ốp lưng silicone chính hãng Apple",
        price: 1290000,
        stock: 200,
        views: 450,
        discount: 0,
        imageUrl: "https://via.placeholder.com/300x300?text=Op+lung+iPhone",
        categoryId: createdCategories[3].id,
      },
      {
        name: "Cáp sạc USB-C 2m",
        description: "Cáp sạc nhanh USB-C to USB-C",
        price: 490000,
        stock: 300,
        views: 620,
        discount: 0,
        imageUrl: "https://via.placeholder.com/300x300?text=Cap+sac+USB-C",
        categoryId: createdCategories[3].id,
      },
    ];

    for (const prod of products) {
      const [product] = await Product.findOrCreate({
        where: { name: prod.name },
        defaults: prod,
      });
      console.log("✅ Product created:", product.name);
    }

    // Initialize Elasticsearch
    console.log("\n🔍 Initializing Elasticsearch...");
    const searchService = require("./services/searchService");
    
    try {
      await searchService.createIndex();
      console.log("✅ Elasticsearch index created");
      
      await searchService.syncProducts();
      console.log("✅ Products synced to Elasticsearch");
    } catch (error) {
      console.error("⚠️  Elasticsearch initialization failed:", error.message);
      console.log("Continuing without Elasticsearch...");
    }

    console.log("\n🎉 Database seeding completed!");
    console.log("\n📝 Test credentials:");
    console.log("Admin: admin@example.com / Admin@123");
    console.log("User: user@example.com / User@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();
