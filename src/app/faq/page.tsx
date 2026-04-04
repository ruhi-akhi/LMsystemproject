"use client";
import React, { useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const FullFAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allFaqs = [
    { q: "Who can use Smart Inventory?", a: "Smart Inventory is designed for small to large businesses, retailers, warehouses, and e-commerce stores that need efficient inventory management." },
    { q: "How does Smart Inventory help my business?", a: "We provide comprehensive tools for tracking products, managing orders, monitoring stock levels, and generating actionable insights to optimize your operations." },
    { q: "Is Smart Inventory suitable for small businesses?", a: "Absolutely! Smart Inventory scales with your business, from single-location shops to multi-warehouse operations." },
    { q: "Can multiple users manage inventory simultaneously?", a: "Yes, you can create multiple user accounts with different roles (Staff and Manager) to allow team collaboration with proper permissions." },
    { q: "Can I use Smart Inventory while managing other systems?", a: "Yes, our system is designed to be flexible and can integrate with your existing workflows and tools." },
    { q: "What technical knowledge is required?", a: "No technical knowledge is required. Smart Inventory has an intuitive interface that anyone can learn and use quickly." },
    { q: "Will I get support if I have issues?", a: "Yes, we provide dedicated customer support available during business hours to help you with any questions or problems." },
    { q: "Do I need expensive hardware or software?", a: "No, Smart Inventory is cloud-based. A standard computer with internet access is all you need to get started." },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">


      {/* Background Glow Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6710C2] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C81D77] blur-[150px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-[900px] mx-auto pt-24 pb-32 px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            Frequently Asked <br />
            <span style={{
              background: "linear-gradient(90deg, #832388, #E3436B, #F0772F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Questions_</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* FAQ List Area */}
        <div className="bg-[#0f0f15]/80 backdrop-blur-xl border border-gray-800 rounded-[32px] p-4 md:p-8 shadow-2xl">
          <div className="space-y-2">
            {allFaqs.map((faq, index) => (
              <div
                key={index}
                className={`transition-all duration-300 rounded-2xl ${openIndex === index ? "bg-white/5" : "hover:bg-white/5"
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span className="text-base md:text-lg font-bold text-gray-200">
                    {faq.q}
                  </span>
                  <span className={`${openIndex === index ? "text-[#E3436B]" : "text-gray-500"} transition-colors`}>
                    {openIndex === index ? <FaChevronCircleUp size={24} /> : <FaChevronCircleDown size={24} />}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed animate-fadeIn">
                    <div className="h-[1px] bg-gray-800 mb-4 w-full"></div>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>


    </div>
  );
};

export default FullFAQPage;