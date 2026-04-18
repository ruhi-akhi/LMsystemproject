import { NextRequest, NextResponse } from "next/server";
import { connectDB, DemoProduct, DemoOrder } from "@/lib/db";

const BKASH_BASE_URL = "https://tokenized.sandbox.bka.sh/v1.2.0-beta";

async function getBkashToken(): Promise<string> {
  const res = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: process.env.BKASH_USERNAME!,
      password: process.env.BKASH_PASSWORD!,
    },
    body: JSON.stringify({
      app_key: process.env.BKASH_APP_KEY!,
      app_secret: process.env.BKASH_APP_SECRET!,
    }),
  });
  
  const data = await res.json();
  return data.id_token;
}

// ─── GET /api/scan?type=product&id=PKT-001 ──────────────────
// ─── GET /api/scan?type=callback&paymentID=...&status=... ───
export async function GET(req: NextRequest) {
  await connectDB();
  
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  // ── Fetch product by QR code
  if (type === "product") {
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    
    const product = await DemoProduct.findOne({ qrCode: id });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (!product.available) return NextResponse.json({ error: "Product unavailable" }, { status: 410 });
    
    return NextResponse.json({ product });
  }

  // ── bKash callback after payment
  if (type === "callback") {
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");
    const appURL = process.env.NEXT_PUBLIC_APP_URL;

    if (status === "cancel" || status === "failure") {
      const order = await DemoOrder.findOneAndUpdate(
        { bkashPaymentID: paymentID },
        { paymentStatus: "failed" }
      );
      return NextResponse.redirect(`${appURL}/scan?payment=failed&order=${order?._id}`);
    }

    try {
      const token = await getBkashToken();
      const executeRes = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: token,
          "x-app-key": process.env.BKASH_APP_KEY!,
        },
        body: JSON.stringify({ paymentID }),
      });

      const executeData = await executeRes.json();

      if (executeData.statusCode === "0000") {
        const order = await DemoOrder.findOneAndUpdate(
          { bkashPaymentID: paymentID },
          { paymentStatus: "paid", bkashTrxID: executeData.trxID },
          { new: true }
        );
        return NextResponse.redirect(`${appURL}/scan?payment=success&order=${order?._id}&trx=${executeData.trxID}`);
      } else {
        const order = await DemoOrder.findOneAndUpdate(
          { bkashPaymentID: paymentID },
          { paymentStatus: "failed" }
        );
        return NextResponse.redirect(`${appURL}/scan?payment=failed&order=${order?._id}`);
      }
    } catch {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/scan?payment=error`);
    }
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// ─── POST /api/scan  (body: { type: "order" | "bkash", ...}) ─
export async function POST(req: NextRequest) {
  await connectDB();
  
  const body = await req.json();
  const { type } = body;

  // ── Create order
  if (type === "order") {
    const { productId, productName, quantity, totalPrice, paymentMethod } = body;
    
    if (!productId || !productName || !quantity || !totalPrice || !paymentMethod) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const order = await DemoOrder.create({
      productId,
      productName,
      quantity,
      totalPrice,
      paymentMethod,
      paymentStatus: "pending",
    });

    return NextResponse.json({ orderId: order._id, order }, { status: 201 });
  }

  // ── Initiate bKash payment
  if (type === "bkash") {
    const { orderId, amount } = body;
    
    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing orderId or amount" }, { status: 400 });
    }

    try {
      const token = await getBkashToken();
      const callbackURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/scan?type=callback`;

      const paymentRes = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: token,
          "x-app-key": process.env.BKASH_APP_KEY!,
        },
        body: JSON.stringify({
          mode: "0011",
          payerReference: orderId,
          callbackURL,
          amount: String(amount),
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: orderId,
        }),
      });

      const paymentData = await paymentRes.json();

      if (paymentData.statusCode !== "0000") {
        return NextResponse.json({ error: paymentData.statusMessage }, { status: 400 });
      }

      await DemoOrder.findByIdAndUpdate(orderId, { bkashPaymentID: paymentData.paymentID });

      return NextResponse.json({
        bkashURL: paymentData.bkashURL,
        paymentID: paymentData.paymentID,
      });
    } catch {
      return NextResponse.json({ error: "bKash error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}