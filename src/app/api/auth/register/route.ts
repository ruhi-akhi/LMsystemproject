import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import nodemailer from "nodemailer";

// Helper function to generate JWT token
function generateToken(userId: any, email: string, role: string): string {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function POST(req: NextRequest) {
  console.log("\n🔵 ========== REGISTER API CALLED ==========");
  
  try {
    console.log("📦 Step 1: Parsing request body...");
    const body = await req.json();
    console.log("✅ Body parsed:", { 
      email: body.email, 
      provider: body.provider,
      hasPassword: !!body.password,
      hasName: !!body.name
    });

    const { email, password, name, phone, photoURL, provider } = body;

    console.log("🔌 Step 2: Connecting to database...");
    console.log("   MONGODB_URI exists:", !!process.env.MONGODB_URI);
    
    try {
      await connectDB();
      console.log("✅ Database connected successfully");
    } catch (dbError: any) {
      console.error("❌ Database connection failed:", dbError.message);
      return NextResponse.json({ 
        error: "Database connection failed", 
        details: dbError.message 
      }, { status: 500 });
    }

    // ═══════════════════════════════════════════════════════
    // 🔥 GOOGLE/GITHUB LOGIN (Social OAuth)
    // ═══════════════════════════════════════════════════════
    if (provider === "google" || provider === "github") {
      console.log(`🔐 Step 3: Social login detected - ${provider}`);
      
      if (!email) {
        console.log("❌ Email missing for social login");
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }

      console.log("🔍 Step 4: Checking if user exists...");
      let user;
      try {
        user = await User.findOne({ email });
        console.log("   User found:", !!user);
      } catch (findError: any) {
        console.error("❌ Error finding user:", findError.message);
        return NextResponse.json({ 
          error: "Database query failed", 
          details: findError.message 
        }, { status: 500 });
      }

      if (user) {
        console.log("👤 Existing user - updating and returning token");
        
        // Update photoURL if provided
        if (photoURL && user.photoURL !== photoURL) {
          user.photoURL = photoURL;
          try {
            await user.save();
            console.log("📸 Photo URL updated");
          } catch (saveError: any) {
            console.error("⚠️ Photo update failed (non-critical):", saveError.message);
          }
        }

        // Generate JWT token
        console.log("🔑 Generating JWT token...");
        const token = generateToken(user._id, user.email, user.role);
        console.log("✅ Token generated successfully");

        console.log("🎉 SUCCESS: Returning existing user data\n");
        return NextResponse.json({
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
      }

      // Create new social user
      console.log("🆕 Creating new social user...");
      try {
        const newUser = new User({
          email,
          name: name || email.split('@')[0],
          photoURL: photoURL || '',
          provider: provider,
          role: 'staff',
          isVerified: true,
          status: 'active',
        });

        await newUser.save();
        console.log("✅ New social user created");

        // Generate JWT token
        console.log("🔑 Generating JWT token...");
        const token = generateToken(newUser._id, newUser.email, newUser.role);
        console.log("✅ Token generated successfully");

        console.log("🎉 SUCCESS: Returning new user data\n");
        return NextResponse.json({
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
      } catch (createError: any) {
        console.error("❌ Error creating social user:", createError.message);
        console.error("   Stack:", createError.stack);
        return NextResponse.json({ 
          error: "Failed to create user", 
          details: createError.message 
        }, { status: 500 });
      }
    }

    // ═══════════════════════════════════════════════════════
    // 📧 EMAIL/PASSWORD REGISTRATION
    // ═══════════════════════════════════════════════════════
    console.log("📧 Email/password registration");

    // Validation
    if (!email || !password) {
      console.log("❌ Email or password missing");
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already exists");
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Check phone number if provided
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        console.log("❌ Phone already registered");
        return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔒 Password hashed");

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      phone: phone || '',
      role: 'staff',
      isVerified: false,
      resetToken: otp,
      resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newUser.save();
    console.log("✅ User created successfully");

    // Send verification email
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
        subject: "🎉 Welcome to Smart Inventory - Verify Your Email",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background: #f3f4f6;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
              <h1 style="color: #E3436B; text-align: center;">Welcome! 🎉</h1>
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
      console.log("📧 Verification email sent");
    } catch (mailError: any) {
      console.error("❌ Email sending failed:", mailError.message);
      // Don't block registration if email fails
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
      email: email,
      userId: newUser._id,
    }, { status: 201 });

  } catch (err: any) {
    console.error("\n💥 ========== FATAL ERROR ==========");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("=====================================\n");
    
    return NextResponse.json({ 
      error: err.message || "Registration failed",
      errorType: err.name,
      details: err.toString()
    }, { status: 500 });
  }
}
