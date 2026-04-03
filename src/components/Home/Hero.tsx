"use client";
import React, { useState } from "react";
import Link from "next/link";

const Hero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#E55A2B]/10 border border-[#FF6B35]/20 rounded-full">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#FF6B35]">স্মার্ট ইনভেন্টরি সিস্টেম</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-gray-900 dark:text-white">ব্যবসার জন্য</span>
                <br />
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] bg-clip-text text-transparent">
                  স্মার্ট ইনভেন্টরি সিস্টেম
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                আপনার ব্যবসার জন্য সম্পূর্ণ ইনভেন্টরি ম্যানেজমেন্ট, অর্ডার ট্র্যাকিং এবং স্টক কন্ট্রোল সিস্টেম। 
                রিয়েল-টাইম ড্যাশবোর্ড এবং স্মার্ট অ্যানালিটিক্স দিয়ে আপনার ব্যবসা পরিচালনা করুন।
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">রিয়েল-টাইম ইনভেন্টরি ট্র্যাকিং</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">অটোমেটিক অর্ডার ম্যানেজমেন্ট</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">স্মার্ট রিস্টক অ্যালার্ট</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">বিস্তারিত রিপোর্ট ও অ্যানালিটিক্স</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/dashboard/inventory"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FF6B35]/25 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">ড্যাশবোর্ড দেখুন</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#E55A2B] to-[#FF6B35] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link
                href="/register"
                className="px-8 py-4 border-2 border-[#FF6B35] text-[#FF6B35] font-bold rounded-xl hover:bg-[#FF6B35] hover:text-white transition-all duration-300 hover:scale-105"
              >
                ফ্রি শুরু করুন
              </Link>
            </div>
          </div>

          {/* Right Content - Video */}
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#FF6B35]/10 to-[#E55A2B]/10 border border-[#FF6B35]/20">
              
              {!isVideoPlaying ? (
                // Video Thumbnail
                <div 
                  className="w-full h-full cursor-pointer group relative"
                  style={{
                    backgroundImage: 'url("https://i.ytimg.com/vi_webp/t6FfSSVxT7c/sddefault.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onClick={handleVideoPlay}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <div className="w-0 h-0 border-l-[16px] border-l-[#FF6B35] border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                    </div>
                  </div>

                  {/* Video Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                      <h3 className="text-white font-semibold text-sm">Smart Inventory Management System Demo</h3>
                      <p className="text-gray-300 text-xs mt-1">দেখুন কিভাবে আমাদের সিস্টেম আপনার ব্যবসা সহজ করে তুলবে</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Embedded Video
                <iframe
                  src="https://www.youtube.com/embed/t6FfSSVxT7c?autoplay=1"
                  title="Smart Inventory Management System Demo"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">৯৯.৯%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">আপটাইম</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">২৪/৭</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">সাপোর্ট</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50 pointer-events-none" />
    </section>
  );
};

export default Hero;