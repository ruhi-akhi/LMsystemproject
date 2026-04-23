import { NextRequest, NextResponse } from "next/server";
import { connectDB, DemoProduct } from "@/lib/db";

const DEMO_PRODUCTS = [
  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken pieces, cooked with traditional spices and saffron.",
    price: 250,
    emoji: "🍛",
    // --- Niche image link update kora holo ---
    image: "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-2.jpg", 
    badge: "Popular",
    qrCode: "PKT-001",
    available: true,
  },
  {
    name: "Beef Burger",
    description: "Juicy beef patty with fresh lettuce, tomato, onion, and special sauce.",
    price: 180,
    emoji: "🍔",
    // --- Niche image link update kora holo ---
    image: "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-1.jpg",
    badge: "New",
    qrCode: "PKT-002",
    available: true,
  },
  {
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella and basil leaves.",
    price: 320,
    emoji: "🍕",
    // --- Niche image link update kora holo ---
    image: "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-4.jpg",
    badge: "Chef's Special",
    qrCode: "PKT-003",
    available: true,
  },
  {
    name: "Chicken Shawarma",
    description: "Grilled chicken wrapped in soft pita bread with fresh vegetables.",
    price: 150,
    emoji: "🌯",
    // --- Niche image link update kora holo ---
    image: "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/smoothie.jpg",
    badge: "",
    qrCode: "PKT-004",
    available: true,
  },
  {
    name: "Fish & Chips",
    description: "Crispy battered fish fillet served with golden french fries.",
    price: 220,
    emoji: "🐟",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    badge: "",
    qrCode: "PKT-005",
    available: true,
  },
];

export async function POST(req: NextRequest) {
  console.log('\n🔥 === DEMO PRODUCTS API CALLED ===');
  
  try {
    await connectDB();
    
    // Purono data delete kora hochche jate nuton image ashe
    await DemoProduct.deleteMany({ 
      qrCode: { $in: DEMO_PRODUCTS.map(p => p.qrCode) } 
    });
    
    const products = await DemoProduct.insertMany(DEMO_PRODUCTS);
    console.log('🎉 SUCCESS: All steps completed\n');
    
    return NextResponse.json({ 
      message: "Demo products created successfully", 
      count: products.length 
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Select-e 'image' field-ti add kora holo jate frontend-e link jay
    const products = await DemoProduct.find({ available: true }).select('name qrCode price emoji badge image description');
    
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