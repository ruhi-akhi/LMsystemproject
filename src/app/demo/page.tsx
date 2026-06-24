import React from "react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] bg-clip-text text-transparent">
              Live Demo
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            আমাদের স্মার্ট ইনভেন্টরি ম্যানেজমেন্ট সিস্টেমের লাইভ ডেমো দেখুন এবং 
            কিভাবে এটি আপনার ব্যবসা পরিচালনা সহজ করে তুলবে তা অনুভব করুন।
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-[#FF6B35]/10 to-[#E55A2B]/10 flex items-center justify-center">
              <iframe
                src="https://www.youtube.com/embed/t6FfSSVxT7c"
                title="Smart Inventory Management System Demo"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ডেমো ফিচারসমূহ
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">রিয়েল-টাইম ইনভেন্টরি</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">লাইভ স্টক আপডেট এবং ট্র্যাকিং</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">অর্ডার ম্যানেজমেন্ট</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">অটোমেটিক অর্ডার প্রসেসিং</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">স্মার্ট অ্যালার্ট</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">স্টক কম হলে তাৎক্ষণিক নোটিফিকেশন</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">রিপোর্ট ও অ্যানালিটিক্স</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">বিস্তারিত বিজনেস ইনসাইট</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FF6B35]/25 transition-all duration-300 hover:scale-105 text-center"
                >
                  Try Live Demo (Login)
                </Link>
                
                <Link
                  href="/qr-demo"
                  className="px-8 py-4 border-2 border-[#FF6B35] text-[#FF6B35] font-bold rounded-xl hover:bg-[#FF6B35] hover:text-white transition-all duration-300 hover:scale-105 text-center"
                >
                  QR Ordering Demo
                </Link>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                Use &quot;Load Demo Data &amp; Login&quot; on the login page for instant access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}