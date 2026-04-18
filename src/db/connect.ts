import mongoose from "mongoose";
import dns from "dns";

// ✅ Force IPv4 — secureConnect timeout fix
dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing in .env.local");

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}
declare global { var mongooseCache: MongooseCache; }

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, 
      socketTimeoutMS: 45000,
      family: 4,
    };

    console.log("🔌 Attempting MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ MongoDB Connected to:", m.connection.name);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}