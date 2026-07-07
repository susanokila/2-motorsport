import React, { useState } from 'react';
import { ShieldCheck, Package, Calendar, Clock, DollarSign, Sparkles, User, AlertTriangle, Plus, RefreshCw, BarChart3, CheckCircle, FileText, Sliders } from 'lucide-react';
import { Product, Booking, Order } from '../types';

interface AdminPanelProps {
  products: Product[];
  bookings: Booking[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onUpdateBooking: (bookingId: string, updatedFields: any) => void;
  onAddProduct: (productData: any) => void;
}

export default function AdminPanel({
  products,
  bookings,
  orders,
  onUpdateProduct,
  onUpdateBooking,
  onAddProduct
}: AdminPanelProps) {
  const [adminSubTab, setAdminSubTab] = useState<'stats' | 'bookings' | 'inventory' | 'queue'>('stats');

  // New product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Brakes');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(1500);
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdPartNo, setNewProdPartNo] = useState('OEM-99201');

  // Job card modal states
  const [activeJobCardBookingId, setActiveJobCardBookingId] = useState<string | null>(null);
  const [jcDiagnostics, setJcDiagnostics] = useState('ECU scanned; isolated cylinder 3 spark plug misfire & worn friction material on front brake pads.');
  const [jcLabor, setJcLabor] = useState(3000);
  const [jcReport, setJcReport] = useState('Replaced front brake pads with Brembo Ceramic pads. Removed old fouled spark plug and set new Denso Iridium set. Fully cleared DTC codes and completed road test.');

  const [washQueue, setWashQueue] = useState([
    { id: 'q-1', reg: 'KCD 123X', vehicle: 'Toyota Premio', package: 'Premium OKILA Wash', bay: 'Bay 1 (Active Foaming)', progress: 35 },
    { id: 'q-2', reg: 'KDM 445P', vehicle: 'Mazda CX-5', package: 'Express Eco Wash', bay: 'Bay 2 (Vacuuming)', progress: 80 },
    { id: 'q-3', reg: 'KCR 882Q', vehicle: 'Subaru Forester', package: 'Steam Interior Detail', bay: 'Waiting Line', progress: 0 },
  ]);

  const activeBookingForJobCard = bookings.find(b => b.id === activeJobCardBookingId);

