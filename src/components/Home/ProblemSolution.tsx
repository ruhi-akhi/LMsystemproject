"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiActivity, FiZap, FiTarget } from "react-icons/fi";

const ProblemSolution = () => {
  const data = [
    {
      problem: "ইনভেন্টরি ট্র্যাক করা কঠিন, কোন প্রোডাক্ট কতটুকু আছে জানি না।",
      problemEmoji: "😒",
      solution: "রিয়েল-টাইম ইনভেন্টরি ট্র্যাকিং সিস্টেম দিয়ে সব প্রোডাক্টের সঠিক তথ্য পাবেন।",
      solutionEmoji: "📊",
      color: "from-[#FF6B35] via-[#E55A2B] to-orange-600",
      icon: <FiTarget className="text-[#FF6B35]" />,
    },
    {
      problem: "অর্ডার ম্যানেজমেন্ট জটিল, ম্যানুয়াল কাজে ভুল হয়।",
      problemEmoji: "😟",
      solution:
        "অটোমেটিক অর্ডার প্রসেসিং এবং স্মার্ট ওয়ার্কফ্লো দিয়ে ভুলের সম্ভাবনা শূন্য।",
      solutionEmoji: "⚡",
      color: "from-blue-600 via-indigo-500 to-purple-500",
      icon: <FiZap className="text-blue-500" />,
    },
    {
      problem: "স্টক শেষ হয়ে গেলে বুঝতে পারি না, বিক্রয় হারিয়ে ফেলি।",
      problemEmoji: "😫",
      solution:
        "স্মার্ট রিস্টক অ্যালার্ট এবং অটোমেটিক নোটিফিকেশন দিয়ে কখনো স্টক শেষ হবে না।",
      solutionEmoji: "🔔",
      color: "from-emerald-500 via-teal-500 to-cyan-600",
      icon: <FiActivity className="text-emerald-500" />,
    },
    {
      problem: "বিজনেস রিপোর্ট তৈরি করা সময়সাপেক্ষ এবং জটিল।",
      problemEmoji: "😰",
      solution:
        "ওয়ান-ক্লিক রিপোর্ট জেনারেশন এবং রিয়েল-টাইম অ্যানালিটিক্স দিয়ে তাৎক্ষণিক ইনসাইট পাবেন।",
      solutionEmoji: "📈",
      color: "from-[#FF6B35] via-[#E55A2B] to-amber-500",
      icon: <FiZap className="text-[#FF6B35]" />,
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#020617] relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FF6B35]/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#E55A2B]/10 blur-[100px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Modern Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Business Solutions
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-7xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tight">
            ব্যবসায় <span className="text-[#FF6B35]">সমস্যা</span> অনেক,
            <br />
            <span className="italic font-serif font-light text-slate-400 dark:text-slate-500">
              কিন্তু সমাধান মাত্র
            </span>{" "}
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] bg-clip-text text-transparent">
              একটিই!
            </span>
          </h2>
        </div>

        {/* Bento Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full bg-slate-50 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 overflow-hidden transition-all duration-500 hover:border-[#FF6B35]/30">
                {/* Background Number */}
                <div className="absolute -top-10 -right-10 text-[15rem] font-black text-slate-200/30 dark:text-slate-800/10 pointer-events-none select-none group-hover:text-[#FF6B35]/5 transition-colors duration-700">
                  {index + 1}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Problem Section */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Business Challenge
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-4xl mt-1">{item.problemEmoji}</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {item.problem}
                      </h3>
                    </div>
                  </div>

                  {/* Dynamic Connector */}
                  <div className="flex items-center gap-4 mb-10 overflow-hidden">
                    <div className="h-[2px] w-full bg-gradient-to-r from-[#FF6B35] to-transparent opacity-20" />
                    <motion.div
                      animate={{ x: [-10, 10, -10] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <FiArrowRight className="text-slate-300 dark:text-slate-600 text-2xl" />
                    </motion.div>
                  </div>

                  {/* Solution Section */}
                  <div className="mt-auto relative">
                    <div className="absolute -inset-6 bg-gradient-to-r from-[#FF6B35]/5 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
                          Smart Solution
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="text-4xl mt-1 drop-shadow-lg">
                          {item.solutionEmoji}
                        </span>
                        <p
                          className={`text-xl md:text-2xl font-black leading-tight bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                        >
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Glow Bar */}
                <div
                  className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${item.color} transition-all duration-700 group-hover:w-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
