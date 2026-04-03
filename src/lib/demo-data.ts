import bcrypt from "bcryptjs";
import { connectDB } from "@/db/connect";
import { User, Category, Product } from "@/models";

export async function createDemoData() {
  try {
    await connectDB();
    
    // Create demo admin user
    const existingAdmin = await User.findOne({ email: "admin@inventory.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      await User.create({
        name: "Demo Admin",
        email: "admin@inventory.com",
        password: hashedPassword,
        role: "admin",
        provider: "credentials",
        isVerified: true,
        status: "active",
      });
      console.log("✅ Demo admin user created");
    }
    
    // Create demo categories
    const categories = [
      { name: "Electronics", description: "Electronic devices and gadgets" },
      { name: "Clothing", description: "Apparel and fashion items" },
      { name: "Books", description: "Books and educational materials" },
      { name: "Home & Garden", description: "Home improvement and garden supplies" },
    ];
    
    for (const categoryData of categories) {
      const existing = await Category.findOne({ name: categoryData.name });
      if (!existing) {
        await Category.create(categoryData);
        console.log(`✅ Demo category created: ${categoryData.name}`);
      }
    }
    
    // Create demo products
    const electronicsCategory = await Category.findOne({ name: "Electronics" });
    const clothingCategory = await Category.findOne({ name: "Clothing" });
    const booksCategory = await Category.findOne({ name: "Books" });
    
    if (electronicsCategory && clothingCategory && booksCategory) {
      const products = [
        {
          name: "iPhone 13",
          categoryId: electronicsCategory._id,
          price: 85000,
          stockQuantity: 3,
          minimumStockThreshold: 5,
          description: "Latest iPhone with advanced features",
          sku: "IPH13-001",
        },
        {
          name: "Samsung Galaxy S21",
          categoryId: electronicsCategory._id,
          price: 75000,
          stockQuantity: 8,
          minimumStockThreshold: 5,
          description: "High-performance Android smartphone",
          sku: "SAM-S21-001",
        },
        {
          name: "MacBook Pro",
          categoryId: electronicsCategory._id,
          price: 150000,
          stockQuantity: 2,
          minimumStockThreshold: 3,
          description: "Professional laptop for developers",
          sku: "MBP-001",
        },
        {
          name: "Cotton T-Shirt",
          categoryId: clothingCategory._id,
          price: 1200,
          stockQuantity: 25,
          minimumStockThreshold: 10,
          description: "Comfortable cotton t-shirt",
          sku: "TSH-COT-001",
        },
        {
          name: "Jeans",
          categoryId: clothingCategory._id,
          price: 2500,
          stockQuantity: 15,
          minimumStockThreshold: 8,
          description: "Classic blue jeans",
          sku: "JNS-001",
        },
        {
          name: "JavaScript Guide",
          categoryId: booksCategory._id,
          price: 800,
          stockQuantity: 0,
          minimumStockThreshold: 5,
          description: "Complete guide to JavaScript programming",
          sku: "BK-JS-001",
        },
        {
          name: "React Handbook",
          categoryId: booksCategory._id,
          price: 1200,
          stockQuantity: 12,
          minimumStockThreshold: 5,
          description: "Learn React from basics to advanced",
          sku: "BK-REACT-001",
        },
      ];
      
      for (const productData of products) {
        const existing = await Product.findOne({ sku: productData.sku });
        if (!existing) {
          await Product.create(productData);
          console.log(`✅ Demo product created: ${productData.name}`);
        }
      }
    }
    
    console.log("✅ Demo data creation completed");
    return { success: true, message: "Demo data created successfully" };
  } catch (error: any) {
    console.error("❌ Demo data creation failed:", error.message);
    return { success: false, error: error.message };
  }
}

export async function checkDemoDataExists() {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ email: "admin@inventory.com" });
    const categoriesCount = await Category.countDocuments();
    const productsCount = await Product.countDocuments();
    
    return {
      adminExists: !!adminExists,
      categoriesCount,
      productsCount,
      hasData: !!adminExists && categoriesCount > 0 && productsCount > 0,
    };
  } catch (error: any) {
    return {
      adminExists: false,
      categoriesCount: 0,
      productsCount: 0,
      hasData: false,
      error: error.message,
    };
  }
}