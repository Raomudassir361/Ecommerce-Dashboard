import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, BarChart3, Check, ChevronLeft, ChevronRight, CircleUserRound,
  ClipboardList, LayoutDashboard, LogOut, Menu, Package, Plus, Search, Shield,
  ShoppingBag, Trash2, Users, X, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import LoginPage from './pages/LoginPage';
import { adminApi, getId, unwrap } from './lib/adminApi';

const routeNames = ['dashboard', 'orders', 'products', 'users'];
const routeTitles = { dashboard: 'Dashboard', orders: 'Orders', products: 'Products', users: 'Users' };
const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentMethods = ['Cash on Delivery', 'Card', 'Bank Transfer', 'JazzCash', 'EasyPaisa'];
const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#0e8749] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c743e] disabled:cursor-not-allowed disabled:opacity-60';

function routeFromPath(pathname) {
  const path = pathname.replace(/\/+$/, '');
  if (path === '/admin') return 'dashboard';
  const page = path.startsWith('/admin/') ? path.slice('/admin/'.length) : '';
  if (page === 'login') return 'login';
  if (path.startsWith('/admin/')) return 'not-found';
  return routeNames.includes(page) ? page : null;
}

function routePath(page) {
  return `/admin/${page}`;
}

function listFrom(response, key) {
  const value = unwrap(response, key);
  return Array.isArray(value) ? value : [];
}

function adminFrom(response) {
  const data = unwrap(response);
  return data?.user ?? data?.admin ?? data;
}

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;
}

function productStockStatus(product) {
  if (product.stockStatus) {
    const status = String(product.stockStatus).toLowerCase();
    if (status === 'out_of_stock') return 'Out of Stock';
    if (status === 'low_stock') return 'Low Stock';
    if (status === 'in_stock') return 'In Stock';
  }
  const stock = Number(product.stock || 0);
  return stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock';
}

function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 sm:p-6" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-heading" className={`max-h-[92vh] w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6`}>
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 id="modal-heading" className="text-lg font-bold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block space-y-1.5 text-xs font-semibold text-slate-600"><span>{label}</span>{children}</label>;
}

function Pager({ page, setPage, total, pageSize = 6 }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
      <span>{total ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}` : '0 results'}</span>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronLeft size={16} /></button>
        <span className="px-2">Page {page} of {pages}</span>
        <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return <div className="relative min-w-0 flex-1">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input aria-label="Search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${fieldClass} pl-9`} />
  </div>;
}

function ProductForm({ product, onSubmit, onClose, saving }) {
  const [values, setValues] = useState({
    name: product?.name || '', sku: product?.sku || '', category: product?.category || '',
    styles: (product?.styles || []).join(', '), colors: (product?.colors || []).join(', '),
    sizes: (product?.sizes || []).join(', '), price: product?.price ?? '',
    oldPrice: product?.oldPrice ?? '', stock: product?.stock ?? 0,
    image: product?.image || '', description: product?.description || '',
  });
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    const stock = Number(values.stock);
    onSubmit({
      name: values.name.trim(), sku: values.sku.trim(), category: values.category.trim(),
      styles: values.styles.split(',').map((item) => item.trim()).filter(Boolean),
      colors: values.colors.split(',').map((item) => item.trim()).filter(Boolean),
      sizes: values.sizes.split(',').map((item) => item.trim()).filter(Boolean),
      price: Number(values.price), ...(values.oldPrice !== '' ? { oldPrice: Number(values.oldPrice) } : {}),
      stock, stockStatus: stock === 0 ? 'out_of_stock' : stock <= 10 ? 'low_stock' : 'in_stock',
      image: values.image.trim(), description: values.description.trim(),
    });
  };
  return <form onSubmit={submit} className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Product name"><input required value={values.name} onChange={(e) => update('name', e.target.value)} className={fieldClass} /></Field>
      <Field label="SKU"><input required value={values.sku} onChange={(e) => update('sku', e.target.value)} className={fieldClass} /></Field>
      <Field label="Category"><input required value={values.category} onChange={(e) => update('category', e.target.value)} className={fieldClass} /></Field>
      <Field label="Price (Rs.)"><input required min="0" type="number" step="0.01" value={values.price} onChange={(e) => update('price', e.target.value)} className={fieldClass} /></Field>
      <Field label="Old price (optional)"><input min="0" type="number" step="0.01" value={values.oldPrice} onChange={(e) => update('oldPrice', e.target.value)} className={fieldClass} /></Field>
      <Field label="Stock quantity"><input required min="0" type="number" value={values.stock} onChange={(e) => update('stock', e.target.value)} className={fieldClass} /></Field>
      <Field label="Styles (comma separated)"><input value={values.styles} onChange={(e) => update('styles', e.target.value)} className={fieldClass} /></Field>
      <Field label="Colors (comma separated)"><input value={values.colors} onChange={(e) => update('colors', e.target.value)} className={fieldClass} /></Field>
      <Field label="Sizes (comma separated)"><input value={values.sizes} onChange={(e) => update('sizes', e.target.value)} className={fieldClass} /></Field>
      <Field label="Image URL"><input type="url" value={values.image} onChange={(e) => update('image', e.target.value)} className={fieldClass} /></Field>
    </div>
    <Field label="Description"><textarea rows="3" value={values.description} onChange={(e) => update('description', e.target.value)} className={fieldClass} /></Field>
    <div className="flex justify-end gap-2 pt-2">
      <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
      <button disabled={saving} className={buttonClass}>{saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}</button>
    </div>
  </form>;
}

