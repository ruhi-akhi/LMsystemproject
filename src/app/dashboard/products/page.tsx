"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Package, RefreshCw } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  categoryId?: { name: string } | string;
  price: number;
  stockQuantity: number;
  minimumStockThreshold: number;
  status?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (categoryFilter) params.append("category", categoryFilter);
      if (searchTerm) params.append("search", searchTerm);

      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/products?${params}`),
        fetch(`/api/categories`),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (!prodRes.ok || !prodData.success) throw new Error(prodData.error || "Failed product list");
      if (!catRes.ok || !catData.success) throw new Error(catData.error || "Failed category list");

      setProducts(prodData.products || []);
      setCategories((catData.categories || []).map((c: any) => c.name));
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter]);

  const filtered = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryName = typeof p.categoryId === "string" ? p.categoryId : p.categoryId?.name;
    const categoryMatch = categoryFilter ? categoryName === categoryFilter : true;
    return nameMatch && categoryMatch;
  });

  return (
    <section className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-3 justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package size={24} /> Products
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Smart Inventory & Order Management System - product management panel</p>
          </div>
          <button onClick={loadProducts} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-100 transition">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="Search product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option value={cat} key={cat}>{cat}</option>
              ))}
            </select>
            <div className="text-right text-sm text-slate-500 dark:text-slate-300">
              {filtered.length} of {products.length} products
            </div>
          </div>

          {loading ? (
            <div className="py-14 text-center">Loading products...</div>
          ) : error ? (
            <div className="py-14 text-center text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center text-slate-500">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((prod) => (
                    <tr key={prod._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{prod.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{typeof prod.categoryId === "string" ? prod.categoryId : prod.categoryId?.name || "-"}</td>
                      <td className="px-4 py-3 text-right">{prod.stockQuantity}</td>
                      <td className="px-4 py-3 text-right">৳{prod.price.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right ${prod.stockQuantity <= prod.minimumStockThreshold ? "text-red-500 font-semibold" : "text-slate-600 dark:text-slate-300"}`}>
                        {prod.minimumStockThreshold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
