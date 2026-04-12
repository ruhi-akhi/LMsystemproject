"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Product = {
  _id: string;
  name: string;
  price: number;
  emoji: string;
  badge: string;
  qrCode: string;
  scanUrl: string;
};

export default function QRDemoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDemo = async () => {
      try {
        await fetch("/api/demo-products", { method: "POST" });
        
        const res = await fetch("/api/demo-products");
        const data = await res.json();
        setProducts(data.products);

        const qrPromises = data.products.map(async (product: Product) => {
          const qrDataURL = await QRCode.toDataURL(product.scanUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: "#1a2e1a",
              light: "#ffffff",
            },
          });
          return { qrCode: product.qrCode, qrDataURL };
        });

        const qrResults = await Promise.all(qrPromises);
        const qrMap = qrResults.reduce((acc, { qrCode, qrDataURL }) => {
          acc[qrCode] = qrDataURL;
          return acc;
        }, {} as { [key: string]: string });

        setQrCodes(qrMap);
        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize demo:", error);
        setLoading(false);
      }
    };

    initDemo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef4ec] dark:bg-[#0d1f0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a2e1a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#3a4a3a] dark:text-slate-300">Setting up demo products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef4ec] dark:bg-[#0d1f0d] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#1a2e1a] dark:text-white mb-4">
            QR Code Demo - Tasty Daily
          </h1>
          <p className="text-[#3a4a3a] dark:text-slate-300 max-w-2xl mx-auto">
            Scan any QR code below with your phone camera or click on the product cards to test the ordering system.
            Each QR code links directly to the product page with payment integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.qrCode}
              className="bg-white dark:bg-[#1a2e1a] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* QR Code Section */}
              <div className="bg-[#f8fdf8] dark:bg-[#0d1f0d] p-6 text-center">
                {qrCodes[product.qrCode] ? (
                  <img
                    src={qrCodes[product.qrCode]}
                    alt={`QR Code for ${product.name}`}
                    className="mx-auto mb-3"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Loading QR...</span>
                  </div>
                )}
                <p className="text-xs text-[#3a4a3a] dark:text-slate-400 font-mono">
                  ID: {product.qrCode}
                </p>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{product.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#1a2e1a] dark:text-white">{product.name}</h3>
                      {product.badge && (
                        <span className="text-xs bg-[#eef4ec] dark:bg-[#0d1f0d] text-[#3B6D11] dark:text-green-300 px-2 py-1 rounded-lg font-medium">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-[#1a2e1a] dark:text-white">৳{product.price}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* ← শুধু এই line টা change হয়েছে */}
                  <button
                    onClick={() => window.location.href = product.scanUrl}
                    className="w-full bg-[#1a2e1a] text-white font-bold py-3 rounded-xl hover:bg-[#2a4a2a] transition-colors"
                  >
                    🛒 Order Now
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(product.scanUrl);
                      alert("Link copied to clipboard!");
                    }}
                    className="w-full border border-[#c8dfc8] text-[#1a2e1a] dark:text-white font-medium py-2.5 rounded-xl hover:bg-[#eef4ec] dark:hover:bg-[#0d1f0d] transition-colors text-sm"
                  >
                    📋 Copy Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white dark:bg-[#1a2e1a] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-[#1a2e1a] dark:text-white mb-4">How to Test:</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-[#3a4a3a] dark:text-slate-300">
            <div>
              <h3 className="font-bold text-[#1a2e1a] dark:text-white mb-2">📱 Mobile Testing:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Open your phone camera</li>
                <li>Point at any QR code above</li>
                <li>Tap the notification to open</li>
                <li>Complete the order flow</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#1a2e1a] dark:text-white mb-2">💻 Desktop Testing:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Click "Order Now" button</li>
                <li>Select quantity and payment method</li>
                <li>Use bKash sandbox for testing</li>
                <li>Check success/failure flows</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = "/"}
            className="inline-flex items-center gap-2 text-[#3a4a3a] dark:text-slate-400 hover:text-[#1a2e1a] dark:hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}