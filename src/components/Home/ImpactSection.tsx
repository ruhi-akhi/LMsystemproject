"use client";

import React from "react";
import { motion } from "framer-motion";

const ImpactSection = () => {
  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUCXFYSb_RokMqqAI8awQ5lEUfODvzvkWXoQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE2q5Tbrw_L7JGsL3N_fPehYafRTdtTankaw&s",
  ];

  const stats = [
    {
      id: 1,
      number: "৯৯.৯%",
      label: "আপটাইম গ্যারান্টি",
      image: images[0],
    },
    {
      id: 2,
      number: "২৪/৭",
      label: "কাস্টমার সাপোর্ট",
      image: images[1],
    },
    {
      id: 3,
      number: "১০০+",
      label: "সন্তুষ্ট ক্লায়েন্ট",
      image: images[0],
    },
    {
      id: 4,
      number: "৫০০+",
      label: "সফল প্রজেক্ট",
      image: images[1],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8FAFC] dark:bg-[#020617] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center rounded-[36px] border border-white/80 bg-white/85 dark:bg-slate-950/90 shadow-[0_40px_120px_rgba(15,23,42,0.08)] p-6 md:p-10"
        >
          <div className="space-y-8">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.45em] text-[#FF6B35] mb-4">Mobile First</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                আমাদের স্মার্ট সিস্টেমের ব্যবসায়িক প্রভাব
              </h2>
              <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-8">
                একটি মোবাইল-ফার্স্ট অভিজ্ঞতা যা দ্রুত, স্মার্ট এবং ব্যবসায়িক সিদ্ধান্তকে শক্তিশালী করে।
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[28px] border border-slate-200/70 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/95 p-5 shadow-sm shadow-slate-200/40 dark:shadow-none"
                >
                  <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{item.number}</p>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#FFEDD5] blur-2xl" />
            <div className="absolute -right-6 bottom-6 h-24 w-24 rounded-full bg-[#D8B4FE] blur-2xl" />
            <div className="relative overflow-hidden rounded-[40px] border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUCXFYSb_RokMqqAI8awQ5lEUfODvzvkWXoQ&s"
                alt="Mobile preview"
                className="h-[440px] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              <div className="absolute left-6 bottom-6 right-6 rounded-[26px] bg-white/90 p-4 shadow-xl shadow-slate-900/10 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Smart Inventory</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">Mobile-ready dashboard</p>
                  </div>
                  <div className="h-12 w-12 rounded-3xl overflow-hidden">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE2q5Tbrw_L7JGsL3N_fPehYafRTdtTankaw&s"
                      alt="App preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;