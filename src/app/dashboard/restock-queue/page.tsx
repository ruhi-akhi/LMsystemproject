"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Plus, RefreshCw, CheckCircle2, Trash2 } from "lucide-react";

interface RestockItem {
  _id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minimumThreshold: number;
  requestedQuantity: number;
  priority: string;
  supplier?: string;
  estimatedCost: number;
  notes?: string;
  status: string;
  createdAt: string;
}

export default function RestockQueuePage() {
  const [items, setItems] = useState<RestockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [newItem, setNewItem] = useState({
    productId: "",
    productName: "",
    currentStock: "",
    minStockLevel: "",
    suggestedQuantity: "",
    priority: "medium",
    supplier: "",
    estimatedCost: "",
    notes: "",
  });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (priorityFilter) params.set("priority", priorityFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/restock-queue?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load restock queue");
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm, priorityFilter, statusFilter]);

  const addItem = async () => {
    if (!newItem.productId || !newItem.productName) {
      setError("Product ID and name are required");
      return;
    }

    try {
      const payload = {
        productId: newItem.productId,
        productName: newItem.productName,
        currentStock: Number(newItem.currentStock),
        minStockLevel: Number(newItem.minStockLevel),
        suggestedQuantity: Number(newItem.suggestedQuantity),
        priority: newItem.priority,
        supplier: newItem.supplier,
        estimatedCost: Number(newItem.estimatedCost),
        notes: newItem.notes,
      };

      const res = await fetch("/api/restock-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to create restock entry");
      setNewItem({
        productId: "",
        productName: "",
        currentStock: "",
        minStockLevel: "",
        suggestedQuantity: "",
        priority: "medium",
        supplier: "",
        estimatedCost: "",
        notes: "",
      });
      fetchItems();
    } catch (err: any) {
      setError(err?.message || "Failed to add item");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/restock-queue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not update status");
      fetchItems();
    } catch (err: any) {
      setError(err?.message || "Failed to update status");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/restock-queue?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not delete item");
      fetchItems();
    } catch (err: any) {
      setError(err?.message || "Failed to delete item");
    }
  };

  return (
    <section className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-3 justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Filter size={24} /> Restock Queue
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Track products that need restocking and manage statuses.</p>
          </div>
          <button onClick={fetchItems} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-100 transition">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
              <div className="relative w-full lg:w-1/2">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search queue by item, supplier, notes..."
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">All priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="ordered">Ordered</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto" />
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-500">{error}</div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-300">No restock items available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="px-3 py-2">Product</th>
                      <th className="px-3 py-2">Current / Min</th>
                      <th className="px-3 py-2">Qty</th>
                      <th className="px-3 py-2">Priority</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Supplier</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-3 py-2 font-semibold text-slate-800 dark:text-white">{item.productName}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.currentStock} / {item.minimumThreshold ?? "-"}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.requestedQuantity ?? item.suggestedQuantity ?? "-"}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${item.priority === "high" ? "bg-red-100 text-red-700" : item.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.status}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.supplier || "-"}</td>
                        <td className="px-3 py-2 flex gap-1">
                          <button
                            onClick={() => updateStatus(item._id, item.status === "pending" ? "ordered" : item.status === "ordered" ? "completed" : "completed")}
                            className="inline-flex items-center px-2 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            <CheckCircle2 size={14} />
                            <span className="ml-1">{item.status === "pending" ? "Mark Ordered" : item.status === "ordered" ? "Mark Completed" : "Completed"}</span>
                          </button>
                          <button
                            onClick={() => deleteItem(item._id)}
                            className="inline-flex items-center px-2 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Add Restock Item</h2>
            <div className="space-y-2">
              <input
                value={newItem.productId}
                onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                placeholder="Product ID"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
              <input
                value={newItem.productName}
                onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                placeholder="Product name"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem({ ...newItem, currentStock: e.target.value })}
                  placeholder="Current stock"
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />
                <input
                  value={newItem.minStockLevel}
                  onChange={(e) => setNewItem({ ...newItem, minStockLevel: e.target.value })}
                  placeholder="Minimum stock level"
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
              <input
                value={newItem.suggestedQuantity}
                onChange={(e) => setNewItem({ ...newItem, suggestedQuantity: e.target.value })}
                placeholder="Suggested quantity"
                type="number"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                placeholder="Supplier"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
              <input
                value={newItem.estimatedCost}
                onChange={(e) => setNewItem({ ...newItem, estimatedCost: e.target.value })}
                placeholder="Estimated cost"
                type="number"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
              <textarea
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                placeholder="Notes"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
            <button onClick={addItem} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition">
              <Plus size={16} /> Add to Restock Queue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
