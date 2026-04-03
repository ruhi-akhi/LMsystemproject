import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { ActivityLog } from "@/models/ActivityLog";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const entityType = searchParams.get("entityType") || "";
    const dateRange = searchParams.get("dateRange") || "";

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { action: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { entityName: { $regex: search, $options: "i" } },
      ];
    }

    if (entityType) {
      query.entityType = entityType;
    }

    if (dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "yesterday":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          query.createdAt = {
            $gte: startDate,
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          };
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          query.createdAt = { $gte: startDate };
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          query.createdAt = { $gte: startDate };
          break;
        default:
          break;
      }

      if (dateRange === "today") {
        query.createdAt = { $gte: startDate };
      }
    }

    // Get total count
    const total = await ActivityLog.countDocuments(query);

    // Get activities with pagination
    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching activity log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity log" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      action,
      description,
      userId,
      userName,
      userRole,
      entityType,
      entityId,
      entityName,
      metadata,
      ipAddress,
      userAgent,
    } = body;

    // Validate required fields
    if (!action || !description || !userId || !userName || !userRole || !entityType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create activity log entry
    const activityLog = new ActivityLog({
      action,
      description,
      userId,
      userName,
      userRole,
      entityType,
      entityId,
      entityName,
      metadata,
      ipAddress,
      userAgent,
    });

    await activityLog.save();

    return NextResponse.json({
      success: true,
      activity: activityLog,
    });
  } catch (error) {
    console.error("Error creating activity log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create activity log" },
      { status: 500 }
    );
  }
}