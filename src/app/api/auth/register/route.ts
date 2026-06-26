import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import nodemailer from "nodemailer";

function generateToken(userId: string, email: string, role: string): string {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone, photoURL, provider } = body;

    try {
      await connectDB();
    } catch (dbError: unknown) {
      const message = dbError instanceof Error ? dbError.message : "Connection failed";
      console.error("Database connection failed:", message);
      return NextResponse.json({ error: "Database connection failed", details: message }, { status: 500 });
    }

    if (provider === "google" || provider === "github") {
      if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }

      let user;
      try {
        user = await User.findOne({ email });
      } catch (findError: unknown) {
        const message = findError instanceof Error ? findError.message : "Query failed";
        console.error("Error finding user:", message);
        return NextResponse.json({ error: "Database query failed", details: message }, { status: 500 });
      }

      if (user) {
        if (photoURL && user.photoURL !== photoURL) {
          user.photoURL = photoURL;
          try {
            await user.save();
          } catch (saveError: unknown) {
            const message = saveError instanceof Error ? saveError.message : "Save failed";
            console.error("Photo update failed:", message);
          }
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
        }, { status: 200 });
        setAuthCookie(response, token);
        return response;
      }

      try {
        const newUser = new User({
          email,
          name: name || email.split("@")[0],
          photoURL: photoURL || "",
          provider,
          role: "staff",
          isVerified: true,
          status: "active",
        });

        await newUser.save();
        const token = generateToken(newUser._id.toString(), newUser.email, newUser.role);
        const response = NextResponse.json({
          success: true,
          token,
          user: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            photoURL: newUser.photoURL,
          },
        }, { status: 201 });
        setAuthCookie(response, token);
        return response;
      } catch (createError: unknown) {
        const message = createError instanceof Error ? createError.message : "Create failed";
        console.error("Error creating social user:", message);
        return NextResponse.json({ error: "Failed to create user", details: message }, { status: 500 });
      }
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
      phone: phone || "",
      role: "staff",
      isVerified: false,
      resetToken: otp,
      resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newUser.save();

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Smart Inventory" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Welcome to Smart Inventory - Verify Your Email",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background: #f3f4f6;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
              <h1 style="color: #E3436B; text-align: center;">Welcome!</h1>
              <p style="font-size: 16px; color: #333;">Your verification code is:</p>
              <div style="background: linear-gradient(135deg, #832388, #F0772F); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h2 style="color: white; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h2>
              </div>
              <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
            </div>
          </body>
          </html>
        `,
      });
    } catch (mailError: unknown) {
      const message = mailError instanceof Error ? mailError.message : "Email failed";
      console.error("Email sending failed:", message);
      return NextResponse.json({
        success: true,
        requireOtp: true,
        message: "Account created but email failed. Contact admin for verification.",
        userId: newUser._id,
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      requireOtp: true,
      message: "Registration successful! Check your email.",
      email,
      userId: newUser._id,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    console.error("Registration error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
