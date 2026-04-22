"use client";

import React, { useState } from "react";
import { MdOutlineFreeBreakfast, MdOutlineLunchDining, MdOutlineDinnerDining } from "react-icons/md";
import { FaLeaf, FaAppleAlt, FaFish } from "react-icons/fa";
import { getProductImage } from "@/utils/productImage";

// ক্যাটাগরি আপডেট করা হয়েছে: Breakfast, Lunch, Dinner
const categories = [
    { label: "Breakfast Menu", icon: <MdOutlineFreeBreakfast /> },
    { label: "Lunch Menu", icon: <MdOutlineLunchDining /> },
    { label: "Dinner Menu", icon: <MdOutlineDinnerDining /> },
    { label: "Vegetables", icon: <FaLeaf /> },
    { label: "Fresh Fruit", icon: <FaAppleAlt /> },
    { label: "Seafood", icon: <FaFish /> },
];

const products = [
    {
        name: "Lunchbox Burrito",
        category: "Breakfast Menu",
        price: "$10.75",
        rating: "4.9",
        badge: "Morning Special",
        description: "Freshly rolled burrito with eggs and cheese.",
        color: "bg-orange-100 text-orange-700",
    },
    {
        name: "Sea Food Gumbo",
        category: "Lunch Menu",
        price: "$14.95",
        rating: "4.8",
        badge: "Chef's Choice",
        description: "Traditional spicy gumbo with fresh seafood.",
        color: "bg-orange-100 text-orange-700",
    },
    {
        name: "Fajita Salad",
        category: "Dinner Menu",
        price: "$12.95",
        rating: "4.7",
        badge: "Healthy",
        description: "Grilled meat over a bed of fresh garden greens.",
        color: "bg-orange-100 text-orange-700",
    },
    {
        name: "Spring Onion Bunch",
        category: "Vegetables",
        price: "$12.00",
        rating: "4.9",
        badge: "Best Seller",
        description: "Fresh, crisp spring onions for soups and stir-fry.",
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        name: "Fresh Avocado",
        category: "Fresh Fruit",
        price: "$11.00",
        rating: "4.8",
        badge: "Rich",
        description: "Creamy avocado perfect for salads and toast.",
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        name: "Salmon Fish",
        category: "Seafood",
        price: "$22.00",
        rating: "4.8",
        badge: "Ocean Fresh",
        description: "High-quality salmon rich in omega-3.",
        color: "bg-sky-100 text-sky-700",
    },
];

export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const filteredProducts =
        activeCategory === "All"
            ? products
            : products.filter((p) => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- Category Tabs --- */}
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${
                            activeCategory === "All" 
                                ? "bg-[#FF6B35] text-white shadow-lg scale-105" 
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-orange-50"
                        }`}
                    >
                        All
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category.label}
                            onClick={() => setActiveCategory(category.label)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                                activeCategory === category.label
                                    ? "bg-[#FF6B35] text-white shadow-lg scale-105"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            <span className="text-xl">{category.icon}</span>
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* --- Products Grid --- */}
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((item) => (
                        <div key={item.name} className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:border-orange-300 transition-all duration-500 overflow-hidden group">
                            
                            <div className="relative overflow-hidden h-60">
                                <img
                                    src={getProductImage(item.name)}
                                    alt={item.name}
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm ${item.color}`}>
                                        {item.badge}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-[#FF6B35] transition-colors">
                                        {item.name}
                                    </h2>
                                    <span className="text-sm font-bold text-gray-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                        <span className="text-yellow-400">★</span> {item.rating}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-400 italic mb-6 line-clamp-2">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</p>
                                        <p className="text-2xl font-black text-gray-900">{item.price}</p>
                                    </div>

                                    <button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(255,107,53,0.39)] hover:shadow-[#FF6B35]/50 hover:-translate-y-1">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- No Products Found --- */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}