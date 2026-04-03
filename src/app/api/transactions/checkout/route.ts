// src/app/api/transactions/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function getDecoded(req: NextRequest) {
  let token = req.cookies.get("token")?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };
  } catch {
    return null;
  }
}

// ─── POST — Create Order with Payment ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized - Please login first" }, { status: 401 });
    }

    const body = await req.json();
    const { items, customerName, customerEmail, customerPhone, notes } = body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 });
    }

    if (!customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    // Validate and process items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId || !mongoose.isValidObjectId(item.productId)) {
        return NextResponse.json({ error: "Valid productId required for all items" }, { status: 400 });
      }

      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json({ error: "Valid quantity required for all items" }, { status: 400 });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      if (product.status !== "active") {
        return NextResponse.json({ error: `Product is not available: ${product.name}` }, { status: 400 });
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Only ${product.stockQuantity} available` 
        }, { status: 400 });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal,
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
      items: orderItems,
      totalAmount,
      status: "pending",
      notes: notes?.trim() || "",
      createdBy: decoded.userId,
    });

    // If total amount is 0 (free items), complete the order immediately
    if (totalAmount === 0) {
      // Update stock quantities
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity }
        });
      }

      // Update order status
      await order.updateStatus("confirmed");

      return NextResponse.json({ 
        success: true, 
        free: true, 
        orderId: order._id,
        orderNumber: order.orderNumber 
      });
    }

    // Create Stripe PaymentIntent for paid orders
    const priceInUSD = parseFloat((totalAmount / 110).toFixed(2));
    const amountInCents = Math.max(Math.round(priceInUSD * 100), 50);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: customerName,
      },
      automatic_payment_methods: { enabled: true },
    });

    // Create transaction record
    const transaction = await Transaction.create({
      type: "payment",
      amount: totalAmount,
      netAmount: totalAmount * 0.95, // 5% platform fee
      platformFee: totalAmount * 0.05,
      currency: "BDT",
      status: "pending",
      studentId: decoded.userId, // Keep field name for compatibility
      courseId: order._id, // Use orderId in courseId field for compatibility
      paymentMethod: "card",
      paymentId: paymentIntent.id,
      description: `Order payment: ${order.orderNumber}`,
      courseName: `Order ${order.orderNumber}`, // Keep field name for compatibility
      instructorName: customerName,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id,
      orderId: order._id,
      orderNumber: order.orderNumber,
      amount: totalAmount,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── GET — Payment Verification ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get("payment_intent");
    const orderId = searchParams.get("orderId");

    if (!paymentIntentId || !orderId) {
      return NextResponse.json({ error: "payment_intent and orderId required" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ success: false, status: paymentIntent.status });
    }

    // Update transaction status
    await Transaction.findOneAndUpdate(
      { paymentId: paymentIntentId },
      { status: "completed", processedAt: new Date() }
    );

    // Get order and update stock
    const order = await Order.findById(orderId);
    if (order && order.status === "pending") {
      // Update stock quantities
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity }
        });
      }

      // Update order status
      await order.updateStatus("confirmed");

      // Log activity
      const ActivityLog = (await import("@/models/ActivityLog")).default;
      await (ActivityLog as any).logActivity(
        "order_confirmed",
        `Order ${order.orderNumber} confirmed after payment`,
        decoded.userId,
        "User",
        "order",
        order._id
      );
    }

    return NextResponse.json({ 
      success: true, 
      status: "succeeded",
      orderNumber: order?.orderNumber 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}