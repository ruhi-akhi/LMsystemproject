import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";

// Generate JWT token
function generateToken(userId: any, email: string, role: string): string {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" });
}

export async function POST(req: NextRequest) {
  console.log("\n🔵 ========== GOOGLE LOGIN API ==========");
  
  try {
    // Parse request
    const body = await req.json();
    console.log("📦 Received:", { email: body.email, hasName: !!body.name });
    
    const { email, name, photoURL } = body;
    
    if (!email) {
      console.log("❌ Email missing");
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    // Find or create user
    console.log("🔍 Finding user...");
    let user = await User.findOne({ email });

    if (user) {
      console.log("👤 User exists, updating...");
      if (photoURL) user.photoURL = photoURL;
      await user.save();
    } else {
      console.log("🆕 Creating new user...");
      user = new User({
        email,
        name: name || email.split('@')[0],
        photoURL: photoURL || '',
        provider: 'google',
        role: 'staff',
        isVerified: true,
        status: 'active',
      });
      await user.save();
      console.log("✅ User created");
    }

    // Generate token
    console.log("🔑 Generating token...");
    const token = generateToken(user._id, user.email, user.role);

    console.log("🎉 SUCCESS!\n");
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        photoURL: user.photoURL,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("\n💥 ERROR:", error.message);
    console.error("Stack:", error.stack);
    console.error("=====================================\n");
    
    return NextResponse.json({ 
      error: error.message || "Login failed",
      details: error.toString()
    }, { status: 500 });
  }
}
