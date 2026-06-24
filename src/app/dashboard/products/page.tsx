"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Package, RefreshCw, X } from "lucide-react";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardButton,
  DashboardEmptyState,
} from "@/components/dashboard/DashboardUI";

interface Product {
  _id: string;
  name: string;
  categoryId?: { _id: string; name: string } | string;
  price: number;
  stockQuantity: number;
  minimumStockThreshold: number;
  status?: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: "",
    price: "",
    stockQuantity: "",
    minimumStockThreshold: "",
    description: "",
    sku: "",
  });

  const normalizeCategories = (items: Category[] = []) =>
    items.map((cat) => ({
      _id: String(cat._id),
      name: cat.name,
    }));

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const catRes = await fetch("/api/categories", { cache: "no-store" });
      const catData = await catRes.json();
      if (!catRes.ok || !catData.success) {
        throw new Error(catData.error || "Failed to load categories");
      }
      setCategories(normalizeCategories(catData.categories || []));
    } catch (err: any) {
      setFormError(err.message || "Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
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
      setCategories(normalizeCategories(catData.categories || []));
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    if (showForm) {
      setFormError(null);
      loadCategories();
    }
  }, [showForm]);

  const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleQuickCreateCategory = async () => {
    const name = quickCategoryName.trim();
    if (!name) {
      setFormError("Enter a category name first");
      return;
    }

    setCreatingCategory(true);
    setFormError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description: "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create category");
      }

      const created = {
        _id: String(data.category._id),
        name: data.category.name,
      };
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewProduct((prev) => ({ ...prev, categoryId: created._id }));
      setQuickCategoryName("");
    } catch (err: any) {
      setFormError(err.message || "Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleLoadDemoData = async () => {
    setCreatingCategory(true);
    setFormError(null);
    try {
      const res = await fetch("/api/demo-data", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load demo data");
      }
      await loadCategories();
    } catch (err: any) {
      setFormError(err.message || "Failed to load demo data");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleAddProduct = async () => {
    setFormError(null);

    if (!newProduct.name.trim()) return setFormError("Product name is required");
    if (!newProduct.categoryId) return setFormError("Please select a category");
    if (!newProduct.price) return setFormError("Price is required");
    if (!newProduct.stockQuantity) return setFormError("Stock quantity is required");
    if (!newProduct.minimumStockThreshold) return setFormError("Minimum stock threshold is required");

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          categoryId: newProduct.categoryId,
          price: Number(newProduct.price),
          stockQuantity: Number(newProduct.stockQuantity),
          minimumStockThreshold: Number(newProduct.minimumStockThreshold),
          description: newProduct.description.trim(),
          sku: newProduct.sku.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create product");

      // Reset form
      setNewProduct({
        name: "",
        categoryId: "",
        price: "",
        stockQuantity: "",
        minimumStockThreshold: "",
        description: "",
        sku: "",
      });
      setShowForm(false);
      loadProducts();
    } catch (err: any) {
      setFormError(err.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryName = typeof p.categoryId === "string" ? p.categoryId : p.categoryId?.name;
    const categoryMatch = categoryFilter ? categoryName === categoryFilter : true;
    return nameMatch && categoryMatch;
  });

  return (
    <section className="min-h-screen">
      <DashboardPageHeader
        title="Products"
        description="Manage inventory items, pricing, stock levels, and categories."
        actions={
          <>
            <DashboardButton variant="secondary" onClick={loadProducts}>
              <RefreshCw size={16} /> Refresh
            </DashboardButton>
            <DashboardButton onClick={() => { setShowForm(true); setFormError(null); setQuickCategoryName(""); }}>
              <Plus size={16} /> Add Product
            </DashboardButton>
          </>
        }
      />

      {/* Add Product Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Product</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Product name *"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category *
                </label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  disabled={loadingCategories}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white disabled:opacity-60"
                >
                  <option value="">
                    {loadingCategories ? "Loading categories..." : "-- Select Category --"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>

                {categories.length === 0 && !loadingCategories && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 space-y-3">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      No categories found. Create one below or load demo data.
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={quickCategoryName}
                        onChange={(e) => setQuickCategoryName(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleQuickCreateCategory}
                        disabled={creatingCategory}
                        className="px-3 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700 disabled:opacity-50"
                      >
                        {creatingCategory ? "..." : "Add"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadDemoData}
                      disabled={creatingCategory}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                    >
                      Load demo categories & products
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Price *"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                  <input
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                    placeholder="Stock qty *"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <input
                  value={newProduct.minimumStockThreshold}
                  onChange={(e) => setNewProduct({ ...newProduct, minimumStockThreshold: e.target.value })}
                  placeholder="Minimum stock threshold *"
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />

                <input
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="SKU (optional)"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />

                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>

              {formError && <p className="mt-2 text-sm text-red-500">{formError}</p>}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <Plus size={16} /> {submitting ? "Adding..." : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Table */}
        <DashboardPanel title="Product List" subtitle={`${filtered.length} of ${products.length} items`}>
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
                <option value={cat.name} key={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div className="text-right text-sm text-slate-500 dark:text-slate-300 self-center">
              {filtered.length} of {products.length} products
            </div>
          </div>

          {loading ? (
            <div className="py-14 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto" />
            </div>
          ) : error ? (
            <div className="py-14 text-center text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <DashboardEmptyState
              icon={Package}
              title="No products yet"
              description="Add your first product using the button above."
              actionLabel="Add Product"
              onAction={() => setShowForm(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Min Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((prod) => (
                    <tr
                      key={prod._id}
                      className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{prod.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {typeof prod.categoryId === "string" ? prod.categoryId : prod.categoryId?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={prod.stockQuantity <= prod.minimumStockThreshold ? "text-red-500 font-semibold" : ""}>
                          {prod.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">৳{prod.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                        {prod.minimumStockThreshold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardPanel>
    </section>
  );
}