import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Notification from "@/models/Notification";

async function getAuthUser(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    return jwt.verify(token, secret) as { userId: string; role: string };
  } catch {
    return null;
  }
}

async function safeCount<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(auth.userId).select(
      "-password -resetToken -resetTokenExpiry"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalProducts,
      totalOrders,
      lowStockProducts,
      recentOrders,
      unreadCount,
      todayRevenue,
    ] = await Promise.all([
      safeCount(() => Product.countDocuments(), 0),
      safeCount(() => Order.countDocuments(), 0),
      safeCount(
        () =>
          Product.countDocuments({
            $expr: { $lte: ["$stockQuantity", "$minimumStockThreshold"] },
          }),
        0
      ),
      safeCount(
        () =>
          Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("orderNumber customerName totalAmount status createdAt")
            .lean(),
        []
      ),
      safeCount(
        () =>
          Notification.countDocuments({
            userId: user._id,
            isRead: false,
          }),
        0
      ),
      safeCount(
        () =>
          Order.aggregate([
            {
              $match: {
                createdAt: { $gte: today, $lt: tomorrow },
                status: { $in: ["confirmed", "shipped", "delivered"] },
              },
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ]),
        []
      ),
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
    console.error("Dashboard API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
