"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Next.js এর Link ব্যবহার করা ভালো

const QRCodeCanvas = ({ value, size = 90 }: { value: string; size?: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const generateQR = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const QRCode = (await import("qrcode")).default;
            QRCode.toCanvas(canvas, value, {
                width: size,
                margin: 1,
                color: { dark: "#1a2e1a", light: "#ffffff" },
            });
        };
        generateQR();
    }, [value, size]);
    return <canvas ref={canvasRef} style={{ borderRadius: "8px", display: "block" }} />;
};

const MobilePreviewSection = () => {
    const phoneImage = "https://parkofideas.com/wp-content/uploads/2023/10/parkofideas.com-1853880822.jpg";
    return (
        <section className="py-16 md:py-24 bg-[#eef4ec] dark:bg-[#0d1f0d] overflow-hidden relative">
            <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* LEFT: Text + QR + Order Now Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex-shrink-0 max-w-sm"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-[#1a2e1a] dark:text-white leading-tight mb-5">
                            Mobile First
                        </h2>
                        <p className="text-[15px] text-[#3a4a3a] dark:text-slate-300 leading-[1.75] mb-8">
                            Tasty Daily conceived with a mobile-first approach,
                            ensuring seamless performance and optimized user
                            experience across all devices.
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl overflow-hidden border border-[#c8dfc8] bg-white p-1.5 shadow-sm">
                                <QRCodeCanvas value="https://thefoodfunda.com/scan?product=PKT-001" size={160} />
                            </div>
                            
                            {/* টেক্সট এবং বাটন এখানে রাখা হয়েছে */}
                            <div className="flex flex-col gap-3">
                                <p className="text-sm text-[#3a4a3a] dark:text-slate-300 leading-[1.65]">
                                    Scan QR-Code and check<br />
                                    mobile version on your smartphone
                                </p>
                              <Link 
  href="/qr-demo"
  className="inline-block bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-orange-700 transition-colors text-center w-fit"
>
  Order Now →
</Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Single Phone Mockup */}
                    <div className="flex-1 flex items-center justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative w-[260px] h-[520px] rounded-[44px] border-[3px] border-[#1a2e1a] dark:border-[#4a7a4a] overflow-hidden bg-white shadow-2xl"
                        >
                            {/* Notch */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-20 rounded-full bg-[#1a2e1a]/20 z-10" />
                            <img
                                src={phoneImage}
                                alt="App mobile preview"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobilePreviewSection;


