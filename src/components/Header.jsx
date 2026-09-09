import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  CheckCircle2,
  Package,
  User,
  LogOut,
  Settings
} from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  onOpenMobileMenu,
  onNavigate,
  currentUser,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userName = currentUser?.name || 'Rao Mudassir';
  const userFirstName = userName.split(' ')[0] || 'Mudassir';
  const userRole = currentUser?.role || 'Store Manager (Pakistan)';
  const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';

  const notifications = [
    { id: 1, title: 'New order #PK-127387 received', time: '10m ago', unread: true },
    { id: 2, title: 'Payment of ₨ 12,500 confirmed for #PK-127383', time: '1h ago', unread: true },
    { id: 3, title: 'Low stock alert: Festive Chiffon Suit', time: '3h ago', unread: false },
    { id: 4, title: 'Shipment #PK-127381 dispatched via TCS', time: '5h ago', unread: false },
  ];

  return (
    <header
      id="main-app-header"
      className="bg-transparent px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-30"
    >
      {/* Left: Mobile Menu & Greeting */}
      <div className="flex items-center justify-between md:justify-start gap-3">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs hover:bg-slate-50"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800">
            Hello, {userFirstName}
          </h1>
          <span className="text-2xl select-none" role="img" aria-label="Waving hand">
            👋
          </span>
        </div>

        {/* Small screen quick avatar */}
        <div className="md:hidden flex items-center gap-2">
          <button
            id="mobile-profile-toggle-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center"
          >
            <img
              src={userAvatar}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
          </button>
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-md w-full mx-auto md:mx-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="header-product-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your product"
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/90 border border-slate-200/80 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="hidden md:flex items-center justify-end gap-3 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            id="header-notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              id="header-notifications-dropdown"
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-800">Notifications</span>
                <span className="text-[11px] font-medium text-emerald-600 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-slate-50 flex items-start gap-3 cursor-pointer transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-800 leading-tight">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                    </div>
                    {item.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('order');
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View all order updates
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            id="header-user-profile-menu-btn"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full transition-colors shadow-xs"
          >
            <img
              src={userAvatar}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <span className="text-sm font-semibold text-slate-800 tracking-tight">
              {userName}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              id="header-profile-dropdown"
              className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userRole}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('user');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Account Settings</span>
                </button>
                <button
                  id="header-profile-logout-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