  // Business Analytics calculations
  const totalPartsSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalBookingSales = bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid').reduce((acc, b) => acc + b.totalAmount, 0);
  const totalRevenue = totalPartsSales + totalBookingSales;

  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  const handleRestock = (p: Product) => {
    const updated = { ...p, stock: p.stock + 20 };
    onUpdateProduct(updated);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProd = {
      name: newProdName,
      category: newProdCategory,
      description: newProdDesc,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      partNumber: newProdPartNo,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
      compatibility: ['All Vehicles']
    };

    onAddProduct(newProd);
    setShowAddForm(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const handleGenerateJobCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobCardBookingId || !activeBookingForJobCard) return;

    const completedJobCard = {
      id: `jc-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: activeJobCardBookingId,
      mechanicName: activeBookingForJobCard.mechanicName || 'Senior Engineer',
      diagnosticsResults: jcDiagnostics,
      tasksPerformed: ['Fault Code Isolation Scans', 'Replacement fittings', 'Lubrications & clearings'],
      partsUsed: [
        { partId: 'prod-1', name: 'Brembo Ceramic Pads', quantity: 1, price: 6500 }
      ],
      laborCharges: Number(jcLabor),
      totalCost: Number(jcLabor) + 6500,
      serviceReport: jcReport,
      completedDate: new Date().toISOString().split('T')[0]
    };

    // Update booking state
    onUpdateBooking(activeJobCardBookingId, {
      status: 'completed',
      paymentStatus: 'paid',
      jobCard: completedJobCard
    });

    setActiveJobCardBookingId(null);
  };

  const handleUpdateQueue = (id: string, nextStatus: string, progress: number) => {
    setWashQueue(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, bay: nextStatus, progress };
      }
      return item;
    }));
  };

  return (
    <div id="admin-panel-view" className="space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-slate-900 text-orange-400 px-3 py-1 rounded-full border border-slate-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Privileges Active</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950 mt-1">Management Dashboard</h2>
        </div>

        {/* Sub-tabs selectors */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-stretch md:self-auto gap-1">
          {[
            { id: 'stats', label: 'Overview & Reports' },
            { id: 'bookings', label: 'Service Bookings' },
            { id: 'inventory', label: 'Inventory Control' },
            { id: 'queue', label: 'Wash Bay Queue' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminSubTab(tab.id as any)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                adminSubTab === tab.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. OVERVIEW & REPORTS VIEW */}
      {adminSubTab === 'stats' && (
        <div className="space-y-8">
          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-bold">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
              <span className="text-slate-400 uppercase tracking-widest text-[9px] block">Gross revenue (M-Pesa + Card)</span>
              <span className="text-2xl font-black text-slate-950 block">KSh {totalRevenue.toLocaleString()}</span>
              <span className="text-emerald-500 font-medium">All accounts reconciled</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
              <span className="text-slate-400 uppercase tracking-widest text-[9px] block">Pending schedule</span>
              <span className="text-2xl font-black text-blue-600 block">{pendingBookingsCount} bookings</span>
              <span className="text-slate-500 font-medium">Requires mechanic slot</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
              <span className="text-slate-400 uppercase tracking-widest text-[9px] block">Active bays</span>
              <span className="text-2xl font-black text-slate-950 block">{activeBookingsCount} vehicles</span>
              <span className="text-orange-500 font-medium">In progress</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
              <span className="text-slate-400 uppercase tracking-widest text-[9px] block">Inventory alerts</span>
              <span className="text-2xl font-black text-red-600 block">{lowStockProducts.length} items</span>
              <span className="text-red-500 font-semibold animate-pulse">Low Stock Warning</span>
            </div>
          </div>

          {/* Low stock alerts warning banner */}
          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center gap-4 justify-between text-xs">
              <div className="flex items-center space-x-3 text-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <span className="font-extrabold uppercase text-[10px] tracking-wider block">Critical Low Stock Warning Alert</span>
                  <p className="text-red-700">The following accessories/spares are running low: {lowStockProducts.map(p=>`${p.name} (${p.stock} left)`).join(', ')}</p>
                </div>
              </div>
              <button
                onClick={() => setAdminSubTab('inventory')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shrink-0"
              >
                Go Restock Spares
              </button>
            </div>
          )}

          {/* Monthly sales report bar chart (Gorgeous HTML SVG layout) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-end justify-between border-b pb-4">
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">Monthly Sales Analysis</h3>
                <span className="text-slate-400 text-xs">Combined revenue data across auto spares store & garage bookings</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-50 px-3.5 py-1.5 rounded-full border text-[10px] font-bold text-slate-600">
                <BarChart3 className="w-4 h-4" />
                <span>Live Fiscal Feeds</span>
              </div>
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="h-64 relative flex items-end justify-between gap-6 pt-6 px-4">
              {[
                { month: 'Feb', sales: 185000 },
                { month: 'Mar', sales: 245000 },
                { month: 'Apr', sales: 320000 },
                { month: 'May', sales: 290000 },
                { month: 'Jun', sales: 410000 },
                { month: 'Jul (YTD)', sales: 520000 },
              ].map((m, idx) => {
                const maxVal = 550000;
                const percent = (m.sales / maxVal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-extrabold text-slate-900">KSh {Math.floor(m.sales/1000)}k</span>
                    {/* Bar graphic */}
                    <div className="w-full bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${percent}%` }}>
                      <div className="absolute inset-0 bg-blue-600 hover:bg-blue-700 rounded-t-lg transition-colors"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-bold uppercase">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. SERVICE BOOKINGS MANAGER */}
      {adminSubTab === 'bookings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-extrabold text-slate-950 text-base">Service Appointments Register</h3>
              <p className="text-xs text-slate-500 mt-1">Accept online reservations, dispatch mechanics, and compile job cards.</p>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => {
              const showConfirmBtn = booking.status === 'pending';
              const showStartBtn = booking.status === 'confirmed';
              const showCompleteBtn = booking.status === 'in_progress';

              return (
                <div key={booking.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-950 text-sm">{booking.serviceName}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        booking.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                        booking.status === 'in_progress' ? 'bg-indigo-100 text-indigo-600' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-slate-500 font-bold">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />Client: {booking.customerName} ({booking.customerEmail})</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Schedule: {booking.date} @ {booking.time}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Plate: {booking.vehicle.regNo} ({booking.vehicle.make} {booking.vehicle.model})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-between border-t lg:border-t-0 pt-3 lg:pt-0">
                    <span className="font-black text-slate-950 text-sm">KSh {booking.totalAmount.toLocaleString()}</span>
                    
                    <div className="flex gap-1.5">
                      {showConfirmBtn && (
                        <button
                          onClick={() => onUpdateBooking(booking.id, { status: 'confirmed', mechanicName: 'Peter Kamau' })}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg uppercase text-[10px] shadow"
                        >
                          Confirm
                        </button>
                      )}
                      {showStartBtn && (
                        <button
                          onClick={() => onUpdateBooking(booking.id, { status: 'in_progress' })}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase text-[10px] shadow"
                        >
                          Start Service
                        </button>
                      )}
                      {showCompleteBtn && (
                        <button
                          onClick={() => { setActiveJobCardBookingId(booking.id); }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg uppercase text-[10px] shadow flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Complete Card</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Job Card Modal Generator */}
          {activeJobCardBookingId && activeBookingForJobCard && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur flex items-center justify-center p-4">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full text-xs space-y-5">
                <div className="flex justify-between items-start pb-3 border-b">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-orange-500">Service Completion</span>
                    <h4 className="font-extrabold text-sm mt-1">Generate Job Card: {activeBookingForJobCard.serviceName}</h4>
                  </div>
                  <button
                    onClick={() => setActiveJobCardBookingId(null)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleGenerateJobCard} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">ECU Diagnostics / Structural Findings</label>
                    <textarea value={jcDiagnostics} onChange={e=>setJcDiagnostics(e.target.value)} required rows={2} className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Fitted Spares / Parts Used</label>
                    <input type="text" readOnly value="Brembo Ceramic Pads (KSh 6,500)" className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Labour & Diagnostics Charge (KSh)</label>
                    <input type="number" value={jcLabor} onChange={e=>setJcLabor(Number(e.target.value))} required className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Summary Action Report</label>
                    <textarea value={jcReport} onChange={e=>setJcReport(e.target.value)} required rows={3} className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase shadow flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Authorize & Close Booking</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. INVENTORY CONTROL VIEW */}
      {adminSubTab === 'inventory' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <div>
              <h3 className="font-extrabold text-slate-950 text-base">Spares Catalog Management</h3>
              <p className="text-xs text-slate-500 mt-1">Adjust prices, inspect stock quantities, and restock instantly.</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Close Form' : 'Register New Spare'}</span>
            </button>
          </div>

          {/* New product registration form */}
          {showAddForm && (
            <form onSubmit={handleCreateProduct} className="p-5 bg-slate-50 rounded-2xl border space-y-4 text-xs">
              <span className="text-[10px] uppercase font-extrabold text-blue-600 block">Add Spares To Catalog</span>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Part Name</label>
                  <input type="text" placeholder="e.g. Brembo Front Rotors" required value={newProdName} onChange={e=>setNewProdName(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Category</label>
                  <select value={newProdCategory} onChange={e=>setNewProdCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="Brakes">Brakes</option>
                    <option value="Filters & Fluids">Filters & Fluids</option>
                    <option value="Suspension & Steering">Suspension & Steering</option>
                    <option value="Electrical & Batteries">Electrical & Batteries</option>
                    <option value="Engine Parts">Engine Parts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Price (Ksh)</label>
                  <input type="number" required value={newProdPrice} onChange={e=>setNewProdPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Odor/Stock</label>
                  <input type="number" required value={newProdStock} onChange={e=>setNewProdStock(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">OEM Part Number</label>
                  <input type="text" required value={newProdPartNo} onChange={e=>setNewProdPartNo(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Description</label>
                <textarea rows={2} required placeholder="High performance friction material..." value={newProdDesc} onChange={e=>setNewProdDesc(e.target.value)} className="w-full p-3 border rounded-lg bg-white" />
              </div>

              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg uppercase text-[10px]">Save Part To Store</button>
            </form>
          )}

          {/* List display */}
          <div className="space-y-3">
            {products.map((p) => {
              const isLowStock = p.stock <= 5;
              return (
                <div key={p.id} className="p-3.5 bg-slate-50 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border" />
                    <div>
                      <span className="text-slate-800 font-extrabold block text-xs">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{p.category} | SKU: {p.partNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2.5 sm:pt-0">
                    <div className="text-right">
                      <span className="text-slate-400 block uppercase text-[8px]">In Stock</span>
                      <span className={`text-sm font-extrabold ${isLowStock ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>{p.stock} units</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block uppercase text-[8px]">Unit Price</span>
                      <span className="text-sm font-black text-slate-950">KSh {p.price.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleRestock(p)}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl uppercase text-[10px] shadow-sm flex items-center gap-1 shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restock (+20)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. CAR WASH QUEUE SIMULATION */}
      {adminSubTab === 'queue' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-950 text-base">Wash Bay Active Queue</h3>
            <p className="text-xs text-slate-500 mt-1">Simulate queue movements, active washing, and detailings.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-xs">
            {washQueue.map((item) => {
              const isWaiting = item.bay === 'Waiting Line';
              return (
                <div key={item.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start border-b pb-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">{item.reg}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{item.vehicle}</span>
                    </div>
                    <span className="font-bold text-orange-500 uppercase text-[9px]">{item.package}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Bay Status</span>
                    <span className="font-extrabold text-slate-800 block text-xs">{item.bay}</span>
                  </div>

                  {!isWaiting && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <span>Washing progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${item.progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t flex flex-wrap gap-1.5 justify-end">
                    {isWaiting ? (
                      <button
                        onClick={() => handleUpdateQueue(item.id, 'Bay 1 (Active Foaming)', 10)}
                        className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg uppercase text-[9px]"
                      >
                        Send to Bay 1
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUpdateQueue(item.id, item.bay, Math.min(100, item.progress + 30))}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg uppercase text-[9px]"
                        >
                          Progress +30%
                        </button>
                        {item.progress >= 95 && (
                          <button
                            onClick={() => handleUpdateQueue(item.id, 'Waiting Line', 0)}
                            className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg uppercase text-[9px]"
                          >
                            Release
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