function OrderForm({ products, onSubmit, onClose, saving }) {
  const [lines, setLines] = useState([{ productId: '', quantity: 1 }]);
  const [values, setValues] = useState({ customerName: '', customerEmail: '', customerAddress: '', paymentMethod: paymentMethods[0] });
  const changeLine = (index, key, value) => setLines((current) => current.map((line, i) => i === index ? { ...line, [key]: value } : line));
  return <form className="space-y-4" onSubmit={(event) => {
    event.preventDefault();
    onSubmit({ ...values, items: lines.map((line) => ({ ...line, quantity: Number(line.quantity) })) });
  }}>
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Customer name"><input required value={values.customerName} onChange={(e) => setValues({ ...values, customerName: e.target.value })} className={fieldClass} /></Field>
      <Field label="Customer email"><input required type="email" value={values.customerEmail} onChange={(e) => setValues({ ...values, customerEmail: e.target.value })} className={fieldClass} /></Field>
      <div className="sm:col-span-2"><Field label="Delivery address"><textarea required rows="2" value={values.customerAddress} onChange={(e) => setValues({ ...values, customerAddress: e.target.value })} className={fieldClass} /></Field></div>
      <Field label="Payment method"><select value={values.paymentMethod} onChange={(e) => setValues({ ...values, paymentMethod: e.target.value })} className={fieldClass}>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></Field>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-700">Order items</h3><button type="button" onClick={() => setLines([...lines, { productId: '', quantity: 1 }])} className="text-xs font-semibold text-emerald-700">Add item</button></div>
      {lines.map((line, index) => <div key={index} className="flex gap-2">
        <select required value={line.productId} onChange={(e) => changeLine(index, 'productId', e.target.value)} className={`${fieldClass} min-w-0`}>
          <option value="">Select a product</option>{products.map((product) => <option key={getId(product)} value={getId(product)}>{product.name} — {formatCurrency(product.price)}</option>)}
        </select>
        <input aria-label="Quantity" required min="1" type="number" value={line.quantity} onChange={(e) => changeLine(index, 'quantity', e.target.value)} className={`${fieldClass} w-24`} />
        {lines.length > 1 && <button type="button" aria-label="Remove item" onClick={() => setLines(lines.filter((_, i) => i !== index))} className="px-2 text-red-600"><X size={16} /></button>}
      </div>)}
    </div>
    <p className="text-xs text-slate-500">The server calculates item prices and order totals.</p>
    <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={saving} className={buttonClass}>{saving ? 'Creating…' : 'Create order'}</button></div>
  </form>;
}

