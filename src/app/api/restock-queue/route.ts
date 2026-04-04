import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import RestockQueue from "@/models/RestockQueue";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const priority = searchParams.get("priority") || "";
    const status = searchParams.get("status") || "";

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { supplier: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    if (priority) {
      query.priority = priority;
    }

    if (status) {
      query.status = status;
    }

    // Get restock items
    const items = await RestockQueue.find(query)
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Error fetching restock queue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restock queue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      productId,
      productName,
      currentStock,
      minStockLevel,
      suggestedQuantity,
      priority = "medium",
      supplier,
      estimatedCost,
      notes,
    } = body;

    // Validate required fields
    if (!productId || !productName || currentStock === undefined || minStockLevel === undefined || !suggestedQuantity || !estimatedCost) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const minimumThreshold = Number(minStockLevel);
    if (Number.isNaN(minimumThreshold)) {
      return NextResponse.json(
        { success: false, error: "minStockLevel must be a valid number" },
        { status: 400 }
      );
    }

    // Check if item already exists in queue
    const existingItem = await RestockQueue.findOne({
      productId,
      status: { $in: ["pending", "ordered"] }
    });

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: "Product already in restock queue" },
        { status: 400 }
      );
    }

    // Create restock queue item
    const restockItem = new RestockQueue({
      productId,
      productName,
      currentStock,
      minimumThreshold,
      requestedQuantity: suggestedQuantity,
      priority,
      supplier,
      estimatedCost,
      notes,
      status: "pending",
    });

    await restockItem.save();

    return NextResponse.json({
      success: true,
      item: restockItem,
    });
  } catch (error) {
    console.error("Error creating restock item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create restock item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const restockItem = await RestockQueue.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!restockItem) {
      return NextResponse.json(
        { success: false, error: "Restock item not found" },
        { status: 404 }
      );
    }

    // If status is "received", update product stock
    if (status === "received") {
      await Product.findByIdAndUpdate(
        restockItem.productId,
        {
          $inc: { quantity: restockItem.suggestedQuantity },
          updatedAt: new Date(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      item: restockItem,
    });
  } catch (error) {
    console.error("Error updating restock item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update restock item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing item ID" },
        { status: 400 }
      );
    }

    const restockItem = await RestockQueue.findByIdAndDelete(id);

    if (!restockItem) {
      return NextResponse.json(
        { success: false, error: "Restock item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Restock item removed successfully",
    });
  } catch (error) {
    console.error("Error deleting restock item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete restock item" },
      { status: 500 }
    );
  }
}