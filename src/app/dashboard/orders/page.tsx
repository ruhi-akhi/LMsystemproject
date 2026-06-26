"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Filter, Eye, Edit, Trash2, ShoppingCart } from "lucide-react";

interface Order {
  source: "dashboard" | "qr";
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: {
    productId?: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
  paymentMethod?: string;
  bkashTrxID?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState<"pending" | "confirmed" | "shipped" | "delivered" | "cancelled">("pending");

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch both dashboard orders and QR scan orders
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

      const [dashboardResponse, qrResponse] = await Promise.all([
        fetch(`/api/orders?page=${currentPage}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}${selectedStatus ? `&status=${selectedStatus}` : ''}`, {
          headers: authHeader,
        }),
        fetch(`/api/scan-orders?page=${currentPage}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}${selectedStatus ? `&status=${selectedStatus}` : ''}`, {
          headers: authHeader,
        })
      ]);

      const dashboardData = await dashboardResponse.json();
      const qrData = await qrResponse.json();

      let allOrders: Order[] = [];

      // Add dashboard orders if available
      if (dashboardData.success && dashboardData.orders) {
        allOrders = [...allOrders, ...dashboardData.orders.map((order: any) => ({ ...order, source: "dashboard" }))];
      }

      // Add QR scan orders if available
      if (qrData.success && qrData.orders) {
        const qrOrders = qrData.orders.map((order: any) => ({
          _id: order._id,
          orderNumber: order._id.slice(-8).toUpperCase(),
          customerName: "QR Customer",
          customerEmail: "",
          items: [{ 
            productName: order.productName, 
            quantity: order.quantity,
            price: order.totalPrice / order.quantity,
            subtotal: order.totalPrice
          }],
          totalAmount: order.totalPrice,
          status: order.paymentStatus === "paid" ? "confirmed" : order.paymentStatus === "pending" ? "pending" : "cancelled",
          createdAt: order.createdAt,
          paymentMethod: order.paymentMethod,
          bkashTrxID: order.bkashTrxID,
          source: "qr"
        }));
        allOrders = [...allOrders, ...qrOrders];
      }

      // Sort by creation date (newest first)
      allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(allOrders);
      setTotalPages(Math.max(
        dashboardData.pagination?.pages || 1,
        qrData.pagination?.pages || 1
      ));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, source: "dashboard" | "qr") => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    if (source !== "dashboard") {
      toast.error("QR orders cannot be deleted from this dashboard.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete order");
      toast.success("Order deleted successfully");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error: any) {
      toast.error(error.message || "Could not delete order");
    }
  };

  const handleStartEdit = (order: Order) => {
    setEditingOrderId(order._id);
    setUpdatedStatus(order.status);
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
  };

  const handleSaveStatus = async (orderId: string, source: "dashboard" | "qr") => {
    if (source !== "dashboard") {
      toast.error("QR orders cannot be updated from this dashboard.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ orderId, status: updatedStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");
      toast.success("Order status updated");
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, status: updatedStatus } : order));
      setEditingOrderId(null);
    } catch (error: any) {
      toast.error(error.message || "Could not update order status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-600">Manage customer orders and fulfillment</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{orders.length} orders found</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">Start by creating your first order.</p>
          <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Plus size={20} className="mr-2" />
            Create Order
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {order.orderNumber}
                      {order.bkashTrxID && (
                        <div className="text-xs text-green-600 font-mono">
                          TrxID: {order.bkashTrxID}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      {order.customerEmail && (
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      )}
                      {order.paymentMethod && (
                        <div className="text-xs text-blue-600 capitalize">
                          via {order.paymentMethod}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      <div className="text-xs text-gray-500">
                        {order.items.map(item => item.productName).join(', ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ৳{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      {editingOrderId === order._id ? (
                        <>
                          <select
                            value={updatedStatus}
                            onChange={(e) => setUpdatedStatus(e.target.value as any)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 mr-2"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleSaveStatus(order._id, order.source)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900 ml-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(order)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id, order.source)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}