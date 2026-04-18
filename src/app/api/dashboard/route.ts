// src/app/api/dashboard/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Transaction from "@/models/Transaction";
import Notification from "@/models/Notification";

async function getAuthUser(req: NextRequest) {
  // cookie অথবা Authorization header দুটোই check করো
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    return jwt.verify(token, secret) as { userId: string; role: string };
  } catch (err) {
    console.error("JWT Verify Error in Dashboard:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const user = await User.findById(auth.userId)
      .select("-password -resetToken -resetTokenExpiry");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ── ALL ROLES (Inventory System) ──────────────────────────────────────────────
    const [
      totalProducts,
      totalOrders,
      lowStockProducts,
      recentOrders,
      unreadCount
    ] = await Promise.all([
      Product.countDocuments({ status: "active" }),
      Order.countDocuments(),
      Product.countDocuments({
        $expr: { $lte: ["$stockQuantity", "$minimumStockThreshold"] },
        status: "active"
      }),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber customerName totalAmount status createdAt"),

      Notification.countDocuments({
        $or: [
          { userId: user._id, isRead: false },
          { isBroadcast: true, targetRole: { $in: ["all", user.role] }, isRead: false },
        ],
      }),
    ]);

    // Calculate today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $in: ["confirmed", "shipped", "delivered"] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL || "",
        role: user.role,
      },
      stats: {
        totalProducts,
        totalOrders,
        lowStockProducts,
        todayRevenue: todayRevenue[0]?.total || 0,
      },
      recentOrders,
      unreadNotifications: unreadCount,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}