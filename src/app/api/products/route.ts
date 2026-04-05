import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ActivityLog from "@/models/ActivityLog";
import RestockQueue from "@/models/RestockQueue";
import { requireAuth } from "@/lib/auth";

// GET - List products with filters (no auth required for listing)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100"); // ✅ সব product dropdown এ আসবে
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const lowStock = searchParams.get("lowStock") === "true";
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: any = {};
    if (category) filter.categoryId = category;
    if (status) filter.status = status;
    if (lowStock) {
      filter.$expr = { $lte: ["$stockQuantity", "$minimumStockThreshold"] };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const user = requireAuth(req);
    const body = await req.json();
    const { name, categoryId, price, stockQuantity, minimumStockThreshold, description, imageUrl, sku } = body;
    
    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (price === undefined || price < 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }
    if (stockQuantity === undefined || stockQuantity < 0) {
      return NextResponse.json({ error: "Valid stock quantity is required" }, { status: 400 });
    }
    if (minimumStockThreshold === undefined || minimumStockThreshold < 0) {
      return NextResponse.json({ error: "Valid minimum stock threshold is required" }, { status: 400 });
    }
    
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    // Check SKU uniqueness if provided
    if (sku?.trim()) {
      const existingSku = await Product.findOne({ sku: sku.trim() });
      if (existingSku) {
        return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
      }
    }
    
    const product = await Product.create({
      name: name.trim(),
      categoryId,
      price,
      stockQuantity,
      minimumStockThreshold,
      description: description?.trim() || "",
      imageUrl: imageUrl?.trim() || "",
      sku: sku?.trim() || undefined,
    });
    
    // Populate category for response
    await product.populate("categoryId", "name");
    
    // Check if needs to be added to restock queue
    if (product.isLowStock()) {
      await (RestockQueue as any).addToQueue(
        product._id.toString(),
        product.name,
        product.stockQuantity,
        product.minimumStockThreshold,
        user.userId
      );
    }
    
    // Log activity
    await (ActivityLog as any).logActivity(
      "product_created",
      `Created product: ${product.name}`,
      user.userId,
      "User",
      "product",
      product._id
    );
    
    return NextResponse.json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}