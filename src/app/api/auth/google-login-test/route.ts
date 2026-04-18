import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// NO DATABASE - Pure test
export async function POST(req: NextRequest) {
  console.log("\n🔵 ========== TEST GOOGLE LOGIN (NO DB) ==========");
  
  try {
    const body = await req.json();
    console.log("📦 Received:", body);
    
    const { email, name, photoURL } = body;
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Generate fake token
    const JWT_SECRET = "test_secret_key_12345";
    const token = jwt.sign(
      { userId: "test123", email, role: "staff" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Token generated (no database needed)");
    console.log("🎉 SUCCESS!\n");

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: "test123",
        email,
        name: name || email.split('@')[0],
        role: "staff",
        photoURL: photoURL || '',
      },
    });

  } catch (error: any) {
    console.error("💥 ERROR:", error.message);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
