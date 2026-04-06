"use client";

import React from "react";
import { BarChart3, PieChart, Activity, TrendingUp, DollarSign, Clock, ArrowUpRight, Users } from "lucide-react";

const AnalyticsDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            শক্তিশালী বিশ্লেষণ এবং ব্যবসায়িক insight। আপনার ইনভেন্টরি, অর্ডার এবং রেভিনিউ ডেটা এখানে দেখুন।
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-3">
                        <button className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E55A2B] transition">
                            <TrendingUp size={18} /> Refresh Insights
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {[
                        { title: "Revenue Growth", value: "৳ 142,500", description: "+18% this month", icon: DollarSign, color: "from-[#FF6B35] to-[#E55A2B]" },
                        { title: "Active Orders", value: "128", description: "+12% today", icon: Activity, color: "from-[#6D28D9] to-[#7C3AED]" },
                        { title: "Top Customers", value: "86", description: "+8% this week", icon: Users, color: "from-[#0EA5E9] to-[#22D3EE]" },
                    ].map((stat) => (
                        <div key={stat.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-[#111827]">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                                    <p className="mt-3 text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{stat.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#111827]">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sales Overview</p>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly revenue trend</h2>
                            </div>
                            <div className="rounded-2xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">+18%</div>
                        </div>
                        <div className="h-[260px] rounded-3xl bg-gradient-to-br from-[#FDF2F8] to-[#FEF3C7] p-6">
                            <BarChart3 className="h-full w-full text-[#E55A2B] opacity-40" />
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="rounded-3xl bg-gray-50 p-4 dark:bg-[#111827]">
                                <p className="font-semibold text-gray-900 dark:text-white">Total sales</p>
                                <p className="mt-2 text-lg font-bold">৳ 920,000</p>
                            </div>
                            <div className="rounded-3xl bg-gray-50 p-4 dark:bg-[#111827]">
                                <p className="font-semibold text-gray-900 dark:text-white">Average order</p>
                                <p className="mt-2 text-lg font-bold">৳ 3,250</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#111827]">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance Breakdown</p>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product analytics</h2>
                            </div>
                            <div className="rounded-2xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">Top 5</div>
                        </div>
                        <div className="h-[260px] rounded-3xl bg-gradient-to-br from-[#ECFDF5] to-[#DBEAFE] p-6">
                            <PieChart className="h-full w-full text-[#22C55E] opacity-40" />
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="rounded-3xl bg-gray-50 p-4 dark:bg-[#111827]">
                                <p className="font-semibold text-gray-900 dark:text-white">High demand</p>
                                <p className="mt-2">47% of inventory</p>
                            </div>
                            <div className="rounded-3xl bg-gray-50 p-4 dark:bg-[#111827]">
                                <p className="font-semibold text-gray-900 dark:text-white">Fast moving</p>
                                <p className="mt-2">32% orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {[
                        { label: "Peak hour", value: "11:00 AM", icon: Clock, color: "bg-[#FEF3C7] text-[#D97706]" },
                        { label: "Orders growth", value: "+23%", icon: ArrowUpRight, color: "bg-[#EEF2FF] text-[#4338CA]" },
                        { label: "Average basket", value: "৳ 1,840", icon: TrendingUp, color: "bg-[#FCE7F3] text-[#BE185D]" },
                    ].map(metric => (
                        <div key={metric.label} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#111827]">
                            <div className="flex items-center gap-3">
                                <div className={`${metric.color} rounded-2xl p-3`}>
                                    <metric.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
