"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  badge: string;
};

type Screen = "loading" | "error" | "product" | "payment" | "success";

const PAYMENT_METHODS = [
  { id: "bkash",  label: "bKash",            bg: "#e2136e", short: "bK" },
  { id: "nagad",  label: "Nagad",            bg: "#f7941d", short: "Ng" },
  { id: "cash",   label: "Cash on Delivery", emoji: "💵"               },
];

export default function ScanPage() {
  const searchParams   = useSearchParams();
  const productId      = searchParams.get("product");
  const paymentStatus  = searchParams.get("payment");
  const orderId        = searchParams.get("order");
  const trxId          = searchParams.get("trx");

  const [screen,     setScreen]     = useState<Screen>("loading");
  const [product,    setProduct]    = useState<Product | null>(null);
  const [qty,        setQty]        = useState(1);
  const [method,     setMethod]     = useState("bkash");
  const [error,      setError]      = useState("");
  const [processing, setProcessing] = useState(false);

  // ── Handle bKash callback redirect
  useEffect(() => {
    if (paymentStatus === "success") { setScreen("success"); return; }
    if (paymentStatus === "failed" || paymentStatus === "error") {
      setError("Payment failed. Please try again.");
      setScreen("error");
    }
  }, [paymentStatus]);

  // ── Fetch product by QR code ID
  useEffect(() => {
    if (!productId || paymentStatus) return;

    const fetchProduct = async () => {
      try {
        const res  = await fetch(`/api/scan?type=product&id=${productId}`);
        const data = await res.json();

        if (!res.ok) { 
          setError(data.error || "Product not found"); 
          setScreen("error"); 
          return; 
        }

        setProduct(data.product);
        setScreen("product");
      } catch {
        setError("Could not load product. Check your connection.");
        setScreen("error");
      }
    };

    fetchProduct();
  }, [productId]);

  const total = product ? product.price * qty : 0;

  const handlePayment = async () => {
    if (!product) return;
    setProcessing(true);

    try {
      // Step 1 — Create order
      const orderRes  = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:          "order",
          productId:     product._id,
          productName:   product.name,
          quantity:      qty,
          totalPrice:    total,
          paymentMethod: method,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // Step 2 — Cash on delivery → direct success
      if (method === "cash") {
        setScreen("success");
        setProcessing(false);
        return;
      }

      // Step 3 — bKash / Nagad → initiate payment
      const bkashRes  = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:    "bkash",
          orderId: orderData.orderId,
          amount:  total,
        }),
      });

      const bkashData = await bkashRes.json();
      if (!bkashRes.ok) throw new Error(bkashData.error);

      // Redirect to bKash page
      window.location.href = bkashData.bkashURL;
    } catch (err: any) {
      setError(err.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef4ec] dark:bg-[#0d1f0d] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {/* ── LOADING ── */}
          {screen === "loading" && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-10 h-10 border-4 border-[#1a2e1a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#3a4a3a] dark:text-slate-300 text-sm">Loading product...</p>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {screen === "error" && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 text-center shadow-lg"
            >
              <div className="text-4xl mb-3">❌</div>
              <h2 className="text-lg font-bold text-[#1a2e1a] dark:text-white mb-2">Something went wrong</h2>
              <p className="text-sm text-[#3a4a3a] dark:text-slate-300">{error}</p>
            </motion.div>
          )}

          {/* ── PRODUCT DETAIL ── */}
          {screen === "product" && product && (
            <motion.div 
              key="product"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-[#1a2e1a] rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-[#eef4ec] dark:bg-[#0d1f0d] py-8 text-center text-6xl">
                {product.emoji}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-xl font-black text-[#1a2e1a] dark:text-white">{product.name}</h1>
                  {product.badge && (
                    <span className="text-xs bg-[#eef4ec] dark:bg-[#0d1f0d] text-[#3B6D11] dark:text-green-300 px-2 py-1 rounded-lg font-medium ml-2 shrink-0">
                      {product.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#3a4a3a] dark:text-slate-300 mb-5 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#3a4a3a] dark:text-slate-400">Unit price</span>
                  <span className="text-lg font-bold text-[#1a2e1a] dark:text-white">৳{product.price}</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-[#3a4a3a] dark:text-slate-400">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full border border-[#c8dfc8] flex items-center justify-center text-[#1a2e1a] dark:text-white font-bold"
                    >
                      −
                    </button>
                    <span className="font-bold text-[#1a2e1a] dark:text-white w-5 text-center">{qty}</span>
                    <button 
                      onClick={() => setQty(q => q + 1)}
                      className="w-8 h-8 rounded-full border border-[#c8dfc8] flex items-center justify-center text-[#1a2e1a] dark:text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#c8dfc8] pt-4 mb-5 flex items-center justify-between">
                  <span className="font-bold text-[#1a2e1a] dark:text-white">Total</span>
                  <span className="text-2xl font-black text-[#1a2e1a] dark:text-white">৳{total}</span>
                </div>

                <button 
                  onClick={() => setScreen("payment")}
                  className="w-full bg-[#1a2e1a] text-white font-bold py-3.5 rounded-xl hover:bg-[#2a4a2a] transition-colors"
                >
                  Proceed to Pay
                </button>
              </div>
            </motion.div>
          )}

          {/* ── PAYMENT ── */}
          {screen === "payment" && product && (
            <motion.div 
              key="payment"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-[#1a2e1a] rounded-2xl shadow-lg p-6"
            >
              <button 
                onClick={() => setScreen("product")}
                className="text-sm text-[#3a4a3a] dark:text-slate-400 mb-5 flex items-center gap-1"
              >
                ← Back
              </button>

              <h2 className="text-lg font-black text-[#1a2e1a] dark:text-white mb-5">Payment Method</h2>

              <div className="flex flex-col gap-2 mb-6">
                {PAYMENT_METHODS.map((m) => (
                  <button 
                    key={m.id} 
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      method === m.id
                        ? "border-[#1a2e1a] dark:border-green-400 border-2"
                        : "border-[#c8dfc8]"
                    }`}
                  >
                    {m.emoji ? (
                      <span className="w-8 h-8 flex items-center justify-center text-lg">{m.emoji}</span>
                    ) : (
                      <span 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: m.bg }}
                      >
                        {m.short}
                      </span>
                    )}
                    <span className="font-medium text-[#1a2e1a] dark:text-white text-sm">{m.label}</span>
                    {method === m.id && (
                      <span className="ml-auto text-[#1a2e1a] dark:text-green-400 text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Order summary */}
              <div className="bg-[#eef4ec] dark:bg-[#0d1f0d] rounded-xl p-4 mb-5 text-sm space-y-2">
                <div className="flex justify-between text-[#3a4a3a] dark:text-slate-300">
                  <span>{product.name} × {qty}</span>
                  <span>৳{total}</span>
                </div>
                <div className="flex justify-between text-[#3a4a3a] dark:text-slate-300">
                  <span>Service fee</span>
                  <span>৳0</span>
                </div>
                <div className="border-t border-[#c8dfc8] pt-2 flex justify-between font-bold text-[#1a2e1a] dark:text-white">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                disabled={processing}
                className="w-full bg-[#1a2e1a] text-white font-bold py-3.5 rounded-xl hover:bg-[#2a4a2a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? "Processing..." : `Pay ৳${total}`}
              </button>
            </motion.div>
          )}

          {/* ── SUCCESS ── */}
          {screen === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#1a2e1a] rounded-2xl shadow-lg p-6 text-center"
            >
              <div className="w-16 h-16 bg-[#eef4ec] dark:bg-[#0d1f0d] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M7 16l7 7L25 9" stroke="#3B6D11" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2 className="text-xl font-black text-[#1a2e1a] dark:text-white mb-2">Payment Successful!</h2>
              <p className="text-sm text-[#3a4a3a] dark:text-slate-300 mb-6">
                {product
                  ? `${product.name}-এর জন্য ৳${total} পরিশোধ হয়েছে।`
                  : "Your payment was confirmed."
                }
              </p>

              {(orderId || trxId) && (
                <div className="bg-[#eef4ec] dark:bg-[#0d1f0d] rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                  {orderId && (
                    <div className="flex justify-between">
                      <span className="text-[#3a4a3a] dark:text-slate-400">Order ID</span>
                      <span className="font-bold text-[#1a2e1a] dark:text-white">#{orderId.slice(-6).toUpperCase()}</span>
                    </div>
                  )}
                  {trxId && (
                    <div className="flex justify-between">
                      <span className="text-[#3a4a3a] dark:text-slate-400">TrxID</span>
                      <span className="font-bold text-[#1a2e1a] dark:text-white">{trxId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#3a4a3a] dark:text-slate-400">Status</span>
                    <span className="text-green-700 dark:text-green-400 font-bold">Confirmed ✓</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => window.location.href = "/"}
                className="w-full border border-[#c8dfc8] text-[#1a2e1a] dark:text-white font-bold py-3 rounded-xl hover:bg-[#eef4ec] dark:hover:bg-[#0d1f0d] transition-colors"
              >
                Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}