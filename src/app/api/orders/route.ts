import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ActivityLog from "@/models/ActivityLog";
import RestockQueue from "@/models/RestockQueue";
import { requireAuth } from "@/lib/auth";

// GET - List orders with filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const today = searchParams.get("today") === "true";
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
      ];
    }
    if (today) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);
      filter.createdAt = { $gte: todayStart, $lt: todayEnd };
    }
    
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);
    
    return NextResponse.json({
      success: true,
      orders,
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

// POST - Create new order
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const user = requireAuth(req);
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, items, notes } = body;
    
    // Validation
    if (!customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 });
    }
    
    // Validate and process items
    const processedItems = [];
    const productIds = new Set();
    
    for (const item of items) {
      const { productId, quantity } = item;
      
      if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
      }
      
      // Check for duplicate products
      if (productIds.has(productId)) {
        return NextResponse.json({ error: "This product is already added to the order." }, { status: 400 });
      }
      productIds.add(productId);
      
      // Get product details
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 404 });
      }
      
      // Check if product is active
      if (product.status !== "active") {
        return NextResponse.json({ error: `This product is currently unavailable: ${product.name}` }, { status: 400 });
      }
      
      // Check stock availability
      if (product.stockQuantity < quantity) {
        return NextResponse.json({ 
          error: `Only ${product.stockQuantity} items available in stock for ${product.name}` 
        }, { status: 400 });
      }
      
      const subtotal = quantity * product.price;
      processedItems.push({
        productId: product._id,
        productName: product.name,
        quantity,
        price: product.price,
        subtotal,
      });
    }
    
    // Generate order number
    const orderNumber = (Order as any).generateOrderNumber();
    
    // Create order
    const order = await Order.create({
      orderNumber,
      customerName: customerName.trim(),
      customerEmail: customerEmail?.trim() || "",
      customerPhone: customerPhone?.trim() || "",
      items: processedItems,
      notes: notes?.trim() || "",
      createdBy: user.userId,
    });
    
    // Deduct stock for each item
    for (const item of processedItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity -= item.quantity;
        await product.save();
        
        // Check if needs to be added to restock queue
        if (product.isLowStock() || product.stockQuantity === 0) {
          await (RestockQueue as any).addToQueue(
            product._id.toString(),
            product.name,
            product.stockQuantity,
            product.minimumStockThreshold,
            user.userId
          );
        }
        
        // Log stock update
        await (ActivityLog as any).logActivity(
          "stock_updated",
          `Stock reduced for ${product.name}: ${item.quantity} units (Order: ${orderNumber})`,
          user.userId,
          "User",
          "stock",
          product._id,
          { orderNumber, quantityReduced: item.quantity, newStock: product.stockQuantity }
        );
      }
    }
    
    // Log order creation
    await (ActivityLog as any).logActivity(
      "order_created",
      `Order ${orderNumber} created for ${customerName}`,
      user.userId,
      "User",
      "order",
      order._id,
      { orderNumber, totalAmount: order.totalAmount, itemCount: order.items.length }
    );
    
    // Populate for response
    await order.populate("createdBy", "name");
    
    return NextResponse.json({
      success: true,
      order,
      message: "Order created successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}