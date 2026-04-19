"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Hero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/become-manager");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    try {
      const user = rawUser ? JSON.parse(rawUser) : null;
      if (token && user) {
        setDashboardHref("/dashboard/inventory");
      } else {
        setDashboardHref("/become-manager");
      }
    } catch {
      setDashboardHref("/become-manager");
    }
  }, []);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  return (
    <>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#FF6B35]/10 to-[#E55A2B]/10 border border-[#FF6B35]/20 rounded-full">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#FF6B35]">স্মার্ট ইনভেন্টরি সিস্টেম</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-gray-900 dark:text-white">ব্যবসার জন্য</span>
                <br />
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] bg-clip-text text-transparent">
                  স্মার্ট ইনভেন্টরি সিস্টেম
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                আপনার ব্যবসার জন্য সম্পূর্ণ ইনভেন্টরি ম্যানেজমেন্ট, অর্ডার ট্র্যাকিং এবং স্টক কন্ট্রোল সিস্টেম।
                রিয়েল-টাইম ড্যাশবোর্ড এবং স্মার্ট অ্যানালিটিক্স দিয়ে আপনার ব্যবসা পরিচালনা করুন।
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">রিয়েল-টাইম ইনভেন্টরি ট্র্যাকিং</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">অটোমেটিক অর্ডার ম্যানেজমেন্ট</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">স্মার্ট রিস্টক অ্যালার্ট</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">বিস্তারিত রিপোর্ট ও অ্যানালিটিক্স</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href={dashboardHref}
                className="group relative px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FF6B35]/25 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">ড্যাশবোর্ড দেখুন</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#E55A2B] to-[#FF6B35] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href="/register"
                className="px-6 py-3 border-2 border-[#FF6B35] text-[#FF6B35] font-bold rounded-xl hover:bg-[#FF6B35] hover:text-white transition-all duration-300 hover:scale-105"
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
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <div className="w-0 h-0 border-l-[12px] sm:border-l-[16px] border-l-[#FF6B35] border-t-[9px] sm:border-t-[12px] border-t-transparent border-b-[9px] sm:border-b-[12px] border-b-transparent ml-1" />
                    </div>
                  </div>

                  {/* Video Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                      <h3 className="text-white font-semibold text-xs sm:text-sm">Smart Inventory Management System Demo</h3>
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
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl">📊</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">৯৯.৯%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">আপটাইম</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl">⚡</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">২৪/৭</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">সাপোর্ট</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50 pointer-events-none" />
    </section>

    {/* Flip Cards Section */}
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
            আমাদের <span className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] bg-clip-text text-transparent">সেবাসমূহ</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            আপনার ব্যবসার জন্য সম্পূর্ণ সমাধান
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="flip-card h-80 group perspective-1000">
            <div className="flip-card-inner relative w-full h-full transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
              {/* Front */}
              <div className="flip-card-front absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl border-4 border-transparent group-hover:border-[#FF6B35] transition-all duration-300">
                <img 
                  src="https://thumbs.dreamstime.com/b/american-food-menu-restaurant-cuisine-cafe-lunch-steaks-vector-usa-authentic-dishes-america-meals-breakfast-sandwich-214064220.jpg"
                  alt="American Food Menu"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-2">মেনু ম্যানেজমেন্ট</h3>
                  <p className="text-gray-200 text-sm">রেস্তোরাঁ এবং ক্যাফে মেনু</p>
                  <div className="mt-3 text-[#FF6B35] text-sm font-semibold">
                    বিস্তারিত দেখতে হোভার করুন →
                  </div>
                </div>
              </div>
              {/* Back */}
              <div className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] p-6 flex flex-col justify-center items-center text-white shadow-xl">
                <div className="text-5xl mb-4">🍔</div>
                <h3 className="text-2xl font-bold mb-3">মেনু ম্যানেজমেন্ট</h3>
                <p className="text-center mb-6 text-sm leading-relaxed">
                  স্টেক, বার্গার এবং আরও অনেক কিছু। আমাদের সিস্টেমে আপনার মেনু সহজেই ম্যানেজ করুন।
                </p>
                <ul className="text-sm space-y-2 mb-6 text-left w-full">
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>সহজ মেনু আপডেট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>ডিজিটাল মেনু কার্ড</span>
                  </li>
                </ul>
                <button className="px-6 py-3 bg-white text-[#FF6B35] font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                  বিস্তারিত দেখুন
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flip-card h-80 group perspective-1000">
            <div className="flip-card-inner relative w-full h-full transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
              {/* Front */}
              <div className="flip-card-front absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl border-4 border-transparent group-hover:border-[#E55A2B] transition-all duration-300">
                <img 
                  src="https://i.pinimg.com/474x/56/5e/59/565e59dd4a256171646a359cde96a62d.jpg"
                  alt="Restaurant Menu"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-2">খাবার ইনভেন্টরি</h3>
                  <p className="text-gray-200 text-sm">বিভিন্ন ধরনের খাবার</p>
                  <div className="mt-3 text-[#E55A2B] text-sm font-semibold">
                    বিস্তারিত দেখতে হোভার করুন →
                  </div>
                </div>
              </div>
              {/* Back */}
              <div className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-[#E55A2B] to-[#FF6B35] p-6 flex flex-col justify-center items-center text-white shadow-xl">
                <div className="text-5xl mb-4">🍕</div>
                <h3 className="text-2xl font-bold mb-3">বিশেষ খাবার</h3>
                <p className="text-center mb-6 text-sm leading-relaxed">
                  প্রতিদিনের স্পেশাল আইটেম এবং মেনু আপডেট করুন সহজেই।
                </p>
                <ul className="text-sm space-y-2 mb-6 text-left w-full">
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>স্টক ম্যানেজমেন্ট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>রিয়েল-টাইম আপডেট</span>
                  </li>
                </ul>
                <button className="px-6 py-3 bg-white text-[#E55A2B] font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                  অর্ডার করুন
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 - Innovation */}
          <div className="flip-card h-80 group perspective-1000">
            <div className="flip-card-inner relative w-full h-full transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
              {/* Front */}
              <div className="flip-card-front absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl border-4 border-transparent group-hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-7xl mb-4">💡</div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-2xl mb-3">উদ্ভাবন ও প্রযুক্তি</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">স্মার্ট সিস্টেম সমাধান</p>
                  <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    বিস্তারিত দেখতে হোভার করুন →
                  </div>
                </div>
              </div>
              {/* Back */}
              <div className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 flex flex-col justify-center items-center text-white shadow-xl">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-3">ডিজিটাল সমাধান</h3>
                <p className="text-center mb-6 text-sm leading-relaxed">
                  আধুনিক প্রযুক্তি ব্যবহার করে আপনার ব্যবসা আরও দক্ষ করুন।
                </p>
                <ul className="text-sm space-y-2 mb-6 text-left w-full">
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>এআই পাওয়ার্ড সিস্টেম</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>অটোমেশন টুলস</span>
                  </li>
                </ul>
                <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                  আরও জানুন
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 - Support */}
          <div className="flip-card h-80 group perspective-1000">
            <div className="flip-card-inner relative w-full h-full transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
              {/* Front */}
              <div className="flip-card-front absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl border-4 border-transparent group-hover:border-green-500 transition-all duration-300 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <div className="text-7xl mb-4">📞</div>
                  <h3 className="font-bold text-3xl mb-3">২৪/৭ সাপোর্ট</h3>
                  <p className="text-sm text-green-50">সবসময় আপনার পাশে</p>
                  <div className="mt-4 text-green-100 text-sm font-semibold">
                    বিস্তারিত দেখতে হোভার করুন →
                  </div>
                </div>
              </div>
              {/* Back */}
              <div className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 p-6 flex flex-col justify-center items-center text-white shadow-xl">
                <div className="text-5xl mb-4">🎧</div>
                <h3 className="text-2xl font-bold mb-3">সহায়তা কেন্দ্র</h3>
                <p className="text-center mb-6 text-sm leading-relaxed">
                  যেকোনো সমস্যায় আমাদের টিম আপনাকে সাহায্য করতে প্রস্তুত।
                </p>
                <ul className="text-sm space-y-2 mb-6 text-left w-full">
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>তাৎক্ষণিক চ্যাট সাপোর্ট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span>
                    <span>ফোন সহায়তা</span>
                  </li>
                </ul>
                <button className="px-6 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                  যোগাযোগ করুন
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .flip-card-inner {
          cursor: pointer;
        }
        .group:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
    </>
  );
};

export default Hero;