function Dashboard({ metrics, orders, products, users, onNavigate, onSelectOrder, onCreateOrder, onCreateProduct }) {
  const kpis = [
    { label: 'Total revenue', value: formatCurrency(metrics?.revenue), icon: BarChart3 },
    { label: 'Total orders', value: Number(metrics?.orders ?? orders.length).toLocaleString(), icon: ClipboardList },
    { label: 'Active customers', value: Number(metrics?.activeUsers ?? users.filter((user) => String(user.status).toLowerCase() === 'active').length).toLocaleString(), icon: Users },
    { label: 'Total products', value: Number(metrics?.products ?? products.length).toLocaleString(), icon: Package },
  ];
  const sales = metrics?.monthlySales || [];
  const categories = metrics?.categoryBreakdown || [];
  const categoryTotal = categories.reduce((total, category) => total + Number(category.value || 0), 0);
  const chartColors = ['#0e8749', '#10b981', '#34d399', '#a7f3d0', '#6ee7b7'];
  let chartOffset = 0;
  const categoryGradient = categories.map((category, index) => {
    const slice = categoryTotal ? Number(category.value || 0) / categoryTotal * 100 : 0;
    const segment = `${chartColors[index % chartColors.length]} ${chartOffset}% ${chartOffset + slice}%`;
    chartOffset += slice;
    return segment;
  }).join(', ');
  const maxSales = Math.max(1, ...sales.map((item) => Number(item.revenue || 0)));
  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-extrabold text-slate-900">Store overview</h2><p className="mt-1 text-sm text-slate-500">Live store metrics and recent activity.</p></div><div className="flex gap-2"><button onClick={onCreateOrder} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Create order</button><button onClick={onCreateProduct} className={buttonClass}><Plus size={15} />Add product</button></div></div>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{kpis.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-slate-500"><span className="text-xs font-semibold">{label}</span><Icon size={18} className="text-emerald-700" /></div><p className="mt-3 break-words text-xl font-extrabold text-slate-900">{value}</p></article>)}</div>
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 lg:col-span-2"><h3 className="font-bold text-slate-900">Sales by month</h3>{sales.length ? <div className="mt-5 h-56">
        <svg viewBox={`0 0 ${Math.max(420, sales.length * 72)} 190`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Monthly revenue area chart">
          <defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity=".35" /><stop offset="100%" stopColor="#10b981" stopOpacity=".02" /></linearGradient></defs>
          {(() => { const width = Math.max(420, sales.length * 72); const points = sales.map((item, index) => `${24 + index * ((width - 48) / Math.max(1, sales.length - 1))},${166 - Number(item.revenue || 0) / maxSales * 135}`); return <><polygon points={`24,170 ${points.join(' ')} ${width - 24},170`} fill="url(#salesFill)" /><polyline points={points.join(' ')} fill="none" stroke="#0e8749" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />{sales.map((item, index) => <g key={`${item.month}-${index}`}><circle cx={24 + index * ((width - 48) / Math.max(1, sales.length - 1))} cy={166 - Number(item.revenue || 0) / maxSales * 135} r="4" fill="#0e8749" /><text x={24 + index * ((width - 48) / Math.max(1, sales.length - 1))} y="187" textAnchor="middle" fill="#64748b" fontSize="10">{item.month}</text></g>)}</>; })()}
        </svg>
      </div> : <EmptyState label="No monthly sales data yet." />}</section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5"><h3 className="font-bold text-slate-900">Sales by category</h3>{categories.length ? <><div className="my-5 flex justify-center"><div role="img" aria-label="Sales by category pie chart" className="relative h-40 w-40 rounded-full" style={{ background: `conic-gradient(${categoryGradient})` }}><div className="absolute inset-8 flex items-center justify-center rounded-full bg-white text-center"><div><p className="text-[10px] text-slate-500">Sales</p><p className="text-sm font-bold text-slate-900">{categories.length} categories</p></div></div></div></div><div className="space-y-2">{categories.map((category, index) => <div key={category.name} className="flex items-center justify-between gap-2 text-xs"><span className="flex items-center gap-2 font-medium text-slate-700"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />{category.name}</span><span className="text-slate-500">{categoryTotal ? (Number(category.value || 0) / categoryTotal * 100).toFixed(1) : '0.0'}%</span></div>)}</div></> : <EmptyState label="No category sales data yet." />}</section>
    </div>
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white"><div className="flex items-center justify-between px-4 py-4"><h3 className="font-bold text-slate-900">Recent orders</h3><button onClick={() => onNavigate('orders')} className="text-xs font-semibold text-emerald-700">View all</button></div>{orders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{orders.slice(0, 5).map((order) => <tr key={getId(order)} onClick={() => onSelectOrder(order)} className="cursor-pointer hover:bg-slate-50"><td className="px-4 py-3 font-semibold">{order.id || getId(order)}</td><td className="px-4 py-3">{order.customerName}</td><td className="px-4 py-3">{order.date ? new Date(order.date).toLocaleDateString() : '—'}</td><td className="px-4 py-3">{formatCurrency(order.total)}</td><td className="px-4 py-3">{order.status}</td></tr>)}</tbody></table></div> : <EmptyState label="No orders yet." />}</section>
  </div>;
}

