// src/lib/db.ts
import mongoose from "mongoose";

export { connectDB } from "@/db/connect";

// Demo Product Schema
const demoProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    emoji: { type: String, default: "📦" },
    badge: { type: String, default: "" },
    qrCode: { type: String, required: true, unique: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DemoProduct = mongoose.models.DemoProduct || mongoose.model("DemoProduct", demoProductSchema, "demo_products");

// Demo Order Schema
const demoOrderSchema = new mongoose.Schema(
  {
    productId: { type: String },
    productName: { type: String },
    quantity: { type: Number },
    totalPrice: { type: Number },
    paymentMethod: { type: String },
    paymentStatus: { type: String },
    bkashPaymentID: { type: String },
    bkashTrxID: { type: String },
  },
  { timestamps: true }
);

export const DemoOrder = mongoose.models.DemoOrder || mongoose.model("DemoOrder", demoOrderSchema, "demo_orders");

// TypeScript global type
declare global {
  var mongoose: any;
}