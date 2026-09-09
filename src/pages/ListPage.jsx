import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Tag,
  Layers,
  AlertTriangle,
  Star,
  Trash2
} from 'lucide-react';
import AddProductModal from '../components/modals/AddProductModal';
import { formatPKR } from '../data/mockData';

export default function ListPage({ products, setProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStock = selectedStockStatus === 'All' || p.status === selectedStockStatus;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to remove this item?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Product Inventory List
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, and manage fashion apparel SKUs, pricing, and stock levels.
          </p>
        </div>

        <button
          id="add-new-product-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e8749] hover:bg-[#0c743e] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#fdeadc] text-[#f97316] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Products</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {products.length} SKUs
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#e4f9ee] text-[#10b981] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">In Stock Items</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {products.filter((p) => p.status === 'In Stock').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Low Stock Alerts</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {products.filter((p) => p.status === 'Low Stock').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#f4effe] text-[#8b5cf6] flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Top Rated (4.8+)</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {products.filter((p) => p.rating >= 4.8).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, SKU, or category..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Category Pills & View Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0e8749] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border-0 focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Table / Grid Mode Toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content: Table View or Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100/90 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 bg-slate-50/70">
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Unit Price</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-center">Total Sales</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4 text-center">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No products found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            <p className="text-[11px] text-slate-400">{item.sku} • {item.color}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {formatPKR(item.price)}
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        {item.stock} units
                      </td>

                      <td className="py-3.5 px-4 text-center text-slate-600">
                        {item.salesCount} sold
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'In Stock'
                              ? 'bg-[#e4f9ee] text-[#10b981]'
                              : item.status === 'Low Stock'
                              ? 'bg-[#fef3c7] text-[#d97706]'
                              : 'bg-[#fde8e8] text-[#e02424]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-3 bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span
                    className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
                      item.status === 'In Stock'
                        ? 'bg-white/90 text-[#10b981]'
                        : item.status === 'Low Stock'
                        ? 'bg-white/90 text-[#d97706]'
                        : 'bg-white/90 text-[#e02424]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{item.category}</span>
                  <span className="flex items-center gap-0.5 font-semibold text-slate-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.color} • {item.sku}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Price</span>
                  <p className="text-base font-extrabold text-slate-900">{formatPKR(item.price)}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Stock</span>
                  <p className="text-xs font-semibold text-slate-700">{item.stock} units</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
