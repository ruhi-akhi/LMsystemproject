"use client";

import { useEffect, useState } from "react";
import { Plus, Search, RefreshCw, FolderOpen, Package } from "lucide-react";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardButton,
  DashboardEmptyState,
  DashboardStatCard,
} from "@/components/dashboard/DashboardUI";

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not fetch categories");
      setCategories(
        (data.categories || []).map((c: Category) => ({
          ...c,
          _id: String(c._id),
        }))
      );
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

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not create category");
      setNewName("");
      setNewDescription("");
      await loadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="min-h-screen">
      <DashboardPageHeader
        title="Categories"
        description="Organize products into clear inventory groups. Default categories are created automatically on first load."
        actions={
          <>
            <DashboardButton variant="secondary" onClick={loadCategories}>
              <RefreshCw size={16} /> Refresh
            </DashboardButton>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardStatCard label="Total Categories" value={categories.length} icon={FolderOpen} />
        <DashboardStatCard label="Active Groups" value={categories.length} icon={Package} accent="#E55A2B" />
        <DashboardStatCard label="Search Results" value={filtered.length} icon={Search} accent="#1A1A1A" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardPanel
            title="All Categories"
            subtitle="Used in products, filters, and reports"
            action={
              <div className="relative w-full max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            }
          >
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-2 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin mx-auto" />
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500 text-sm">{error}</div>
            ) : filtered.length === 0 ? (
              <DashboardEmptyState
                icon={FolderOpen}
                title="No categories found"
                description="Create your first category using the form on the right."
              />
            ) : (
              <div className="overflow-x-auto -mx-1">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100 dark:border-slate-700">
                      <th className="px-3 py-3 font-semibold">Name</th>
                      <th className="px-3 py-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((cat) => (
                      <tr
                        key={cat._id}
                        className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-3 py-3.5 font-semibold text-slate-900 dark:text-white">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                            {cat.name}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-slate-600 dark:text-slate-300">
                          {cat.description || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardPanel>
        </div>

        <DashboardPanel title="Add Category" subtitle="New group for your products">
          <div className="space-y-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name *"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            />
            <DashboardButton onClick={createCategory} disabled={saving}>
              <Plus size={16} /> {saving ? "Saving..." : "Create Category"}
            </DashboardButton>
          </div>
        </DashboardPanel>
      </div>
    </section>
  );
}
