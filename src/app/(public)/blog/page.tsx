import React from "react";
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import PopularBlogs from "@/components/blog/PopularBlogs";
import BlogSection from "@/components/blog/BlogSection";
import TechUpdateSection from "@/components/blog/TechUpdateSection";
import NewsletterSection from "@/components/blog/NewsletterSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Management Blog - Latest Insights & Updates",
  description:
    "Stay updated with the latest trends, tips, and strategies in smart inventory, logistics, and order management systems.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120]">
      <FeaturedBlog />
      <PopularBlogs />
      <BlogSection />
      <TechUpdateSection />
      <NewsletterSection />
    </div>
  );
}
