"use client";

import React, { useState } from "react";
import { FaLeaf, FaAppleAlt, FaFish, FaBreadSlice, FaDrumstickBite } from "react-icons/fa";
import { GiRiceCooker } from "react-icons/gi";
import { getProductImage } from "@/utils/productImage";

const categories = [
    { label: "Vegetables", icon: <FaLeaf /> },
    { label: "Fresh Fruit", icon: <FaAppleAlt /> },
    { label: "Meat", icon: <FaDrumstickBite /> },
    { label: "Seafood", icon: <FaFish /> },
    { label: "Baking", icon: <FaBreadSlice /> },
    { label: "Rice", icon: <GiRiceCooker /> },
];

const products = [
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
        name: "Basil",
        category: "Vegetables",
        price: "$9.50",
        rating: "4.8",
        badge: "Organic",
        description: "Aromatic basil leaves grown with care.",
        color: "bg-lime-100 text-lime-700",
    },
    {
        name: "Carrot 1 kg",
        category: "Vegetables",
        price: "$8.00",
        rating: "4.7",
        badge: "Fresh",
        description: "Sweet and crunchy carrots for daily meals.",
        color: "bg-orange-100 text-orange-700",
    },
    {
        name: "Kiwi",
        category: "Fresh Fruit",
        price: "$10.00",
        rating: "4.6",
        badge: "Seasonal",
        description: "Juicy kiwi with vibrant green flesh.",
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
        name: "Chicken Breast",
        category: "Meat",
        price: "$18.00",
        rating: "4.7",
        badge: "Fresh Cut",
        description: "Premium fresh chicken breast perfect for grilling.",
        color: "bg-rose-100 text-rose-700",
    },
    {
        name: "Beef Steak",
        category: "Meat",
        price: "$25.00",
        rating: "4.8",
        badge: "Premium",
        description: "Juicy beef steak ideal for BBQ lovers.",
        color: "bg-rose-100 text-rose-700",
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
    {
        name: "Shrimp Pack",
        category: "Seafood",
        price: "$19.00",
        rating: "4.6",
        badge: "Chef Pick",
        description: "Fresh shrimp perfect for seafood dishes.",
        color: "bg-sky-100 text-sky-700",
    },

    {
        name: "Organic Flour",
        category: "Baking",
        price: "$7.00",
        rating: "4.5",
        badge: "Organic",
        description: "Premium wheat flour for baking bread and cakes.",
        color: "bg-amber-100 text-amber-700",
    },

    {
        name: "Premium Basmati Rice",
        category: "Rice",
        price: "$20.00",
        rating: "4.9",
        badge: "Premium",
        description: "Long grain aromatic basmati rice perfect for biryani.",
        color: "bg-yellow-100 text-yellow-700",
    },
    {
        name: "Jasmine Rice",
        category: "Rice",
        price: "$18.00",
        rating: "4.7",
        badge: "Aromatic",
        description: "Soft fragrant jasmine rice ideal for Asian dishes.",
        color: "bg-yellow-100 text-yellow-700",
    },
    {
        name: "Brown Rice",
        category: "Rice",
        price: "$16.00",
        rating: "4.6",
        badge: "Healthy",
        description: "Nutritious whole grain brown rice rich in fiber.",
        color: "bg-yellow-100 text-yellow-700",
    },
];

export default function ShopPage() {

    const [activeCategory, setActiveCategory] = useState<string>("All");

    const filteredProducts =
        activeCategory === "All"
            ? products
            : products.filter((p) => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8 flex flex-wrap gap-3">

                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${
                            activeCategory === "All" 
                                ? "bg-[#FF6B35] text-white shadow-lg" 
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-orange-50"
                        }`}
                    >
                        All
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category.label}
                            onClick={() => setActiveCategory(category.label)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                                activeCategory === category.label
                                    ? "bg-[#FF6B35] text-white shadow-lg"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            {category.icon}
                            {category.label}
                        </button>
                    ))}

                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                    {filteredProducts.map((item) => (

                        <div key={item.name} className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden group">

                            <img
                                src={getProductImage(item.name)}
                                alt={item.name}
                                className="h-52 w-full object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                            />

                            <div className="p-6">

                                <div className="flex justify-between mb-2">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.color}`}>
                                        {item.badge}
                                    </span>

                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <span className="text-yellow-400">⭐</span> {item.rating}
                                    </span>
                                </div>

                                <h2 className="text-xl font-semibold">{item.name}</h2>

                                <p className="text-sm text-gray-500 mt-2">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-2xl font-bold">{item.price}</p>

                                    <button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
                                        Add to cart
                                    </button>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
}