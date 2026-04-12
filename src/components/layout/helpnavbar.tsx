"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell, FiSearch, FiMenu, FiX, FiHome, FiHelpCircle } from "react-icons/fi";
import {
  LuFileText,
  LuMap,
  LuRocket,
  LuListTodo,
  LuMessageCircle,
  LuUsers
} from "react-icons/lu";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

const HelpNavbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications] = useState(7);

  const navLinks = [
    { label: "All Posts", href: "/help/allpost", icon: <LuFileText size={18} /> },
    { label: "Roadmap", href: "/help/roadmap", icon: <LuMap size={18} /> },
    { label: "Release Notes", href: "/help/release", icon: <LuRocket size={18} /> },
    { label: "Feature Requests", href: "/help/feature", icon: <LuListTodo size={18} /> },
  ];

  return (
    <header className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10 sticky top-0 z-40 shadow-lg">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/help" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
              <HiOutlineQuestionMarkCircle size={24} />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm md:text-base font-bold text-white group-hover:text-purple-300 transition">Help Center</span>
              <span className="text-xs text-gray-400">Smart Inventory</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center bg-slate-700/40 border border-white/10 rounded-lg px-4 py-2 flex-1 mx-8 group hover:border-white/20 focus-within:border-purple-500/50 transition">
            <FiSearch size={18} className="text-gray-500 group-focus-within:text-purple-400" />
            <input
              type="text"
              placeholder="Search posts, questions..."
              className="bg-transparent outline-none ml-2 text-sm placeholder-gray-500 w-full"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-slate-700/50 rounded-lg transition hidden sm:block">
              <FiBell size={20} className="text-gray-300 hover:text-white" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Home Link */}
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
            >
              <FiHome size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {/* Profile Section */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">User</span>
                <span className="text-xs text-gray-500">Member</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                U
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg transition text-gray-300"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 pb-0 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition ${isActive
                    ? "text-purple-300 border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-white border-b-2 border-transparent hover:border-white/20"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive
                      ? "bg-purple-600/20 text-purple-300"
                      : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
            >
              <FiHome size={18} />
              Go to Dashboard
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default HelpNavbar;