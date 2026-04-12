import { NextRequest, NextResponse } from "next/server";
import { connectDB, Product } from "@/lib/db";

const DEMO_PRODUCTS = [
  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken pieces, cooked with traditional spices and saffron. Served with raita and boiled egg.",
    price: 250,
    emoji: "🍛",
    badge: "Popular",
    qrCode: "PKT-001",
    available: true,
  },
  {
    name: "Beef Burger",
    description: "Juicy beef patty with fresh lettuce, tomato, onion, and special sauce in a toasted bun. Served with crispy fries.",
    price: 180,
    emoji: "🍔",
    badge: "New",
    qrCode: "PKT-002",
    available: true,
  },
  {
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella, tomato sauce, and basil leaves on a thin crispy crust.",
    price: 320,
    emoji: "🍕",
    badge: "Chef's Special",
    qrCode: "PKT-003",
    available: true,
  },
  {
    name: "Chicken Shawarma",
    description: "Grilled chicken wrapped in soft pita bread with fresh vegetables, pickles, and garlic sauce.",
    price: 150,
    emoji: "🌯",
    badge: "",
    qrCode: "PKT-004",
    available: true,
  },
  {
    name: "Fish & Chips",
    description: "Crispy battered fish fillet served with golden french fries, coleslaw, and tartar sauce.",
    price: 220,
    emoji: "🐟",
    badge: "",
    qrCode: "PKT-005",
    available: true,
  },
];

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Clear existing demo products
    await Product.deleteMany({ qrCode: { $in: DEMO_PRODUCTS.map(p => p.qrCode) } });
    
    // Insert new demo products
    const products = await Product.insertMany(DEMO_PRODUCTS);
    
    return NextResponse.json({ 
      message: "Demo products created successfully", 
      count: products.length,
      products: products.map(p => ({ 
        name: p.name, 
        qrCode: p.qrCode, 
        scanUrl: `${process.env.NEXT_PUBLIC_APP_URL}/scan?product=${p.qrCode}` 
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const products = await Product.find({ available: true }).select('name qrCode price emoji badge');
    
    return NextResponse.json({ 
      products: products.map(p => ({
        ...p.toObject(),
        scanUrl: `${process.env.NEXT_PUBLIC_APP_URL}/scan?product=${p.qrCode}`
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}