import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({
  currentPage,
  setCurrentPage,
  isMobileOpen,
  setIsMobileOpen,
  onLogout
}) {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user', label: 'User', icon: Users },
    { id: 'list', label: 'List', icon: ShoppingBag },
    { id: 'order', label: 'Orders', icon: ClipboardList },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white flex flex-col justify-between border-r border-slate-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Logo & Close for Mobile */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div
              id="berry-brand-logo"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#0e8749] to-[#10b981] flex items-center justify-center text-white font-black text-xl tracking-tight shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                B
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Berry
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 text-[#0e8749] tracking-wider">
                  PK
                </span>
              </div>
            </div>

            <button
              id="close-mobile-sidebar-btn"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5" aria-label="Main Navigation">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0e8749] text-white shadow-sm shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={`w-5 h-5 transition-transform ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && !isActive && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Settings & Log Out */}
        <div className="p-6 pt-4 border-t border-slate-100 space-y-1">
          <button
            id="nav-link-settings"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'settings'
                ? 'bg-[#0e8749] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5 text-slate-500" />
            <span>Settings</span>
          </button>

          <button
            id="nav-link-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-500 hover:text-red-600" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
