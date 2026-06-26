import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";

function generateToken(userId: string, email: string, role: string): string {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, photoURL } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ email });

    if (user) {
      if (photoURL) user.photoURL = photoURL;
      await user.save();
    } else {
      user = new User({
        email,
        name: name || email.split("@")[0],
        photoURL: photoURL || "",
        provider: "google",
        role: "staff",
        isVerified: true,
        status: "active",
      });
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("Google login error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
