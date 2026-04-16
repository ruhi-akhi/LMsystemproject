import mongoose, { Schema, Document } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { 
      dbName: "learning-management"  // ✅ Fixed: Use correct database name
    });
  }
  
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}

// ─── Product Model ───────────────────────────────────────────
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  emoji: string;
  badge: string;
  available: boolean;
  qrCode: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  emoji: { type: String, default: "🍽️" },
  badge: { type: String, default: "" },
  available: { type: Boolean, default: true },
  qrCode: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Product = 
  mongoose.models.Product || 
  mongoose.model<IProduct>("Product", ProductSchema);

// ─── Order Model ─────────────────────────────────────────────
export interface IOrder extends Document {
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  bkashPaymentID?: string;
  bkashTrxID?: string;
}

const OrderSchema = new Schema<IOrder>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed"], 
    default: "pending" 
  },
  bkashPaymentID: { type: String },
  bkashTrxID: { type: String },
}, { timestamps: true });

export const Order = 
  mongoose.models.Order || 
  mongoose.model<IOrder>("Order", OrderSchema);