import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import ListPage from './pages/ListPage';
import OrderPage from './pages/OrderPage';
import LoginPage from './pages/LoginPage';
import OrderDetailModal from './components/modals/OrderDetailModal';
import { SettingsView } from './components/common/SecondaryViews';
import {
  initialOrders,
  initialCustomers,
  initialProducts
} from './data/mockData';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('berry_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authToast, setAuthToast] = useState('');

  // Navigation State
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // App Data States
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [products, setProducts] = useState(initialProducts);

  // Global Order Detail Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.rememberMe) {
      try {
        localStorage.setItem('berry_auth_user', JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        localStorage.removeItem('berry_auth_user');
      } catch (e) {
        console.error(e);
      }
    }
    setAuthToast(`Welcome back, ${user.name}! Successfully signed in.`);
    setTimeout(() => setAuthToast(''), 4000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('berry_auth_user');
    } catch (e) {
      console.error(e);
    }
    setAuthToast('You have been logged out of Berry.');
    setTimeout(() => setAuthToast(''), 4000);
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      )
    );
  };

  // If user is not authenticated, display the Berry Login Page
  if (!currentUser) {
    return (
      <div className="relative">
        <LoginPage onLogin={handleLogin} />
        {authToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{authToast}</span>
          </div>
        )}
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            orders={orders}
            onSelectOrder={handleSelectOrder}
            onNavigate={(page) => setCurrentPage(page)}
          />
        );
      case 'user':
        return (
          <UserPage
            customers={customers}
            setCustomers={setCustomers}
          />
        );
      case 'list':
        return (
          <ListPage
            products={products}
            setProducts={setProducts}
          />
        );
      case 'order':
        return (
          <OrderPage
            orders={orders}
            setOrders={setOrders}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardPage
            orders={orders}
            onSelectOrder={handleSelectOrder}
            onNavigate={(page) => setCurrentPage(page)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#edf3f0] text-slate-800 antialiased flex flex-col justify-center p-2 sm:p-4 lg:p-6 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {authToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{authToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Canvas Frame matching the design aesthetic */}
      <div className="max-w-[1440px] w-full mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-300/40 border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row min-h-[92vh]">
        {/* Left Sidebar */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col bg-[#f8faf9] min-w-0">
          {/* Top Header */}
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onNavigate={(page) => setCurrentPage(page)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          {/* Page Body with Animated Page Transitions */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 pt-2 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {renderCurrentPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Global Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
