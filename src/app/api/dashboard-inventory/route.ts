import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Order, Product, ActivityLog, RestockQueue } from "@/models";
import { requireAuth } from "@/lib/auth";

// GET - Dashboard statistics
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const user = requireAuth(req);
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Parallel queries for better performance
    const [
      todayOrders,
      pendingOrders,
      completedOrders,
      todayRevenue,
      lowStockProducts,
      outOfStockProducts,
      recentActivities,
      totalProducts,
      totalCategories,
    ] = await Promise.all([
      // Today's orders
      Order.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow }
      }),
      
      // Pending orders
      Order.countDocuments({ status: "pending" }),
      
      // Completed orders (confirmed, shipped, delivered)
      Order.countDocuments({ 
        status: { $in: ["confirmed", "shipped", "delivered"] }
      }),
      
      // Today's revenue
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow },
            status: { $in: ["confirmed", "shipped", "delivered"] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" }
          }
        }
      ]),
      
      // Low stock products
      Product.find({
        $expr: { $lte: ["$stockQuantity", "$minimumStockThreshold"] },
        stockQuantity: { $gt: 0 },
        status: "active"
      }).populate("categoryId", "name").limit(10),
      
      // Out of stock products
      Product.countDocuments({
        stockQuantity: 0,
        status: "out_of_stock"
      }),
      
      // Recent activities
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "name")
        .lean(),
      
      // Total products
      Product.countDocuments({ status: { $ne: "inactive" } }),
      
      // Total categories (assuming Category model exists)
      Product.distinct("categoryId").then(ids => ids.length),
    ]);
    
    // Calculate order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get restock queue count
    const restockQueueCount = await RestockQueue.countDocuments({ 
      status: { $ne: "completed" } 
    });
    
    // Format recent activities
    const formattedActivities = recentActivities.map(activity => ({
      id: activity._id,
      time: activity.createdAt.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      }),
      description: activity.description,
      userName: activity.userId?.name || "Unknown User",
      entityType: activity.entityType,
    }));
    
    // Product summary for dashboard
    const productSummary = lowStockProducts.map(product => ({
      id: product._id,
      name: product.name,
      stock: product.stockQuantity,
      threshold: product.minimumStockThreshold,
      category: product.categoryId?.name || "Unknown",
      status: product.stockQuantity === 0 ? "Out of Stock" : 
              product.stockQuantity <= product.minimumStockThreshold ? "Low Stock" : "OK"
    }));
    
    return NextResponse.json({
      success: true,
      dashboard: {
        // Key metrics
        totalOrdersToday: todayOrders,
        pendingOrders,
        completedOrders,
        revenueToday: todayRevenue[0]?.totalRevenue || 0,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts,
        restockQueueCount,
        
        // Totals
        totalProducts,
        totalCategories,
        
        // Order status breakdown
        orderStatusBreakdown: orderStatusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        
        // Product summary
        productSummary,
        
        // Recent activities
        recentActivities: formattedActivities,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}