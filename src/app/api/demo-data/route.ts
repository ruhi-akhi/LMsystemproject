import { NextRequest, NextResponse } from "next/server";
import { createDemoData, checkDemoDataExists } from "@/lib/demo-data";

// GET - Check if demo data exists
export async function GET(req: NextRequest) {
  try {
    const status = await checkDemoDataExists();
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create demo data
export async function POST(req: NextRequest) {
  try {
    const result = await createDemoData();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}