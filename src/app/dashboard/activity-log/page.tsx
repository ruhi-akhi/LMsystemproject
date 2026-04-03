"use client";

import { useEffect, useState } from "react";
import { Search, RefreshCw, Activity, User, CalendarDays } from "lucide-react";

interface ActivityLogEntry {
  _id: string;
  action: string;
  description: string;
  userId?: string;
  userName: string;
  userRole?: string;
  entityType: string;
  entityName?: string;
  createdAt: string;
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityType, setEntityType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "25",
      });
      if (searchTerm) params.set("search", searchTerm);
      if (entityType) params.set("entityType", entityType);
      if (dateRange) params.set("dateRange", dateRange);

      const res = await fetch(`/api/activity-log?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not fetch activity logs");
      }

      setActivities(data.activities || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalRecords(data.pagination?.total || 0);
    } catch (err: any) {
      console.error("Activity log fetch failed:", err);
      setError(err?.message || "Unable to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, entityType, dateRange, currentPage]);

  const handleRefresh = () => {
    setCurrentPage(1);
    loadActivities();
  };

  return (
    <section className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-3 justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={24} /> Activity Log
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Track actions by users and system events.</p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-100 transition"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search action, user, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-900 dark:text-white"
            >
              <option value="">All entity types</option>
              <option value="product">Product</option>
              <option value="order">Order</option>
              <option value="category">Category</option>
              <option value="stock">Stock</option>
              <option value="user">User</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-900 dark:text-white"
            >
              <option value="">Any date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 days</option>
              <option value="month">This month</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{totalRecords.toLocaleString()} events</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={14} />
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center text-slate-500 dark:text-slate-300">
            No activity records found.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200 w-40">{new Date(activity.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{activity.userName || "Unknown"}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200 uppercase tracking-wide">{activity.action}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{activity.entityType}{activity.entityName ? ` / ${activity.entityName}` : ""}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200 max-w-xl truncate" title={activity.description}>{activity.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
