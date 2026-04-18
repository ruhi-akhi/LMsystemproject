// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";
import ActivityLog from "@/models/ActivityLog";
import RestockQueue from "@/models/RestockQueue";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = 
      cookieStore.get("token")?.value || 
      req.headers.get("authorization")?.replace("Bearer ", "");

    console.log("🔐 Dashboard API - Token exists:", !!token);

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log("✅ Token verified, userId:", decoded.userId);
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to DB
    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalProducts,
      totalCategories,
      lowStockCount,
      outOfStockCount,
      totalOrdersToday,
      pendingOrders,
      completedOrders,
      revenueToday,
      restockQueueCount,
      productSummary,
      recentActivities
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.countDocuments({
        $expr: { $lte: ["$stockQuantity", "$minimumStockThreshold"] },
        stockQuantity: { $gt: 0 }
      }),
      Product.countDocuments({ stockQuantity: 0 }),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "delivered" }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]).then(res => res[0]?.total || 0),
      RestockQueue.countDocuments({ status: "pending" }),
      Product.find()
        .sort({ stockQuantity: 1 })
        .limit(5)
        .populate("categoryId", "name")
        .then(products => products.map(p => ({
          id: p._id,
          name: p.name,
          stock: p.stockQuantity,
          threshold: p.minimumStockThreshold,
          category: (p.categoryId as any)?.name || "Uncategorized",
          status: p.stockQuantity === 0 ? "Out of Stock" : p.stockQuantity <= p.minimumStockThreshold ? "Low Stock" : "In Stock"
        }))),
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name")
        .then(logs => logs.map(l => ({
          id: l._id,
          time: new Date(l.createdAt).toLocaleTimeString(),
          description: l.description,
          userName: (l.userId as any)?.name || "System",
          entityType: l.entityType
        })))
    ]);

    return NextResponse.json({
      success: true,
      dashboard: {
        totalOrdersToday,
        pendingOrders,
        completedOrders,
        revenueToday,
        lowStockCount,
        outOfStockCount,
        restockQueueCount,
        totalProducts,
        totalCategories,
        orderStatusBreakdown: {}, // Optional
        productSummary,
        recentActivities
      }
    });
  } catch (error: any) {
    console.error("❌ Dashboard API error:", error.message);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}