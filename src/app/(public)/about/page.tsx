"use client";

import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const avatarUrls = [
    'https://i.pravatar.cc/180?img=1',
    'https://i.pravatar.cc/180?img=2',
    'https://i.pravatar.cc/180?img=3',
    'https://i.pravatar.cc/180?img=4',
    'https://i.pravatar.cc/180?img=5',
    'https://i.pravatar.cc/180?img=6',
    'https://i.pravatar.cc/180?img=7',
    'https://i.pravatar.cc/180?img=8',
    'https://i.pravatar.cc/180?img=9',
    'https://i.pravatar.cc/180?img=10',
    'https://i.pravatar.cc/180?img=11',
    'https://i.pravatar.cc/180?img=12',
    'https://i.pravatar.cc/180?img=13',
    'https://i.pravatar.cc/180?img=14',
    'https://i.pravatar.cc/180?img=15',
    'https://i.pravatar.cc/180?img=16',
  ];

  const getShapeClass = (idx: number) => (idx % 4 === 0 ? 'rounded-full' : 'rounded-tl-3xl');

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      <div className="relative py-20 px-4 md:px-10 lg:px-16">
        <div className="absolute inset-0 grid grid-cols-8 md:grid-cols-10 xl:grid-cols-12 gap-4 p-4 md:p-8">
          {avatarUrls.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={`${getShapeClass(index)} overflow-hidden border border-slate-200 bg-slate-100`} 
              style={{ width: '100%', height: index % 5 === 0 ? 90 : 70 }}
            >
              <img
                src={url}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative rounded-3xl bg-white p-8 md:p-12 shadow-2xl border border-slate-200"
          >
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight text-center">
              Join <span className="text-gradient bg-gradient-to-r from-[#FF6B35] via-[#C81D77] to-[#7B45D8] bg-clip-text text-transparent">15 million users</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 text-center">
              who grow their business with Smart Inventory & Order Management.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a href="#" className="px-8 py-3 rounded-full bg-[#7B45D8] text-white font-semibold shadow-lg hover:opacity-95 transition">Start now - It&apos;s free</a>
            </div>
            <p className="mt-3 text-sm text-slate-500 text-center">No credit card required · Instant access</p>
          </motion.div>
        </div>
      </div>

      <section className="pb-24 px-4 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">Unleash <span className="text-[#059b8f]">your growth potential</span></h2>
          <p className="mt-5 text-slate-600 text-lg">Scale smarter with a unified inventory + orders system designed for real business impact.</p>
          <div className="mt-8">
            <a href="#" className="rounded-full bg-[#7B45D8] px-8 py-4 text-white font-semibold hover:bg-[#662fbd] transition">Get Started</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
