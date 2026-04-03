import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Category from "@/models/Category";
import ActivityLog from "@/models/ActivityLog";
import { requireAuth } from "@/lib/auth";

// GET - List all categories
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    
    const filter = activeOnly ? { isActive: true } : {};
    const categories = await Category.find(filter)
      .sort({ name: 1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      categories,
      total: categories.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const user = requireAuth(req);
    const body = await req.json();
    const { name, description } = body;
    
    if (!name?.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    
    // Check if category already exists
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }
    
    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
    });
    
    // Log activity
    await (ActivityLog as any).logActivity(
      "category_created",
      `Created category: ${category.name}`,
      user.userId,
      "User", // We'll get actual name from user lookup
      "category",
      category._id
    );
    
    return NextResponse.json({
      success: true,
      category,
      message: "Category created successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}