function EmptyState({ label }) {
  return <div className="px-4 py-12 text-center text-sm text-slate-400">{label}</div>;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(() => routeFromPath(window.location.pathname));
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ products: [], orders: [], users: [], metrics: null });
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const navigate = useCallback((nextPage, replace = false) => {
    const nextPath = routePath(nextPage);
    if (replace) window.history.replaceState({}, '', nextPath);
    else if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath);
    setPage(nextPage);
    setMobileMenu(false);
    setPageNumber(1);
    setSearch('');
  }, []);

  const loadData = useCallback(async () => {
    const [products, orders, users, metrics] = await Promise.all([
      adminApi.products(), adminApi.orders(), adminApi.users(), adminApi.metrics(),
    ]);
    setData({
      products: listFrom(products, 'products'),
      orders: listFrom(orders, 'orders'),
      users: listFrom(users, 'users'),
      metrics: unwrap(metrics, 'metrics'),
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const current = routeFromPath(window.location.pathname);
      if (current) { setPage(current); setPageNumber(1); }
      else if (window.location.pathname.startsWith('/admin')) navigate(currentUser ? 'dashboard' : 'login', true);
      else setPage(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [currentUser, navigate]);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const user = adminFrom(await adminApi.currentAdmin());
        if (!user || String(user.role).toLowerCase() !== 'admin') {
          if (user) {
            try {
              await adminApi.logout();
            } catch (logoutError) {
              if (logoutError.status !== 401 && logoutError.status !== 403) {
                setError(logoutError.message || 'Could not reach the API');
              }
            }
            if (active) setError('Administrator access is required.');
          }
          setCurrentUser(null);
          navigate('login', true);
          return;
        }
        if (!active) return;
        setCurrentUser(user);
        await loadData();
        if (active && routeFromPath(window.location.pathname) === 'login') navigate('dashboard', true);
      } catch (requestError) {
        if (!active) return;
        if (requestError.status === 401 || requestError.status === 403) {
          setCurrentUser(null);
          if (routeFromPath(window.location.pathname) !== 'login') navigate('login', true);
        } else {
          setError(requestError.message || 'Could not reach the API');
        }
      } finally {
        if (active) setBooting(false);
      }
    };
    initialize();
    return () => { active = false; };
  }, [loadData, navigate]);

  useEffect(() => {
    if (currentUser && !page) {
      if (window.location.pathname.startsWith('/admin')) navigate('dashboard', true);
    }
    if (!currentUser && routeFromPath(window.location.pathname) !== 'login' && window.location.pathname.startsWith('/admin')) navigate('login', true);
  }, [currentUser, page, navigate]);

  const onAuthenticationFailure = useCallback((requestError) => {
    if (requestError.status === 401 || requestError.status === 403) {
      setCurrentUser(null);
      setData({ products: [], orders: [], users: [], metrics: null });
      navigate('login', true);
      return true;
    }
    return false;
  }, [navigate]);

  const refresh = async () => {
    setError('');
    try { await loadData(); }
    catch (requestError) {
      if (!onAuthenticationFailure(requestError)) setError(requestError.message || 'Could not reach the API');
      throw requestError;
    }
  };

  const mutate = async (operation, successMessage) => {
    setLoading(true);
    setError('');
    try {
      await operation();
      await refresh();
      setModal(null);
      setToast(successMessage);
      window.setTimeout(() => setToast(''), 3500);
    } catch (requestError) {
      if (!onAuthenticationFailure(requestError)) setError(requestError.message || 'Could not reach the API');
    } finally { setLoading(false); }
  };

  const submitLogin = async (email, password) => {
    try {
      await adminApi.login(email, password);
      const user = adminFrom(await adminApi.currentAdmin());
      if (!user || String(user.role).toLowerCase() !== 'admin') {
        await adminApi.logout();
        throw new Error('Administrator access is required.');
      }
      setCurrentUser(user);
      setError('');
      await loadData();
      navigate('dashboard', true);
      setToast(`Welcome, ${user.name || user.email || 'Administrator'}.`);
      window.setTimeout(() => setToast(''), 3500);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) {
        throw new Error(requestError.message || 'Administrator access is required.');
      }
      throw requestError;
    }
  };

  const logout = async () => {
    try { await adminApi.logout(); }
    catch (requestError) {
      if (requestError.status !== 401 && requestError.status !== 403) {
        setError(requestError.message || 'Could not reach the API');
        return;
      }
    }
    setCurrentUser(null);
    setData({ products: [], orders: [], users: [], metrics: null });
    navigate('login', true);
  };

  const query = search.trim().toLowerCase();
  const products = useMemo(() => data.products.filter((item) =>
    [item.name, item.sku, item.category].some((value) => String(value || '').toLowerCase().includes(query))), [data.products, query]);
  const orders = useMemo(() => data.orders.filter((item) =>
    [item.id, getId(item), item.customerName, item.customerEmail].some((value) => String(value || '').toLowerCase().includes(query))), [data.orders, query]);
  const users = useMemo(() => data.users.filter((item) =>
    [item.name, item.email].some((value) => String(value || '').toLowerCase().includes(query))), [data.users, query]);

  const openProductForm = (product = null) => setModal({ type: 'product', product });
  const openOrderForm = () => setModal({ type: 'create-order' });
  const currentUserId = getId(currentUser);

  if (booting) return <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] text-sm text-slate-500">Checking administrator session…</div>;
  if (!window.location.pathname.startsWith('/admin')) return <main className="p-10 text-center"><h1 className="text-2xl font-bold">404 — Page not found</h1></main>;
  if (page === 'not-found') return <main className="p-10 text-center"><h1 className="text-2xl font-bold">404 — Page not found</h1></main>;
  if (!currentUser || page === 'login') return <LoginPage onLogin={submitLogin} initialError={error} />;

  return <div className="min-h-screen bg-[#f8faf9] text-slate-800">
    {mobileMenu && <button aria-label="Close navigation" onClick={() => setMobileMenu(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 ${sidebarCollapsed ? 'lg:w-20' : ''} flex-col border-r border-slate-100 bg-white transition-all duration-200 lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className={`flex h-20 items-center gap-3 border-b border-slate-100 ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'px-6'}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 font-black text-white">B</div><div className={sidebarCollapsed ? 'hidden lg:block' : ''}><div className="font-extrabold text-slate-900">Berry Admin</div><div className="text-[11px] text-slate-500">Store management</div></div><button onClick={() => setMobileMenu(false)} className="ml-auto rounded-lg p-1 text-slate-500 lg:hidden" aria-label="Close menu"><X size={18} /></button></div>
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="mx-3 mt-3 hidden items-center justify-center gap-2 rounded-lg p-2 text-xs text-slate-500 hover:bg-slate-50 lg:flex" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{sidebarCollapsed ? <PanelLeftOpen size={17} /> : <><PanelLeftClose size={17} />Collapse menu</>}</button>
      <nav className="space-y-1 p-4" aria-label="Admin navigation">{[
        ['dashboard', 'Dashboard', LayoutDashboard], ['orders', 'Orders', ClipboardList],
        ['products', 'Products', ShoppingBag], ['users', 'Users', Users],
      ].map(([key, label, Icon]) => <button key={key} onClick={() => navigate(key)} title={sidebarCollapsed ? label : undefined} aria-label={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${sidebarCollapsed ? 'lg:justify-center' : ''} ${page === key ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Icon size={18} /><span className={sidebarCollapsed ? 'lg:hidden' : ''}>{label}</span>{key === 'orders' && <span className={`ml-auto text-xs ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{data.orders.length}</span>}{key === 'products' && <span className={`ml-auto text-xs ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{data.products.length}</span>}{key === 'users' && <span className={`ml-auto text-xs ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{data.users.length}</span>}</button>)}</nav>
      <div className="mt-auto border-t border-slate-100 p-4"><div className={`mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}><CircleUserRound size={20} className="shrink-0 text-emerald-700" /><div className={`min-w-0 ${sidebarCollapsed ? 'hidden lg:block' : ''}`}><p className="truncate text-xs font-bold">{currentUser.name || currentUser.email}</p><p className="text-[11px] text-slate-500">Administrator</p></div></div><button onClick={logout} title={sidebarCollapsed ? 'Log out' : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}><LogOut size={17} /><span className={sidebarCollapsed ? 'lg:hidden' : ''}>Log out</span></button></div>
    </aside>
    <div className={`min-h-screen transition-[padding] duration-200 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
      <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <button aria-label="Open menu" onClick={() => setMobileMenu(true)} className="rounded-xl border border-slate-200 p-2 lg:hidden"><Menu size={18} /></button>
        <div className="min-w-28"><h1 className="text-lg font-extrabold text-slate-900">{routeTitles[page]}</h1><p className="hidden text-[11px] text-slate-500 sm:block">Berry store administration</p></div>
        <div className="ml-auto flex w-full items-center gap-2 sm:w-auto"><SearchBox value={search} onChange={(value) => { setSearch(value); setPageNumber(1); }} placeholder="Search this section…" /><button onClick={logout} className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold sm:flex"><LogOut size={15} />Logout</button></div>
      </header>
      <main className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8">
        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span className="flex items-center gap-2"><AlertCircle size={17} />{error}</span><button onClick={() => refresh().catch(() => {})} disabled={loading} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold hover:bg-red-200">Retry</button></div>}
        {page === 'dashboard' && <Dashboard metrics={data.metrics} orders={data.orders} products={data.products} users={data.users} onNavigate={navigate} onSelectOrder={(order) => setModal({ type: 'order-details', order })} onCreateOrder={openOrderForm} onCreateProduct={() => openProductForm()} />}
        {page === 'products' && <ProductsPage products={products} pageNumber={pageNumber} setPageNumber={setPageNumber} onEdit={openProductForm} onDelete={(item) => window.confirm(`Delete product “${item.name}”?`) && mutate(() => adminApi.deleteProduct(getId(item)), 'Product deleted.')} />}
        {page === 'orders' && <OrdersPage orders={orders} pageNumber={pageNumber} setPageNumber={setPageNumber} onCreate={openOrderForm} onView={(order) => setModal({ type: 'order-details', order })} onStatus={(order, status) => mutate(() => adminApi.updateOrder(getId(order), { status }), 'Order status updated.')} onDelete={(order) => window.confirm(`Delete order ${order.id || getId(order)}?`) && mutate(() => adminApi.deleteOrder(getId(order)), 'Order deleted.')} />}
        {page === 'users' && <UsersPage users={users} pageNumber={pageNumber} setPageNumber={setPageNumber} currentUserId={currentUserId} onEdit={(user) => setModal({ type: 'user', user })} onDelete={(user) => window.confirm(`Delete user ${user.name || user.email}?`) && mutate(() => adminApi.deleteUser(getId(user)), 'User deleted.')} />}
      </main>
    </div>
    {toast && <div role="status" className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"><Check size={17} className="text-emerald-400" />{toast}</div>}
    {modal?.type === 'product' && <Modal title={modal.product ? 'Edit product' : 'Add product'} onClose={() => setModal(null)} wide><ProductForm product={modal.product} saving={loading} onClose={() => setModal(null)} onSubmit={(values) => mutate(() => modal.product ? adminApi.updateProduct(getId(modal.product), values) : adminApi.createProduct(values), modal.product ? 'Product updated.' : 'Product created.')} /></Modal>}
    {modal?.type === 'create-order' && <Modal title="Create order" onClose={() => setModal(null)} wide><OrderForm products={data.products} saving={loading} onClose={() => setModal(null)} onSubmit={(values) => mutate(() => adminApi.createOrder(values), 'Order created.')} /></Modal>}
    {modal?.type === 'user' && <UserFormModal user={modal.user} saving={loading} onClose={() => setModal(null)} onSubmit={(values) => mutate(() => adminApi.updateUser(getId(modal.user), values), 'User updated.')} />}
    {modal?.type === 'order-details' && <OrderDetails order={modal.order} loading={loading} onClose={() => setModal(null)} onStatus={(status) => mutate(() => adminApi.updateOrder(getId(modal.order), { status }), 'Order status updated.')} />}
  </div>;
}

function ProductsPage({ products, pageNumber, setPageNumber, onEdit, onDelete }) {
  const [category, setCategory] = useState('All');
  const [stock, setStock] = useState('All');
  const categories = useMemo(() => ['All', ...new Set(products.map((item) => item.category).filter(Boolean))], [products]);
  const filtered = products.filter((product) => (category === 'All' || product.category === category) && (stock === 'All' || productStockStatus(product) === stock));
  const visible = filtered.slice((pageNumber - 1) * 6, pageNumber * 6);
  useEffect(() => setPageNumber(1), [category, stock, products.length, setPageNumber]);
  return <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h2 className="font-bold text-slate-900">Products</h2><p className="text-xs text-slate-500">{products.length} products in inventory</p></div><div className="flex gap-2"><select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className={`${fieldClass} w-auto py-2 text-xs`} >{categories.map((value) => <option key={value}>{value}</option>)}</select><select aria-label="Filter by stock status" value={stock} onChange={(e) => setStock(e.target.value)} className={`${fieldClass} w-auto py-2 text-xs`}><option>All</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select></div></div>
    {visible.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((product) => { const status = productStockStatus(product); return <tr key={getId(product)}><td className="px-4 py-3"><div className="flex items-center gap-3">{product.image ? <img src={product.image} alt="" className="h-10 w-10 rounded-lg bg-slate-100 object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100"><Package size={18} /></div>}<div><p className="font-semibold text-slate-800">{product.name}</p>{product.oldPrice && <p className="text-[11px] text-slate-400 line-through">{formatCurrency(product.oldPrice)}</p>}</div></div></td><td className="px-4 py-3 text-slate-600">{product.sku || '—'}</td><td className="px-4 py-3 text-slate-600">{product.category || '—'}</td><td className="px-4 py-3 font-medium">{formatCurrency(product.price)}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : status === 'Low Stock' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{status} ({product.stock ?? 0})</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => onEdit(product)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">Edit</button><button aria-label={`Delete ${product.name}`} onClick={() => onDelete(product)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></td></tr>; })}</tbody></table></div> : <EmptyState label="No products match these filters." />}
    <Pager page={pageNumber} setPage={setPageNumber} total={filtered.length} />
  </section>;
}

function OrdersPage({ orders, pageNumber, setPageNumber, onCreate, onView, onStatus, onDelete }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const filtered = orders.filter((order) => (statusFilter === 'All' || order.status === statusFilter) && (paymentFilter === 'All' || order.paymentMethod === paymentFilter));
  const visible = filtered.slice((pageNumber - 1) * 6, pageNumber * 6);
  useEffect(() => setPageNumber(1), [statusFilter, paymentFilter, orders.length, setPageNumber]);
  return <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h2 className="font-bold text-slate-900">Orders</h2><p className="text-xs text-slate-500">{orders.length} orders</p></div><div className="flex flex-wrap items-center gap-2"><select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${fieldClass} w-auto py-2 text-xs`}><option>All</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select><select aria-label="Filter by payment method" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={`${fieldClass} w-auto py-2 text-xs`}><option>All</option>{[...new Set(orders.map((order) => order.paymentMethod).filter(Boolean))].map((method) => <option key={method}>{method}</option>)}</select><button onClick={onCreate} className={buttonClass}><Plus size={15} />Create order</button></div></div>
    {visible.length ? <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((order) => <tr key={getId(order)}><td className="cursor-pointer px-4 py-3 font-semibold" onClick={() => onView(order)}>{order.id || getId(order)}</td><td className="px-4 py-3"><p className="font-medium">{order.customerName || '—'}</p><p className="text-xs text-slate-500">{order.customerEmail}</p></td><td className="px-4 py-3">{order.date ? new Date(order.date).toLocaleDateString() : '—'}</td><td className="px-4 py-3">{order.paymentMethod || '—'}</td><td className="px-4 py-3 font-medium">{formatCurrency(order.total)}</td><td className="px-4 py-3"><select aria-label={`Status for order ${order.id || getId(order)}`} value={order.status || 'Pending'} onChange={(e) => onStatus(order, e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => onView(order)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">Details</button><button aria-label={`Delete order ${order.id || getId(order)}`} onClick={() => onDelete(order)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div> : <EmptyState label="No orders match these filters." />}
    <Pager page={pageNumber} setPage={setPageNumber} total={filtered.length} />
  </section>;
}

function UsersPage({ users, pageNumber, setPageNumber, currentUserId, onEdit, onDelete }) {
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const filtered = users.filter((user) => (roleFilter === 'All' || user.role === roleFilter) && (statusFilter === 'All' || String(user.status).toLowerCase() === statusFilter.toLowerCase()));
  const visible = filtered.slice((pageNumber - 1) * 6, pageNumber * 6);
  useEffect(() => setPageNumber(1), [roleFilter, statusFilter, users.length, setPageNumber]);
  return <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h2 className="font-bold text-slate-900">Users</h2><p className="text-xs text-slate-500">{users.length} accounts</p></div><div className="flex gap-2"><select aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={`${fieldClass} w-auto py-2 text-xs`}><option>All</option><option>admin</option><option>customer</option></select><select aria-label="Filter by user status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${fieldClass} w-auto py-2 text-xs`}><option>All</option><option>Active</option><option>Suspended</option></select></div></div>
    {visible.length ? <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((user) => { const id = getId(user); const isCurrentAdmin = id === currentUserId; return <tr key={id}><td className="px-4 py-3"><div className="flex items-center gap-3">{user.avatar ? <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <CircleUserRound size={25} className="text-slate-400" />}<div><p className="font-semibold">{user.name || '—'}</p><p className="text-xs text-slate-500">{user.email}</p></div></div></td><td className="px-4 py-3">{user.role}</td><td className="px-4 py-3">{user.status}</td><td className="px-4 py-3">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : '—'}</td><td className="px-4 py-3"><div className="flex justify-end gap-2">{isCurrentAdmin ? <span title="Current admin cannot be deleted" className="p-2 text-slate-400"><Shield size={16} /></span> : <><button onClick={() => onEdit(user)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">Edit</button><button aria-label={`Delete ${user.name || user.email}`} onClick={() => onDelete(user)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></>}</div></td></tr>; })}</tbody></table></div> : <EmptyState label="No users match these filters." />}
    <Pager page={pageNumber} setPage={setPageNumber} total={filtered.length} />
  </section>;
}

function UserFormModal({ user, saving, onClose, onSubmit }) {
  const [role, setRole] = useState(user.role || 'customer');
  const [status, setStatus] = useState(user.status || 'Active');
  return <Modal title="Edit user" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit({ role, status }); }} className="space-y-4">
    <div className="rounded-xl bg-slate-50 p-3"><p className="font-semibold">{user.name || 'User'}</p><p className="text-xs text-slate-500">{user.email}</p></div>
    <Field label="Role"><select value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}><option value="admin">Admin</option><option value="customer">Customer</option></select></Field>
    <Field label="Status"><select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}><option value="Active">Active</option><option value="Suspended">Suspended</option></select></Field>
    <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={saving} className={buttonClass}>{saving ? 'Saving…' : 'Save changes'}</button></div>
  </form></Modal>;
}

function OrderDetails({ order, loading, onClose, onStatus }) {
  const items = Array.isArray(order.items) ? order.items : [];
  return <Modal title={`Order ${order.id || getId(order)}`} onClose={onClose} wide><div className="space-y-4 text-sm">
    <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3"><p className="mb-1 text-xs text-slate-500">Customer</p><p className="font-semibold">{order.customerName || '—'}</p><p className="text-xs text-slate-500">{order.customerEmail}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="mb-1 text-xs text-slate-500">Delivery address</p><p>{order.customerAddress || order.address || '—'}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="mb-1 text-xs text-slate-500">Payment · Date</p><p>{order.paymentMethod || '—'} · {order.date ? new Date(order.date).toLocaleDateString() : '—'}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="mb-1 text-xs text-slate-500">Status</p><p className="font-semibold">{order.status || '—'}</p></div></div>
    <div className="overflow-x-auto rounded-xl border border-slate-100"><table className="w-full min-w-[400px] text-left"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">Quantity</th><th className="px-3 py-2">Price</th></tr></thead><tbody className="divide-y divide-slate-100">{items.length ? items.map((item, index) => <tr key={`${item.productId}-${index}`}><td className="px-3 py-2">{item.productName || item.name || item.productId}</td><td className="px-3 py-2">{item.quantity}</td><td className="px-3 py-2">{formatCurrency(item.price)}</td></tr>) : <tr><td colSpan="3" className="px-3 py-4 text-center text-slate-400">No item details provided.</td></tr>}</tbody></table></div>
    <div className="ml-auto max-w-xs space-y-1 text-right text-xs text-slate-600"><p>Subtotal <strong>{formatCurrency(order.subtotal)}</strong></p><p>Tax <strong>{formatCurrency(order.tax)}</strong></p><p>Shipping <strong>{formatCurrency(order.shipping)}</strong></p><p className="border-t border-slate-100 pt-2 text-sm font-extrabold text-slate-900">Total <span className="text-emerald-700">{formatCurrency(order.total)}</span></p></div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><Field label="Update status"><select disabled={loading} value={order.status || 'Pending'} onChange={(e) => onStatus(e.target.value)} className={`${fieldClass} w-auto`}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></Field><button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button></div>
  </div></Modal>;
}

export default App;
