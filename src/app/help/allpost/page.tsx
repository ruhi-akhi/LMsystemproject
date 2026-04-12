"use client";

import React, { useState, useMemo } from "react";
import { HiOutlinePhotograph, HiOutlineSearch, HiOutlineSpeakerphone, HiOutlineStar } from "react-icons/hi";
import { BiMessageRoundedDetail, BiCategory } from "react-icons/bi";
import { MdOutlineBugReport, MdOutlineLightbulb, MdCheckCircleOutline, MdTrendingUp } from "react-icons/md";
import { FiMoreHorizontal, FiDownload, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import CreatePostModal from "../modal";

interface Post {
  id: number;
  author: string;
  avatar: string;
  timestamp: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  status: string;
  comments: number;
  likes: number;
  views: number;
  tags: string[];
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

const AllPost = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => setModalOpen(false);

  const sidebarItems: SidebarItem[] = [
    { icon: <BiCategory />, label: "Course Topics", count: 37, color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { icon: <MdOutlineBugReport />, label: "Bug Reports", count: 15, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
    { icon: <MdOutlineLightbulb />, label: "Feature Requests", count: 23, color: "text-pink-400", bgColor: "bg-pink-500/10" },
    { icon: <HiOutlineSpeakerphone />, label: "Announcements", count: 114, color: "text-purple-400", bgColor: "bg-purple-500/10" },
    { icon: <MdCheckCircleOutline />, label: "Resolved", count: 54, color: "text-green-400", bgColor: "bg-green-500/10" },
    { icon: <MdTrendingUp />, label: "Trending", count: 8, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  ];

  const posts: Post[] = [
    {
      id: 1,
      author: "Shamim Hossain",
      avatar: "SH",
      timestamp: "15 hours ago",
      title: "How to Verify Certificates",
      description: "Learn the step-by-step process of verifying certifications in the Smart Inventory System. Includes best practices and troubleshooting tips.",
      category: "Course Topics",
      categoryColor: "text-blue-400",
      categoryBg: "bg-blue-500/20",
      status: "Reopened",
      comments: 12,
      likes: 45,
      views: 234,
      tags: ["certification", "verification", "guide"]
    },
    {
      id: 2,
      author: "Nasib Hossain",
      avatar: "NH",
      timestamp: "2 days ago",
      title: "Inventory Count Mismatch Issue",
      description: "Users are reporting discrepancies between manual counts and system records. This appears to be related to bulk imports.",
      category: "Bug Reports",
      categoryColor: "text-yellow-400",
      categoryBg: "bg-yellow-500/20",
      status: "In Progress",
      comments: 8,
      likes: 23,
      views: 156,
      tags: ["bug", "inventory", "import"]
    },
    {
      id: 3,
      author: "Rana Aktar",
      avatar: "RA",
      timestamp: "3 days ago",
      title: "Add Real-time Inventory Tracking",
      description: "Would love to see real-time inventory tracking with live updates and notifications when stock levels change significantly.",
      category: "Feature Requests",
      categoryColor: "text-pink-400",
      categoryBg: "bg-pink-500/20",
      status: "Planned",
      comments: 34,
      likes: 89,
      views: 567,
      tags: ["feature", "tracking", "realtime"]
    },
    {
      id: 4,
      author: "Admin Team",
      avatar: "AT",
      timestamp: "1 week ago",
      title: "System Maintenance Scheduled",
      description: "Scheduled maintenance will occur on April 15, 2026 from 2 AM to 4 AM UTC. Expect brief service interruptions.",
      category: "Announcements",
      categoryColor: "text-purple-400",
      categoryBg: "bg-purple-500/20",
      status: "Active",
      comments: 5,
      likes: 12,
      views: 789,
      tags: ["maintenance", "announcement"]
    },
    {
      id: 5,
      author: "Support Team",
      avatar: "ST",
      timestamp: "5 days ago",
      title: "Certificate Verification System Now Live",
      description: "The certificate verification feature has been successfully rolled out to all users. Check your dashboard for more details.",
      category: "Announcements",
      categoryColor: "text-purple-400",
      categoryBg: "bg-purple-500/20",
      status: "Resolved",
      comments: 23,
      likes: 145,
      views: 1204,
      tags: ["feature", "release", "certificates"]
    },
  ];

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "recent") {
      return filtered.sort((a, b) => posts.indexOf(a) - posts.indexOf(b));
    } else if (sortBy === "popular") {
      return filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === "trending") {
      return filtered.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    }
    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const getAvatarColor = (letter: string): string => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-orange-500", "bg-yellow-500"];
    return colors[letter.charCodeAt(0) % colors.length];
  };

  const getStatusBadgeStyle = (status: string): { bg: string; color: string } => {
    const statusStyles: Record<string, { bg: string; color: string }> = {
      "Reopened": { bg: "bg-red-500/20", color: "text-red-400" },
      "In Progress": { bg: "bg-yellow-500/20", color: "text-yellow-400" },
      "Planned": { bg: "bg-blue-500/20", color: "text-blue-400" },
      "Active": { bg: "bg-green-500/20", color: "text-green-400" },
      "Resolved": { bg: "bg-emerald-500/20", color: "text-emerald-400" },
    };
    return statusStyles[status] || { bg: "bg-gray-500/20", color: "text-gray-400" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pb-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Smart Inventory Help Center
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get answers, share insights, and grow together with our community. Ask questions, report bugs, and request features.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left: Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* 1. Create Post Section */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${getAvatarColor("U")}`}>
                  U
                </div>
                <input
                  type="text"
                  placeholder="Share your question or insight with the community..."
                  onClick={openModal}
                  readOnly
                  className="flex-1 bg-slate-600/30 hover:bg-slate-600/40 rounded-full px-6 py-3 text-sm text-gray-200 placeholder-gray-400 outline-none border border-white/10 focus:border-purple-500/50 cursor-pointer transition"
                />
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
                >
                  <HiOutlinePhotograph size={18} /> Add Media
                </button>
                <button
                  type="button"
                  onClick={openModal}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition shadow-lg"
                >
                  Create Post
                </button>
              </div>
            </div>

            {/* 2. Filter & Search Section */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-slate-600/30 rounded-xl border border-white/10">
                  <Link
                    href=""
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-purple-600/50 border border-purple-500/50 transition"
                  >
                    All Posts
                  </Link>
                  <Link
                    href="mypost"
                    className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition"
                  >
                    My Posts
                  </Link>
                </div>

                {/* Search & Sort */}
                <div className="flex gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-slate-600/30 px-4 py-2 rounded-xl border border-white/10 flex-1 lg:flex-none">
                    <HiOutlineSearch className="text-gray-500" size={18} />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent outline-none text-sm flex-1 placeholder-gray-500"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-slate-600/30 rounded-xl border border-white/10 text-sm font-bold text-gray-300 outline-none hover:bg-slate-600/50 transition"
                  >
                    <option value="recent">Recent</option>
                    <option value="popular">Popular</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition ${selectedCategory === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-white/10"
                  }`}
              >
                All
              </button>
              {["Course Topics", "Bug Reports", "Feature Requests", "Announcements"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition ${selectedCategory === cat
                      ? "bg-purple-600 text-white"
                      : "bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-white/10"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 4. Posts List */}
            <div className="space-y-4">
              {filteredAndSortedPosts.map((post) => (
                <div key={post.id} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition shadow-xl group">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${getAvatarColor(post.avatar[0])} text-lg`}>
                        {post.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{post.author}</h4>
                        <p className="text-xs text-gray-400">{post.timestamp}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeStyle(post.status).bg} ${getStatusBadgeStyle(post.status).color}`}>
                      {post.status}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">{post.title}</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">{post.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Post Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <button className="flex items-center gap-1 hover:text-purple-400 transition">
                        <BiMessageRoundedDetail size={16} /> {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-pink-400 transition">
                        <HiOutlineStar size={16} /> {post.likes}
                      </button>
                      <span className="flex items-center gap-1">
                        <MdTrendingUp size={16} /> {post.views}
                      </span>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${post.categoryBg} ${post.categoryColor} border ${post.categoryColor}20`}>
                      {post.category}
                    </div>
                  </div>
                </div>
              ))}

              {filteredAndSortedPosts.length === 0 && (
                <div className="text-center py-12">
                  <HiOutlineSearch size={48} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-300 font-bold">No posts found matching your search.</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Categories Card */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setSelectedCategory(item.label)}
                      className={`w-full flex items-center justify-between text-xs font-bold p-3 rounded-lg transition ${selectedCategory === item.label
                          ? `${item.bgColor} ${item.color} border border-white/20`
                          : "hover:bg-white/5 text-gray-300"
                        }`}
                    >
                      <div className={`flex items-center gap-2 ${item.color}`}>
                        {item.icon} {item.label}
                      </div>
                      <span className="bg-white/10 px-2 py-0.5 rounded">{item.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-green-700/30 to-emerald-800/30 backdrop-blur-xl rounded-2xl border border-green-500/30 p-5 shadow-xl">
                <h3 className="text-sm font-bold text-green-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-xs text-green-200/80">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Be clear and specific in your posts</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Search before posting duplicates</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Include relevant details and tags</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Check our FAQs first</span>
                  </li>
                </ul>
              </div>

              {/* Download Resources */}
              <div className="bg-gradient-to-br from-blue-700/30 to-cyan-800/30 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-5 shadow-xl">
                <h3 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                  <FiDownload size={16} /> Resources
                </h3>
                <button className="w-full flex items-center justify-between text-xs font-bold py-2 px-3 bg-blue-600/30 hover:bg-blue-600/40 rounded-lg text-blue-200 transition">
                  <span>Documentation</span>
                  <FiArrowRight size={14} />
                </button>
                <button className="w-full flex items-center justify-between text-xs font-bold py-2 px-3 mt-2 bg-blue-600/30 hover:bg-blue-600/40 rounded-lg text-blue-200 transition">
                  <span>Video Tutorials</span>
                  <FiArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <CreatePostModal onClose={closeModal} />}
    </div>
  );
};

export default AllPost;