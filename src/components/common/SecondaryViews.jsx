import React from 'react';

export function SettingsView() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-xs max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Store Preferences</h2>
      <p className="text-xs text-slate-500 mb-6">Manage Berry dashboard settings and currency options.</p>

      <div className="space-y-4 text-xs sm:text-sm">
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-900">Email Notifications</p>
            <p className="text-xs text-slate-400">Receive instant alerts on new pending orders</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0e8749]" />
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-900">Currency Display</p>
            <p className="text-xs text-slate-400">Default store currency</p>
          </div>
          <select className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white">
            <option>PKR (₨) - Pakistani Rupee</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-900">Store Region & Timezone</p>
            <p className="text-xs text-slate-400">Pakistan Standard Time</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
            PKT (UTC+05:00)
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-bold text-slate-900">Two-Factor Authentication</p>
            <p className="text-xs text-slate-400">Secure store admin logins</p>
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#e4f9ee] text-[#10b981]">
            Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
