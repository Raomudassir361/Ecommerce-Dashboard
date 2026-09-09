import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Crown,
  DollarSign,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import AddUserModal from '../components/modals/AddUserModal';

export default function UserPage({ customers, setCustomers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sentToast, setSentToast] = useState('');

  // Filtered users
  const filteredCustomers = customers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'All' || user.tier === filterTier;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleAddUser = (newUser) => {
    setCustomers([newUser, ...customers]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your customer profiles, loyalty tiers, and purchase history.
          </p>
        </div>

        <button
          id="add-new-customer-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e8749] hover:bg-[#0c743e] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#e2f6fd] text-[#0ea5e9] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Users</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">20.4K</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#e4f9ee] text-[#10b981] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Members</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">18,240</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#f4effe] text-[#8b5cf6] flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">VIP Tier</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">4,215</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#fdeadc] text-[#f97316] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Avg Lifetime Spend</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">₨ 24,500</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tier filter */}
          <span className="text-xs font-medium text-slate-500">Tier:</span>
          {['All', 'VIP', 'Regular', 'New'].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterTier === tier
                  ? 'bg-[#0e8749] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tier}
            </button>
          ))}

          {/* Status filter */}
          <span className="text-xs font-medium text-slate-500 ml-2">Status:</span>
          {['All', 'Active', 'Inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 bg-slate-50/70">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-center">Total Spent</th>
                <th className="py-3 px-4 text-center">Tier</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No customers found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCustomer(user)}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-400">{user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                      {user.ordersCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {user.totalSpent}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          user.tier === 'VIP'
                            ? 'bg-[#f4effe] text-[#8b5cf6]'
                            : user.tier === 'New'
                            ? 'bg-[#e2f6fd] text-[#0ea5e9]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {user.tier === 'VIP' && <Crown className="w-3 h-3" />}
                        {user.tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'Active'
                            ? 'bg-[#e4f9ee] text-[#10b981]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(user);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-5">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f4effe] text-[#8b5cf6]">
                    {selectedCustomer.tier} Tier
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e4f9ee] text-[#10b981]">
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 py-3 border-y border-slate-100 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-medium text-slate-800">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-slate-800">{selectedCustomer.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Lifetime Orders:</span>
                <span className="font-bold text-slate-800">{selectedCustomer.ordersCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Spent:</span>
                <span className="font-bold text-emerald-600">{selectedCustomer.totalSpent}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSentToast(`Message dispatched to ${selectedCustomer.name} (${selectedCustomer.email})`);
                  setSelectedCustomer(null);
                  setTimeout(() => setSentToast(''), 3500);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0e8749] hover:bg-[#0c743e] rounded-xl shadow-xs"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {sentToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{sentToast}</span>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
}
