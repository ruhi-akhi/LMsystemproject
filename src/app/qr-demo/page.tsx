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
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const initDemo = async () => {
      try {
        const seedRes = await fetch("/api/demo-products", { method: "POST" });
        if (!seedRes.ok) {
          throw new Error(`Failed to seed demo products: ${seedRes.status}`);
        }

        const res = await fetch("/api/demo-products");
        if (!res.ok) {
          throw new Error(`Failed to fetch demo products: ${res.status}`);
        }

        const data = await res.json();

        const productList: Product[] = Array.isArray(data?.products)
          ? data.products
          : [];

        if (productList.length === 0) {
          setError("No demo products found. Please check the API.");
          setLoading(false);
          return;
        }

        setProducts(productList);

        const qrPromises = productList.map(async (product: Product) => {
          try {
            const qrDataURL = await QRCode.toDataURL(product.scanUrl, {
              width: 200,
              margin: 2,
              color: { dark: "#7c2d00", light: "#ffffff" },
            });
            return { qrCode: product.qrCode, qrDataURL };
          } catch {
            return { qrCode: product.qrCode, qrDataURL: "" };
          }
        });

        const qrResults = await Promise.all(qrPromises);
        const qrMap = qrResults.reduce(
          (acc, { qrCode, qrDataURL }) => {
            if (qrCode) acc[qrCode] = qrDataURL;
            return acc;
          },
          {} as { [key: string]: string }
        );

        setQrCodes(qrMap);
      } catch (err) {
        console.error("Failed to initialize demo:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    initDemo();
  }, []);

  const handleCopy = (product: Product) => {
    navigator.clipboard.writeText(product.scanUrl);
    setCopiedId(product.qrCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      
        fontFamily: "'Sora', sans-serif"
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ position: "relative", width: "72px", height: "72px", margin: "0 auto 20px" }}>
            <div style={{
              width: "72px", height: "72px", border: "4px solid #fed7aa",
          
              animation: "spin 1s linear infinite"
            }} />
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "26px", animation: "float 2s ease-in-out infinite"
            }}>🍽️</div>
          </div>
          <p style={{ color: "#9a3412", fontWeight: 700, fontSize: "16px" }}>
            Setting up demo products...
          </p>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "12px" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: "8px", height: "8px", borderRadius: "50%", background: "#ea580c",
                animation: `pulse-dot 1.2s ease-in-out ${i*0.2}s infinite`
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "20px",
        background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
        fontFamily: "'Sora', sans-serif"
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
        <div style={{
          textAlign: "center", maxWidth: "420px", background: "white",
          borderRadius: "24px", padding: "40px 32px",
          boxShadow: "0 20px 60px rgba(234,88,12,0.15)",
          border: "1.5px solid #ffedd5"
        }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>😔</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#7c2d00", marginBottom: "8px" }}>
            Something went wrong
          </h2>
          <p style={{
            color: "#9a3412", fontSize: "12px", background: "#fff7ed",
            border: "1px solid #fed7aa", borderRadius: "10px",
            padding: "10px 14px", fontFamily: "monospace", marginBottom: "24px"
          }}>
            {error}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={() => window.location.reload()} style={{
              background: "linear-gradient(135deg, #ea580c, #c2410c)", color: "white",
              fontWeight: 700, padding: "11px 22px", borderRadius: "12px",
              border: "none", cursor: "pointer", fontSize: "14px",
              boxShadow: "0 4px 14px rgba(234,88,12,0.4)", fontFamily: "'Sora', sans-serif"
            }}>🔄 Try Again</button>
            <button onClick={() => (window.location.href = "/")} style={{
              background: "white", color: "#7c2d00", fontWeight: 600,
              padding: "11px 22px", borderRadius: "12px",
              border: "1.5px solid #fed7aa", cursor: "pointer",
              fontSize: "14px", fontFamily: "'Sora', sans-serif"
            }}>🏠 Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 6px rgba(234,88,12,0.3); }
          50%      { box-shadow: 0 0 16px rgba(234,88,12,0.7); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .qr-card {
          background: white;
          border-radius: 22px;
          overflow: hidden;
          border: 1.5px solid #ffedd5;
          box-shadow: 0 4px 18px rgba(124,45,0,0.07);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.35s ease, border-color 0.3s ease;
          animation: fadeInUp 0.5s ease both;
        }
        .qr-card:hover {
          transform: translateY(-10px) scale(1.015);
          box-shadow: 0 24px 52px rgba(234,88,12,0.18);
          border-color: #fb923c;
        }
        .order-btn {
          width: 100%; background: linear-gradient(135deg, #ea580c, #c2410c);
          color: white; font-weight: 700; padding: 13px;
          border-radius: 13px; border: none; cursor: pointer;
          font-size: 14px; font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 14px rgba(234,88,12,0.35);
          transition: all 0.2s ease;
        }
        .order-btn:hover {
          background: linear-gradient(135deg, #c2410c, #9a3412);
          box-shadow: 0 6px 22px rgba(234,88,12,0.5);
          transform: translateY(-1px);
        }
        .copy-btn {
          width: 100%; background: #fff7ed; color: #9a3412;
          font-weight: 600; padding: 11px; border-radius: 13px;
          border: 1.5px solid #fed7aa; cursor: pointer;
          font-size: 13px; font-family: 'Sora', sans-serif;
          transition: all 0.2s ease;
        }
        .copy-btn:hover { background: #ffedd5; border-color: #fb923c; }
        .copy-btn.copied { border-color: #ea580c; color: #ea580c; }
      `}</style>

      <div style={{
        minHeight: "100vh",
       
        fontFamily: "'Sora', sans-serif",
        paddingBottom: "64px",
        position: "relative",
        overflow: "hidden"
      }}>

        <div style={{
          position: "fixed", top: "-120px", right: "-120px",
          width: "420px", height: "420px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,146,60,0.18) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "fixed", bottom: "-100px", left: "-100px",
          width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "44px 20px", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "52px", animation: "fadeInUp 0.55s ease both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "white", border: "1.5px solid #fed7aa",
              borderRadius: "100px", padding: "6px 18px",
              fontSize: "11px", fontWeight: 700, color: "#ea580c",
              letterSpacing: "1px", marginBottom: "22px",
              boxShadow: "0 2px 12px rgba(234,88,12,0.12)"
            }}>
              <span style={{ animation: "float 2.5s ease-in-out infinite", display: "inline-block" }}>🍽️</span>
              TASTY DAILY — QR DEMO
            </div>

            <h1 style={{
              fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 800,
              color: "#7c2d00", letterSpacing: "-1.5px", lineHeight: 1.1,
              marginBottom: "14px"
            }}>
              Scan. Order. Enjoy.
            </h1>
            <p style={{
              color: "#c2410c", maxWidth: "500px", margin: "0 auto",
              fontSize: "15px", lineHeight: 1.75, opacity: 0.85
            }}>
              Point your phone camera at any QR code — or click{" "}
              <strong>Order Now</strong> to test the full checkout.
            </p>

            <div style={{
              display: "inline-flex", gap: "28px", marginTop: "28px",
              background: "white", borderRadius: "18px", padding: "14px 30px",
              boxShadow: "0 4px 18px rgba(234,88,12,0.1)",
              border: "1.5px solid #ffedd5"
            }}>
              {[
                { label: "PRODUCTS", value: products.length },
                { label: "QR CODES", value: products.length },
                { label: "PAYMENT", value: "bKash" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#ea580c" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#9a3412", fontWeight: 700, letterSpacing: "0.8px", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "22px"
          }}>
            {products.map((product, idx) => (
              <div
                key={product.qrCode}
                className="qr-card"
                style={{ animationDelay: `${idx * 0.08}s` }}
                onMouseEnter={() => setHoveredCard(product.qrCode)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{
                  background: hoveredCard === product.qrCode
                    ? "linear-gradient(135deg, #fff7ed )"
                    : "#fafafa",
                  padding: "26px 22px 18px",
                  textAlign: "center",
                  borderBottom: "1.5px solid ",
                  transition: "background 0.3s ease",
                  position: "relative"
                }}>
                  {product.badge && (
                    <span style={{
                      position: "absolute", top: "12px", right: "12px",
                      background: "linear-gradient(135deg, #ea580c, #c2410c)",
                      color: "white", fontSize: "9px", fontWeight: 700,
                      padding: "3px 10px", borderRadius: "100px", letterSpacing: "0.8px",
                      animation: "glow 2.5s ease-in-out infinite"
                    }}>
                      {product.badge.toUpperCase()}
                    </span>
                  )}

                  {qrCodes[product.qrCode] ? (
                    <div style={{
                      display: "inline-block", padding: "10px",
                      background: "white", borderRadius: "14px",
                      boxShadow: "0 4px 16px rgba(124,45,0,0.1)",
                      transition: "transform 0.3s ease",
                      transform: hoveredCard === product.qrCode ? "scale(1.05)" : "scale(1)"
                    }}>
                      <img
                        src={qrCodes[product.qrCode]}
                        alt={`QR for ${product.name}`}
                        style={{ display: "block", borderRadius: "6px" }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: "200px", height: "200px", margin: "0 auto",
                  
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <div style={{
                        width: "30px", height: "30px",
                        border: "3px solid #fed7aa", borderTopColor: "#ea580c",
                        borderRadius: "50%", animation: "spin 1s linear infinite"
                      }} />
                    </div>
                  )}

                  <p style={{
                    marginTop: "10px", fontSize: "10px", color: "#c2410c",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                    letterSpacing: "0.6px", opacity: 0.65
                  }}>
                    {product.qrCode}
                  </p>
                </div>

                <div style={{ padding: "18px 20px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <span style={{
                      fontSize: "34px", lineHeight: 1,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
                      display: "inline-block",
                      animation: hoveredCard === product.qrCode ? "float 1.5s ease-in-out infinite" : "none"
                    }}>
                      {product.emoji}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontWeight: 700, color: "#7c2d00", fontSize: "14px",
                        marginBottom: "3px", letterSpacing: "-0.2px"
                      }}>
                        {product.name}
                      </h3>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: "#ea580c", letterSpacing: "-0.5px" }}>
                        ৳{product.price}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    <button className="order-btn" onClick={() => (window.location.href = product.scanUrl)}>
                      🛒 Order Now
                    </button>
                    <button
                      className={`copy-btn${copiedId === product.qrCode ? " copied" : ""}`}
                      onClick={() => handleCopy(product)}
                    >
                      {copiedId === product.qrCode ? "✅ Copied!" : "📋 Copy Link"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How to Test */}
          <div style={{
            marginTop: "52px", background: "white", borderRadius: "22px",
            padding: "34px", border: "1.5px solid #ffedd5",
            boxShadow: "0 4px 22px rgba(234,88,12,0.08)",
            animation: "fadeInUp 0.55s ease 0.35s both"
          }}>
            <h2 style={{
              fontSize: "18px", fontWeight: 800, color: "#7c2d00",
              marginBottom: "22px", letterSpacing: "-0.4px"
            }}>
              How to Test
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              {[
                {
                  icon: "📱", title: "Mobile Testing",
                  steps: ["Open your phone camera", "Point at any QR code above", "Tap the notification to open", "Complete the order flow"]
                },
                {
                  icon: "💻", title: "Desktop Testing",
                  steps: [`Click "Order Now" button`, "Select quantity & payment", "Use bKash sandbox for testing", "Check success/failure flows"]
                }
              ].map((sec) => (
                <div key={sec.title}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "18px" }}>{sec.icon}</span>
                    <h3 style={{ fontWeight: 700, color: "#7c2d00", fontSize: "13px" }}>{sec.title}</h3>
                  </div>
                  <ol style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
                    {sec.steps.map((step, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", fontSize: "13px", color: "#9a3412" }}>
                        <span style={{
                          minWidth: "20px", height: "20px",
                          borderRadius: "6px", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#ea580c"
                        }}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* Back */}
          <div style={{ textAlign: "center", marginTop: "34px" }}>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#c2410c", fontSize: "14px", fontWeight: 600,
                fontFamily: "'Sora', sans-serif", opacity: 0.75,
                transition: "opacity 0.2s", display: "inline-flex", alignItems: "center", gap: "6px"
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
            >
              ← Back to Home
            </button>
          </div>

        </div>
      </div>
    </>
  );
}