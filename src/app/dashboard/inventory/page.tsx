"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Package, ShoppingCart, AlertTriangle, TrendingUp, 
  DollarSign, Clock, CheckCircle, XCircle, RefreshCw,
  Eye, Plus, Search, Filter
} from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg" style={{ color: "#FF6B35" }}></div>
          <p className="mt-4 text-lg font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboard}
            className="btn bg-[#FF6B35] text-white border-0 hover:bg-[#E55A2B]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
            <p className="text-gray-600 mt-1">Smart Inventory & Order Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="btn btn-ghost btn-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button className="btn bg-[#FF6B35] text-white border-0 hover:bg-[#E55A2B]">
              <Plus className="w-4 h-4 mr-2" />
              Quick Actions
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-500 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Product Summary */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Product Summary</h2>
                  <p className="text-sm text-gray-600">Stock levels and alerts</p>
                </div>
                <button className="btn btn-sm bg-[#FF6B35] text-white border-0 hover:bg-[#E55A2B]">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {data?.productSummary && data.productSummary.length > 0 ? (
                <div className="space-y-4">
                  {data.productSummary.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-center mx-4">
                        <p className="text-lg font-bold text-gray-900">{product.stock}</p>
                        <p className="text-xs text-gray-500">in stock</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === "Low Stock"
                              ? "bg-orange-100 text-orange-800"
                              : product.status === "Out of Stock"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No products to display</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
              <p className="text-sm text-gray-600">Latest system actions</p>
            </div>
            
            <div className="p-6">
              {data?.recentActivities && data.recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#FF6B35] mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.time}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{activity.userName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No recent activities</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50 transition-all">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Add Product</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50 transition-all">
              <ShoppingCart className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Create Order</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50 transition-all">
              <AlertTriangle className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Restock Queue</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50 transition-all">
              <Package className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Manage Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;