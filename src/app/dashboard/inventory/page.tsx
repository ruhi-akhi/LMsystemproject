"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Package, ShoppingCart, AlertTriangle,
  DollarSign, Clock, CheckCircle, XCircle, RefreshCw,
  Plus, FolderOpen
} from "lucide-react";
import Link from "next/link";
import {
  DashboardPageHeader,
  DashboardStatCard,
  DashboardPanel,
  DashboardButton,
  DashboardEmptyState,
} from "@/components/dashboard/DashboardUI";

interface DashboardData {
  totalOrdersToday: number;
  pendingOrders: number;
  completedOrders: number;
  revenueToday: number;
  lowStockCount: number;
  outOfStockCount: number;
  restockQueueCount: number;
  totalProducts: number;
  totalCategories: number;
  orderStatusBreakdown: Record<string, number>;
  productSummary: Array<{
    id: string;
    name: string;
    stock: number;
    threshold: number;
    category: string;
    status: string;
  }>;
  recentActivities: Array<{
    id: string;
    time: string;
    description: string;
    userName: string;
    entityType: string;
  }>;
}

const InventoryDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/dashboard-inventory", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      
      const result = await response.json();
      setData(result.dashboard);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const statCards = [
    {
      title: "Orders Today",
      value: data?.totalOrdersToday || 0,
      icon: ShoppingCart,
      color: "#FF6B35",
      bgColor: "rgba(255, 107, 53, 0.1)",
      change: "+12%",
    },
    {
      title: "Pending Orders",
      value: data?.pendingOrders || 0,
      icon: Clock,
      color: "#FF8C42",
      bgColor: "rgba(255, 140, 66, 0.1)",
      change: "5 new",
    },
    {
      title: "Completed Orders",
      value: data?.completedOrders || 0,
      icon: CheckCircle,
      color: "#1A1A1A",
      bgColor: "rgba(26, 26, 26, 0.1)",
      change: "+8%",
    },
    {
      title: "Revenue Today",
      value: `৳${(data?.revenueToday || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "#FF6B35",
      bgColor: "rgba(255, 107, 53, 0.1)",
      change: "+21%",
    },
    {
      title: "Low Stock Items",
      value: data?.lowStockCount || 0,
      icon: AlertTriangle,
      color: "#E55A2B",
      bgColor: "rgba(229, 90, 43, 0.1)",
      change: "Need attention",
    },
    {
      title: "Total Products",
      value: data?.totalProducts || 0,
      icon: Package,
      color: "#1A1A1A",
      bgColor: "rgba(26, 26, 26, 0.1)",
      change: `${data?.totalCategories || 0} categories`,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
        <div className="w-10 h-10 border-4 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
        <XCircle className="w-14 h-14 text-red-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Error Loading Dashboard</h2>
        <p className="text-slate-500 text-sm">{error}</p>
        <DashboardButton onClick={fetchDashboard}>
          <RefreshCw size={16} /> Try Again
        </DashboardButton>
      </div>
    );
  }

  return (
    <section className="min-h-screen space-y-6">
      <DashboardPageHeader
        title="Inventory Overview"
        description="Real-time snapshot of orders, revenue, stock health, and recent activity."
        actions={
          <>
            <DashboardButton variant="secondary" onClick={fetchDashboard}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </DashboardButton>
            <Link href="/dashboard/products">
              <DashboardButton><Plus size={16} /> Add Product</DashboardButton>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <DashboardStatCard
            key={index}
            label={stat.title}
            value={stat.value}
            hint={stat.change}
            icon={stat.icon}
            accent={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardPanel
            title="Product Summary"
            subtitle="Stock levels and alerts"
            action={
              <Link href="/dashboard/products" className="text-xs font-semibold text-[#FF6B35] hover:underline">
                View all →
              </Link>
            }
          >
            {data?.productSummary && data.productSummary.length > 0 ? (
              <div className="space-y-3">
                {data.productSummary.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate">{product.name}</h4>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-center mx-4">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{product.stock}</p>
                      <p className="text-xs text-slate-400">in stock</p>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === "Low Stock"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
                          : product.status === "Out of Stock"
                          ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                          : "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                icon={Package}
                title="No products yet"
                description="Add products or load demo data to populate this dashboard."
                actionLabel="Go to Products"
                actionHref="/dashboard/products"
              />
            )}
          </DashboardPanel>
        </div>

        <DashboardPanel title="Recent Activities" subtitle="Latest system actions">
          {data?.recentActivities && data.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B35] mt-2 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time} · {activity.userName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              icon={Clock}
              title="No activity yet"
              description="Actions will appear here as you manage inventory."
            />
          )}
        </DashboardPanel>
      </div>

      <DashboardPanel title="Quick Actions" subtitle="Common inventory tasks">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/dashboard/products", icon: Plus, label: "Add Product" },
            { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
            { href: "/dashboard/categories", icon: FolderOpen, label: "Categories" },
            { href: "/dashboard/restock-queue", icon: AlertTriangle, label: "Restock" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center p-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-600 hover:border-[#FF6B35] hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all group"
            >
              <item.icon className="w-7 h-7 text-slate-400 group-hover:text-[#FF6B35] mb-2 transition-colors" />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-[#FF6B35]">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </DashboardPanel>
    </section>
  );
};

export default InventoryDashboard;