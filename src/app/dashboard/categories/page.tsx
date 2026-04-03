"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, RefreshCw, FolderOpen } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive?: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not fetch categories");
      setCategories(data.categories || []);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async () => {
    if (!newName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not create category");
      }

      setNewName("");
      setNewDescription("");
      loadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-3 justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen size={24} /> Categories
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Smart Inventory & Order Management System - Manage classification and chart of products</p>
          </div>
          <button
            onClick={loadCategories}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-100 transition"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-300">{filtered.length} of {categories.length} categories</div>
            </div>

            {loading ? (
              <div className="py-16 text-center">Loading categories...</div>
            ) : error ? (
              <div className="py-12 text-center text-red-500">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No category matched.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((cat) => (
                      <tr key={cat._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{cat.name}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-200">{cat.description || "No description"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Add Category</h2>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="w-full mb-3 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full mb-3 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              rows={3}
            />
            <button
              onClick={createCategory}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
            >
              <Plus size={16} /> Create Category
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
