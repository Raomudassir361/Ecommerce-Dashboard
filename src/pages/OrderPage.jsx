import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Ban,
  ArrowUpDown,
  Eye,
  Calendar
} from 'lucide-react';
import OrderDetailModal from '../components/modals/OrderDetailModal';
import { formatPKR } from '../data/mockData';

export default function OrderPage({ orders, setOrders }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const tabs = ['All', 'Delivered', 'On Delivery', 'Pending', 'Canceled', 'Returned'];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === 'All') return matchesSearch;
    if (selectedTab === 'Delivered') {
      return matchesSearch && (order.status === 'Delivered' || order.status === 'Completed');
    }
    return matchesSearch && order.status === selectedTab;
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Order Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track shipment lifecycles, fulfill pending orders, and issue receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#e4f9ee] text-[#10b981]">
            1.6K Total Orders
          </span>
        </div>
      </div>

      {/* Filter Tabs matching shipment statuses */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer, item..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {tabs.map((tab) => {
            const count =
              tab === 'All'
                ? orders.length
                : tab === 'Delivered'
                ? orders.filter((o) => o.status === 'Delivered' || o.status === 'Completed').length
                : orders.filter((o) => o.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedTab === tab
                    ? 'bg-[#0e8749] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedTab === tab
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 bg-slate-50/70">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4 text-center">Date</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-center">Total Amount</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isCompleted = order.status === 'Completed' || order.status === 'Delivered';
                  const isPending = order.status === 'Pending';
                  const isOnDelivery = order.status === 'On Delivery';
                  const isCanceled = order.status === 'Canceled';
                  const isReturned = order.status === 'Returned';

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => openOrderDetails(order)}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {order.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.customerAvatar}
                            alt={order.customerName}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                              {order.customerName}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <span className="font-medium text-slate-800 truncate max-w-[130px]">
                            {order.productName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center text-slate-500 whitespace-nowrap text-xs">
                        {order.date}
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        {order.itemCount}
                      </td>

                      <td className="py-3.5 px-4 text-center font-extrabold text-slate-900">
                        {formatPKR(order.total)}
                      </td>

                      <td className="py-3.5 px-4 text-center text-[11px] text-slate-500 truncate max-w-[100px]">
                        {order.paymentMethod}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            isCompleted
                              ? 'bg-[#e4f9ee] text-[#10b981]'
                              : isPending
                              ? 'bg-[#fde8e8] text-[#e02424]'
                              : isOnDelivery
                              ? 'bg-[#e2f6fd] text-[#0ea5e9]'
                              : isCanceled
                              ? 'bg-[#fef3c7] text-[#d97706]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                          {isPending && <Clock className="w-3 h-3" />}
                          {isOnDelivery && <Truck className="w-3 h-3" />}
                          {isReturned && <RotateCcw className="w-3 h-3" />}
                          {isCanceled && <Ban className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderDetails(order);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
