import React from 'react';
import { X, CheckCircle2, Clock, Truck, RotateCcw, Ban, MapPin, CreditCard, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../../data/mockData';

export default function OrderDetailModal({ order, isOpen, onClose, onUpdateStatus }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return <CheckCircle2 className="w-5 h-5 text-[#10b981]" />;
      case 'On Delivery':
        return <Truck className="w-5 h-5 text-[#06b6d4]" />;
      case 'Returned':
        return <RotateCcw className="w-5 h-5 text-[#ef4444]" />;
      case 'Canceled':
        return <Ban className="w-5 h-5 text-[#f59e0b]" />;
      default:
        return <Clock className="w-5 h-5 text-[#e02424]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">Order {order.id}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.status === 'Completed' || order.status === 'Delivered'
                        ? 'bg-[#e4f9ee] text-[#10b981]'
                        : order.status === 'Pending'
                        ? 'bg-[#fde8e8] text-[#e02424]'
                        : order.status === 'On Delivery'
                        ? 'bg-[#e2f6fd] text-[#0ea5e9]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Placed on {order.date}
                </p>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="space-y-4 text-xs sm:text-sm mb-6">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-medium mb-1">Customer Information</p>
                <div className="flex items-center gap-3">
                  <img
                    src={order.customerAvatar}
                    alt={order.customerName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{order.customerName}</h4>
                    <p className="text-slate-500 text-xs">{order.customerEmail}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Delivery Address (Pakistan)</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">{order.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Payment Gateway</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Product Purchased Item */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 mb-6">
              <p className="text-xs font-semibold text-slate-700 mb-2">Item Details</p>
              <div className="flex items-center gap-3">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{order.productName}</h4>
                  <p className="text-[11px] text-slate-400">Qty: {order.itemCount} × {formatPKR(order.price)}</p>
                </div>
                <span className="text-xs font-extrabold text-slate-900">
                  {formatPKR(order.total)}
                </span>
              </div>

              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2.5 mt-2.5 border-t border-slate-200/60">
                <span>Total Amount</span>
                <span className="text-emerald-700">{formatPKR(order.total)}</span>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-2">Update Order Status:</p>
              <div className="flex flex-wrap gap-2">
                {['Pending', 'On Delivery', 'Delivered', 'Canceled'].map((newStatus) => (
                  <button
                    key={newStatus}
                    onClick={() => {
                      onUpdateStatus(order.id, newStatus);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      order.status === newStatus
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Mark as {newStatus}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
