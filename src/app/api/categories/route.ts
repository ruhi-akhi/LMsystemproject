import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Category from "@/models/Category";
import ActivityLog from "@/models/ActivityLog";
import { authenticateRequest } from "@/lib/auth";
import { ensureDefaultCategories } from "@/lib/default-categories";

// GET - List all categories (auto-seeds defaults if empty)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    const skipSeed = searchParams.get("skipSeed") === "true";

    let categories = skipSeed
      ? await Category.find(activeOnly ? { isActive: true } : {}).sort({ name: 1 }).lean()
      : await ensureDefaultCategories();

    if (activeOnly) {
      categories = categories.filter((c) => c.isActive !== false);
    }

    return NextResponse.json({
      success: true,
      categories: categories.map((c) => ({
        ...c,
        _id: String(c._id),
      })),
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

    const user = authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
    });

    try {
      await (ActivityLog as any).logActivity(
        "category_created",
        `Created category: ${category.name}`,
        user.userId,
        "User",
        "category",
        String(category._id)
      );
    } catch (logErr) {
      console.warn("Activity log skipped:", logErr);
    }

    return NextResponse.json({
      success: true,
      category: { ...category.toObject(), _id: String(category._id) },
      message: "Category created successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}