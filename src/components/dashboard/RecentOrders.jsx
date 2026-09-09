import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../../data/mockData';

export default function RecentOrders({ orders, onSelectOrder }) {
  const [sortKey, setSortKey] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Sorting logic
  const sortedOrders = [...orders].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'date') {
      comparison = a.id.localeCompare(b.id);
    } else if (sortKey === 'total') {
      comparison = a.total - b.total;
    } else if (sortKey === 'customer') {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortKey === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setIsSortOpen(false);
  };

  return (
    <motion.div
      id="recent-orders-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-100/90"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          Recent Orders
        </h2>

        <div className="relative">
          <button
            id="orders-sort-by-btn"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Sort by</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                id="orders-sort-menu"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-xs font-medium text-slate-700"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sort Orders
                </div>
                {[
                  { key: 'date', label: 'Order ID' },
                  { key: 'total', label: 'Total Amount' },
                  { key: 'customer', label: 'Customer Name' },
                  { key: 'status', label: 'Status' },
                ].map((item) => (
                  <button
                    key={item.key}
                    id={`sort-option-${item.key}`}
                    onClick={() => handleSortChange(item.key)}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      sortKey === item.key ? 'text-[#0e8749] font-semibold bg-emerald-50/50' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    {sortKey === item.key && (
                      <span className="text-[10px] uppercase text-emerald-600 font-bold">
                        {sortOrder}
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          {/* Table Header with styled mint background pills matching design */}
          <thead>
            <tr className="text-xs font-semibold">
              <th className="pb-3 pr-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-3 rounded-lg text-center">
                  Product
                </div>
              </th>
              <th className="pb-3 px-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-3 rounded-lg text-center">
                  Orders ID
                </div>
              </th>
              <th className="pb-3 px-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-3 rounded-lg text-center">
                  Customer Name
                </div>
              </th>
              <th className="pb-3 px-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-3 rounded-lg text-center">
                  Date
                </div>
              </th>
              <th className="pb-3 px-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-2 rounded-lg text-center">
                  Item
                </div>
              </th>
              <th className="pb-3 px-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-3 rounded-lg text-center">
                  Price
                </div>
              </th>
              <th className="pb-3 px-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-3 rounded-lg text-center">
                  Total
                </div>
              </th>
              <th className="pb-3 pl-2">
                <div className="bg-[#e4f9ee] text-slate-700 py-1.5 px-3 rounded-lg text-center">
                  Status
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {sortedOrders.slice(0, 6).map((order) => {
              const isCompleted = order.status === 'Completed' || order.status === 'Delivered';

              return (
                <tr
                  key={order.id}
                  id={`recent-order-row-${order.id.replace('#', '')}`}
                  onClick={() => onSelectOrder && onSelectOrder(order)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Product */}
                  <td className="py-3 pr-2 font-medium text-slate-800">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <span className="truncate max-w-[80px] sm:max-w-[110px]" title={order.productName}>
                        {order.productShort}
                      </span>
                    </div>
                  </td>

                  {/* Orders ID */}
                  <td className="py-3 px-2 text-slate-500 font-medium text-center">
                    {order.id}
                  </td>

                  {/* Customer Name */}
                  <td className="py-3 px-2 text-slate-800 font-medium text-center truncate max-w-[120px]">
                    {order.customerName}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-2 text-slate-500 text-center whitespace-nowrap">
                    {order.date}
                  </td>

                  {/* Item */}
                  <td className="py-3 px-2 text-slate-700 text-center font-medium">
                    {order.itemCount}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-2 text-slate-700 text-center font-medium">
                    {formatPKR(order.price)}
                  </td>

                  {/* Total */}
                  <td className="py-3 px-2 text-slate-800 text-center font-bold">
                    {formatPKR(order.total)}
                  </td>

                  {/* Status */}
                  <td className="py-3 pl-2 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isCompleted
                          ? 'bg-[#e4f9ee] text-[#10b981]'
                          : order.status === 'Pending'
                          ? 'bg-[#fde8e8] text-[#e02424]'
                          : order.status === 'On Delivery'
                          ? 'bg-[#e2f6fd] text-[#0ea5e9]'
                          : order.status === 'Returned'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
