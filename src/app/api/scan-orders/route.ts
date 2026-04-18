import { NextRequest, NextResponse } from "next/server";
import { connectDB, DemoOrder } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const filter: any = {};

    // Map status filter
    if (status) {
      if (status === "confirmed") filter.paymentStatus = "paid";
      else if (status === "pending") filter.paymentStatus = "pending";
      else if (status === "cancelled") filter.paymentStatus = "failed";
    }

    // Search filter
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { paymentMethod: { $regex: search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      DemoOrder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DemoOrder.countDocuments(filter),
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
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}