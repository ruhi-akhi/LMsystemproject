import React from "react";

const VideoMessageSection = () => {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFEDD5] px-4 py-2 text-sm font-semibold text-[#B45309]">
                            ব্যবসার জন্য বিশেষ সমাধান
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            সমস্যা নয়,
                            <br />
                            সঠিক সমাধানই আপনার <span className="text-[#DC2626]">ব্যবসাকে এগিয়ে নিয়ে যায়</span>!
                        </h2>
                        <p className="max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            Smart Inventory আপনার ইনভেন্টরি, অর্ডার এবং স্টক সবই একসঙ্গে নিয়ন্ত্রণ করে।
                            একটি পরিষ্কার ও দক্ষ প্ল্যাটফর্মে ব্যবসা চালাতে এখন আর সময় নষ্ট হবে না।
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                                    রিয়েল-টাইম কন্ট্রোল
                                </p>
                                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                                    ইনভেন্টরি, অর্ডার এবং স্টকের প্রতিটি আপডেট দেখতে পারবেন এক দৃশ্যত ড্যাশবোর্ডে।
                                </p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                                    দ্রুত সিদ্ধান্ত
                                </p>
                                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                                    স্বয়ংক্রিয় নোটিফিকেশন ও বিশ্লেষণের মাধ্যমে ব্যবসা পরিচালনা হবে আরও স্মার্ট ও দ্রুত।
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <span className="rounded-full bg-[#FFE8D5] px-4 py-2 text-sm font-medium text-[#B45309]">
                                ৯৯.৯% সিস্টেম আপটাইম</span>
                            <span className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-medium">
                                ২৪/৭ সমর্থন</span>
                            <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 text-sm font-medium">
                                একক প্ল্যাটফর্ম ম্যানেজমেন্ট</span>
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden border border-[#dc2626]/30 dark:border-[#dc2626]/40 bg-white dark:bg-slate-900 shadow-2xl">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.18),transparent_35%)]" />
                        <div className="absolute -right-10 top-1/2 h-28 w-28 rounded-full bg-orange-800/20 blur-3xl" />
                        <div className="p-4 sm:p-5 bg-slate-100 dark:bg-slate-950/80 border-b border-[#dc2626]/20 dark:border-[#dc2626]/30">
                            <p className="text-sm font-semibold text-[#dc2626] dark:text-[#f97316]">ভিডিও পরিচিতি</p>
                        </div>
                        <video
                            src="https://www.shutterstock.com/shutterstock/videos/3848861823/preview/stock-footage-vitamin-b-thiamine-icon-animates-in-with-rice-meat-and-grains-on-a-vibrant-green-background.webm"
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-72 sm:h-80 md:h-96 object-cover bg-slate-900"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoMessageSection;
