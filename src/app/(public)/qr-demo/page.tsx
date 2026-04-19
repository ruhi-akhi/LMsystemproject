"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { 
  QrCode, 
  ShoppingCart, 
  Copy, 
  Check, 
  ArrowLeft,
  Smartphone,
  Zap,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

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
        if (!seedRes.ok) throw new Error(`Failed to seed demo products: ${seedRes.status}`);

        const res = await fetch("/api/demo-products");
        if (!res.ok) throw new Error(`Failed to fetch demo products: ${res.status}`);

        const data = await res.json();
        const productList: Product[] = Array.isArray(data?.products) ? data.products : [];

        if (productList.length === 0) {
          setError("No demo products found. Please check the API.");
          setLoading(false);
          return;
        }

        setProducts(productList);

        const qrPromises = productList.map(async (product: Product) => {
          try {
            const qrDataURL = await QRCode.toDataURL(product.scanUrl, {
              width: 250,
              margin: 2,
              color: { dark: "#1a1a1a", light: "#ffffff" },
            });
            return { qrCode: product.qrCode, qrDataURL };
          } catch {
            return { qrCode: product.qrCode, qrDataURL: "" };
          }
        });

        const qrResults = await Promise.all(qrPromises);
        const qrMap = qrResults.reduce((acc, { qrCode, qrDataURL }) => {
          if (qrCode) acc[qrCode] = qrDataURL;
          return acc;
        }, {} as { [key: string]: string });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-100 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-t-[#FF6B35] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-black font-black text-xl mb-2">প্রস্তুত করা হচ্ছে...</h2>
          <p className="text-gray-500">আপনার কিউআর কোডগুলো লোড হচ্ছে</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl text-center border-2 border-orange-100">
          <div className="text-5xl mb-6">⚠️</div>
          <h2 className="text-2xl font-black text-black mb-3">সমস্যা হয়েছে</h2>
          <p className="text-gray-500 mb-8 bg-orange-50 p-4 rounded-xl font-mono text-sm border border-orange-100">{error}</p>
          <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="flex-1 bg-[#FF6B35] text-white font-bold py-4 rounded-xl hover:bg-[#E55A2B] transition-all">আবার চেষ্টা করুন</button>
            <Link href="/" className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center">হোম পেজ</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-24 pt-32">
      {/* Brand Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-10%] -right-[10%] w-[600px] h-[600px] bg-orange-100 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] -left-[10%] w-[500px] h-[500px] bg-orange-50 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-50 border border-orange-200 mb-8">
            <Zap size={16} className="text-[#FF6B35] fill-[#FF6B35]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6B35]">Smart QR Demo System</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
            Scan. Order. <br />
            <span className="text-[#FF6B35]">Enjoy.</span>
          </h1>
          
          <p className="text-xl text-gray-700 font-bold leading-relaxed max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-4 rounded-2xl">
            আপনার ফোন দিয়ে নিচের কিউআর কোডটি স্ক্যান করুন অথবা সরাসরি অর্ডার বাটনে ক্লিক করে চেকআউট প্রসেসটি টেস্ট করুন।
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: <Smartphone className="text-[#FF6B35]" />, label: "ডিভাইস", value: "মোবাইল রেডি" },
              { icon: <TrendingUp className="text-[#FF6B35]" />, label: "পারফরম্যান্স", value: "সুপার ফাস্ট" },
              { icon: <ShieldCheck className="text-[#FF6B35]" />, label: "পেমেন্ট", value: "বিকাশ (Sandbox)" },
            ].map((stat, i) => (
              <div key={i} className="bg-white px-8 py-6 rounded-3xl border-2 border-orange-50 shadow-xl shadow-orange-100/20 flex flex-col items-center min-w-[160px] transform hover:scale-105 transition-transform">
                <div className="mb-3">{stat.icon}</div>
                <div className="text-lg font-black text-black uppercase tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, idx) => (
            <div
              key={product.qrCode}
              className="group bg-white rounded-[3rem] border-2 border-orange-50 shadow-xl shadow-orange-100/10 hover:shadow-2xl hover:shadow-orange-200/30 transition-all duration-500 overflow-hidden"
              onMouseEnter={() => setHoveredCard(product.qrCode)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Product Info - Top Header */}
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="bg-orange-50 px-4 py-1 rounded-full text-[10px] font-black text-[#FF6B35] uppercase tracking-widest">
                  ID: {product.qrCode}
                </div>
                {product.badge && (
                  <div className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full italic">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* QR Code Area */}
              <div className="p-10 text-center relative">
                <div className={`inline-block p-6 bg-white rounded-[2.5rem] border-2 border-orange-50 shadow-inner transition-all duration-500 ${hoveredCard === product.qrCode ? 'scale-105 border-[#FF6B35]' : ''}`}>
                  {qrCodes[product.qrCode] ? (
                    <img 
                      src={qrCodes[product.qrCode]} 
                      alt={product.name} 
                      className="w-48 h-48 rounded-2xl object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-50 rounded-2xl">
                      <QrCode className="text-gray-200 animate-pulse" size={48} />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details - Bottom Area */}
              <div className="p-10 pt-0">
                <div className="flex items-center gap-5 mb-8">
                  <div className="text-5xl transform group-hover:scale-125 transition-transform duration-500 drop-shadow-sm">
                    {product.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-black group-hover:text-[#FF6B35] transition-colors uppercase italic leading-none mb-1">
                      {product.name}
                    </h3>
                    <div className="text-3xl font-black text-black tracking-tighter">৳{product.price}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => window.location.href = product.scanUrl}
                    className="flex items-center justify-center gap-3 w-full bg-[#FF6B35] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-orange-200 hover:bg-black hover:shadow-gray-200 active:scale-[0.98] transition-all group/btn uppercase tracking-tighter"
                  >
                    <ShoppingCart size={20} className="group-hover/btn:rotate-12 transition-transform" />
                    Order Now
                  </button>
                  <button 
                    onClick={() => handleCopy(product)}
                    className={`flex items-center justify-center gap-3 w-full font-black py-4 rounded-[1.5rem] border-2 transition-all active:scale-[0.98] uppercase tracking-tighter text-sm ${
                      copiedId === product.qrCode 
                      ? 'bg-black border-black text-white' 
                      : 'bg-white border-black text-black hover:bg-orange-50 hover:border-[#FF6B35] hover:text-[#FF6B35]'
                    }`}
                  >
                    {copiedId === product.qrCode ? <Check size={18} /> : <Copy size={18} />}
                    {copiedId === product.qrCode ? 'Link Copied' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Test Section */}
        <div className="mt-32 bg-black rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-white shadow-2xl shadow-orange-200/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%23FF6B35' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-8 leading-none">
                কিভাবে টেস্ট <br />
                <span className="text-[#FF6B35]">করবেন?</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "মোবাইল স্ক্যান", desc: "ফোনের ক্যামেরা দিয়ে কিউআর কোডটি স্ক্যান করলে সরাসরি আমাদের পেমেন্ট পেজে চলে যাবেন।" },
                  { title: "সরাসরি অর্ডার", desc: "ডেস্কটপ থেকে টেস্ট করতে Order Now বাটনে ক্লিক করুন এবং বিকাশ পেমেন্ট প্রসেসটি দেখুন।" },
                  { title: "বিকাশ স্যান্ডবক্স", desc: "পেমেন্টের সময় আমাদের দেওয়া স্যান্ডবক্স ক্রেডিট ব্যবহার করে সফলভাবে অর্ডার সম্পন্ন করুন।" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 bg-[#FF6B35] text-white rounded-2xl flex items-center justify-center shrink-0 font-black text-xl group-hover:rotate-6 transition-transform">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-2xl">
               <div className="flex gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <div className="space-y-6 font-mono">
                  <div className="pb-4 border-b border-white/10">
                    <p className="text-[#FF6B35] font-black text-xs uppercase mb-2 tracking-widest">// Sandbox Credentials</p>
                    <p className="text-white text-lg">User: <span className="text-orange-200">sandboxTokenizedUser02</span></p>
                    <p className="text-white text-lg">Pass: <span className="text-orange-200">sandboxTokenizedUser02@12345</span></p>
                  </div>
                  <div>
                    <p className="text-green-400 font-black text-xs uppercase mb-2 tracking-widest">// Quick Success Code</p>
                    <p className="text-white text-lg">OTP: <span className="text-green-200">123456</span></p>
                    <p className="text-white text-lg">PIN: <span className="text-green-200">12121</span></p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-24">
          <Link href="/" className="inline-flex items-center gap-3 text-black hover:text-[#FF6B35] font-black uppercase italic tracking-tighter transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
