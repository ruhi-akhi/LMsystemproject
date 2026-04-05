import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ActivityLog from "@/models/ActivityLog";
import RestockQueue from "@/models/RestockQueue";
import { requireAuth } from "@/lib/auth";

// GET - List orders OR get single order
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // GET single order
    if (id) {
      const order = await Order.findById(id).populate("createdBy", "name");

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        order,
      });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const today = searchParams.get("today") === "true";

    const skip = (page - 1) * limit;

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

    if (!customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 });
    }

    const processedItems: any[] = [];
    const productIds = new Set();

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
      }

      if (productIds.has(productId)) {
        return NextResponse.json({ error: "Duplicate product in order" }, { status: 400 });
      }

      productIds.add(productId);

      const product = await Product.findById(productId);

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      if (product.stockQuantity < quantity) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
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

    const orderNumber = (Order as any).generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items: processedItems,
      notes,
      createdBy: user.userId,
    });

    // Deduct stock
    for (const item of processedItems) {
      const product = await Product.findById(item.productId);

      if (product) {
        product.stockQuantity -= item.quantity;
        await product.save();

        if (product.isLowStock?.()) {
          await (RestockQueue as any).addToQueue(
            product._id.toString(),
            product.name,
            product.stockQuantity,
            product.minimumStockThreshold,
            user.userId
          );
        }
      }
    }

    await (ActivityLog as any).logActivity(
      "order_created",
      `Order ${orderNumber} created`,
      user.userId,
      "User",
      "order",
      order._id
    );

    return NextResponse.json({
      success: true,
      order,
      message: "Order created successfully",
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - Update order status
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const user = requireAuth(req);
    const body = await req.json();

    const { orderId, status } = body;

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    await (ActivityLog as any).logActivity(
      "order_status_updated",
      `Order ${order.orderNumber} updated to ${status}`,
      user.userId,
      "User",
      "order",
      order._id
    );

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Cancel order
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const user = requireAuth(req);
    const body = await req.json();

    const { orderId } = body;

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "cancelled") {
      return NextResponse.json({ error: "Order already cancelled" }, { status: 400 });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (product) {
        product.stockQuantity += item.quantity;
        await product.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled",
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete order
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const user = requireAuth(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await (ActivityLog as any).logActivity(
      "order_deleted",
      `Order ${order.orderNumber} deleted`,
      user.userId,
      "User",
      "order",
      order._id
    );

    return NextResponse.json({
      success: true,
      message: "Order deleted",
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}