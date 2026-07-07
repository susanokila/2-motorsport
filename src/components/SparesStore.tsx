import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, Heart, Trash2, Plus, Minus, Sparkles, CheckCircle, Package, Truck, Info, CreditCard } from 'lucide-react';
import { Product, Order, OrderItem } from '../types';

interface SparesStoreProps {
  products: Product[];
  cart: { product: Product; quantity: number }[];
  wishlist: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onPlaceOrder: (orderData: any) => void;
  userEmail: string;
}

export default function SparesStore({
  products,
  cart,
  wishlist,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQty,
  onToggleWishlist,
  onPlaceOrder,
  userEmail
}: SparesStoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMatchedProducts, setAiMatchedProducts] = useState<Product[] | null>(null);
  const [aiReason, setAiReason] = useState('');
  const [activeSubView, setActiveSubView] = useState<'browse' | 'cart' | 'checkout' | 'track'>('browse');

  // Checkout states
  const [shippingName, setShippingName] = useState('Suzie Lizbel');
  const [shippingEmail, setShippingEmail] = useState(userEmail || 'suzielizbel@gmail.com');
  const [shippingAddress, setShippingAddress] = useState('Nairobi, Kilimani Road, Apt 4B');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'bank' | 'cash'>('mpesa');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'done'>('form');
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('0712345678');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Tracking states
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState('');

  const categories = [
    'All',
    'Brakes',
    'Filters & Fluids',
    'Suspension & Steering',
    'Electrical & Batteries',
    'Tyres & Wheels',
    'Engine Parts',
    'Accessories & Care'
  ];

  // AI smart search implementation
  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSearchQuery.trim()) return;

    setAiLoading(true);
    setAiMatchedProducts(null);
    setAiReason('');

    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchQuery })
      });
      const data = await response.json();
      if (data.matched) {
        setAiMatchedProducts(data.matched);
        setAiReason(data.reason);
      }
    } catch (error) {
      console.error('Error fetching AI search:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleClearAiSearch = () => {
    setAiMatchedProducts(null);
    setAiReason('');
    setAiSearchQuery('');
  };

  // Filter products by category and standard keyword search (only if not viewing AI search matches)
  const displayedProducts = aiMatchedProducts 
    ? aiMatchedProducts 
    : products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesKeyword = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.partNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesKeyword;
      });

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingFee = cartSubtotal > 15000 ? 0 : 450;
  const loyaltyPointsEarned = Math.floor(cartSubtotal * 0.05);
  const cartTotal = cartSubtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');

    // Simulate Payment Gateway or M-Pesa push
    setTimeout(() => {
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image
      }));

      const newOrder = {
        items: orderItems,
        totalAmount: cartTotal,
        paymentMethod,
        shippingAddress,
        customerName: shippingName,
        customerEmail: shippingEmail
      };

      // Call API
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })
      .then(res => res.json())
      .then(orderResult => {
        setPlacedOrder(orderResult);
        onPlaceOrder(orderResult); // send to parent state
        setCheckoutStep('done');
      })
      .catch(err => {
        console.error("Checkout failed:", err);
        setCheckoutStep('form');
      });
    }, 2000);
  };

  // Handle Order Tracking lookup
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);

    fetch('/api/orders')
      .then(res => res.json())
      .then((data: Order[]) => {
        const matched = data.find(o => o.id.toLowerCase() === trackingId.trim().toLowerCase() || o.trackingNumber.toLowerCase() === trackingId.trim().toLowerCase());
        if (matched) {
          setTrackedOrder(matched);
        } else {
          setTrackError('No order found with that Order ID or Tracking Number.');
        }
      })
      .catch(err => {
        console.error(err);
        setTrackError('Error connecting to tracking server.');
      });
  };

  return (
    <div id="spares-store-view" className="space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">100% Certified Spares</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Auto Spares Shop</h2>
        </div>
        
        {/* Sub Navigation Bar */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-stretch md:self-auto gap-1">
          <button
            onClick={() => { setActiveSubView('browse'); handleClearAiSearch(); }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubView === 'browse' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Browse Catalog
          </button>
          <button
            id="tab-btn-cart"
            onClick={() => setActiveSubView('cart')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSubView === 'cart' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart ({cart.length})</span>
          </button>
          <button
            onClick={() => setActiveSubView('track')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSubView === 'track' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {activeSubView === 'browse' && (
        <>
          {/* AI-Powered Smart Parts Search Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="font-extrabold text-base tracking-wide uppercase">AI-Powered Spare Parts Search</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Don’t know the exact serial number or part name? Just describe what vehicle you drive and the part you need in plain English!
            </p>
            <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row gap-2">
              <input
                id="ai-search-input"
                type="text"
                placeholder="e.g., I drive a 2016 Toyota Premio and need a front brake pad"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                id="ai-search-submit"
                type="submit"
                disabled={aiLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Searching Catalog...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-orange-300" />
                    <span>AI Spares Match</span>
                  </>
                )}
              </button>
            </form>

            {aiMatchedProducts && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-blue-900/60 flex flex-col md:flex-row items-start md:items-center gap-3">
                <div className="flex-1 text-xs">
                  <span className="block font-bold text-blue-400 uppercase tracking-widest text-[10px] mb-1">AI Recommendation Insight</span>
                  <p className="text-slate-200">{aiReason}</p>
                </div>
                <button
                  onClick={handleClearAiSearch}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-[10px] uppercase transition-colors"
                >
                  Clear AI Filter
                </button>
              </div>
            )}
          </div>

          {/* Standard Browse, Search & Filters Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Filter Sidebar - Desktop */}
            <div className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 h-fit">
              <div className="flex items-center space-x-1.5 pb-3 border-b border-slate-100">
                <Filter className="w-4 h-4 text-slate-700" />
                <h3 className="font-extrabold text-slate-900 text-sm uppercase">Filter Categories</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); handleClearAiSearch(); }}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat && !aiMatchedProducts
                        ? 'bg-blue-50 text-blue-600 font-extrabold'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Display Main Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Keyword filter input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute top-3.5 left-4 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by part name, brand, or OEM number..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); handleClearAiSearch(); }}
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Category filters - Mobile horizontal scroll */}
              <div className="lg:hidden flex overflow-x-auto gap-2 pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); handleClearAiSearch(); }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat && !aiMatchedProducts
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products List Grid */}
              {displayedProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 shadow-sm space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800">No Spares Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    We couldn’t find any spares fitting that keyword. Try using our AI Search banner above for complex compatibility!
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((p) => {
                    const isInWishlist = wishlist.some(item => item.id === p.id);
                    const isLowStock = p.stock <= 5;

                    return (
                      <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col hover:shadow-md transition-all">
                        {/* Image area */}
                        <div className="h-44 rounded-xl overflow-hidden bg-slate-50 relative">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => onToggleWishlist(p)}
                            className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white rounded-full text-rose-500 shadow-sm transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500' : ''}`} />
                          </button>
                          
                          {isLowStock && (
                            <span className="absolute bottom-2.5 left-2.5 bg-red-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                              Low Stock: Only {p.stock} Left!
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <div className="flex-1 mt-4 space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase">
                            <span>{p.category}</span>
                            <span>{p.partNumber}</span>
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{p.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">{p.description}</p>
                          
                          {/* Compat */}
                          <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-600">
                            <span className="font-bold block text-slate-500 mb-0.5">Compatible vehicles:</span>
                            <span className="truncate block font-medium">{p.compatibility.join(', ')}</span>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Price</span>
                            <span className="font-extrabold text-slate-950 text-base">KSh {p.price.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => onAddToCart(p)}
                            disabled={p.stock === 0}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Cart View */}
      {activeSubView === 'cart' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart item listing */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Your Shopping Cart</h3>
            {cart.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 shadow-sm space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-800">Your Cart is Empty</h4>
                  <p className="text-xs text-slate-500 mt-1">Browse our genuine spare parts catalog to find components for your vehicle.</p>
                </div>
                <button
                  onClick={() => setActiveSubView('browse')}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Go to Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-50" />
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.product.name}</h4>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {item.product.category}
                      </span>
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl">
                      <button
                        onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-950 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold text-slate-900 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-950 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price and delete */}
                    <div className="flex items-center space-x-4">
                      <span className="font-extrabold text-slate-950 text-sm sm:text-base">KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing breakdown summary */}
          {cart.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 h-fit">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase pb-3 border-b border-slate-100">Order Summary</h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-slate-800">KSh {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Nairobi Shipping Fee</span>
                  <span className="font-bold text-slate-800">
                    {shippingFee === 0 ? 'FREE Shipping' : `KSh ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-slate-400 italic">Get free shipping on orders over KSh 15,000!</p>
                )}
                <div className="flex justify-between items-center text-slate-500 pb-3 border-b border-slate-100">
                  <span>Loyalty Points Gained</span>
                  <span className="font-bold text-orange-500">+{loyaltyPointsEarned} pts</span>
                </div>
                <div className="flex justify-between items-center text-slate-950 text-sm font-extrabold">
                  <span>Total Due</span>
                  <span>KSh {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                id="btn-go-to-checkout"
                onClick={() => setActiveSubView('checkout')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Checkout</span>
                <span>&rarr;</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Checkout Subview */}
      {activeSubView === 'checkout' && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          {checkoutStep === 'form' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">Spares Checkout</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Delivery Shipping Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Kilimani Road, Nairobi"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Select Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'mpesa', label: 'M-Pesa STK Push' },
                    { id: 'card', label: 'Credit/Debit Card' },
                    { id: 'bank', label: 'Bank Transfer' },
                    { id: 'cash', label: 'Cash on Delivery' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`py-3.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-extrabold text-orange-500 block">Safaricom M-Pesa STK push</span>
                  <label className="text-xs font-bold text-slate-600 block">M-Pesa Registered Number</label>
                  <input
                    type="text"
                    required
                    value={mpesaPhoneNumber}
                    onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                    className="max-w-xs px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 0712345678"
                  />
                  <p className="text-[10px] text-slate-400">An M-Pesa popup PIN request prompt will be initiated to this number upon order placement.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[10px] uppercase font-extrabold text-blue-500 block">Secure Card Payment Checkout</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Card Number" className="col-span-3 px-3 py-2 border border-slate-200 rounded text-xs bg-white focus:outline-none" />
                    <input type="text" placeholder="MM/YY" className="px-3 py-2 border border-slate-200 rounded text-xs bg-white focus:outline-none" />
                    <input type="text" placeholder="CVV" className="px-3 py-2 border border-slate-200 rounded text-xs bg-white focus:outline-none" />
                  </div>
                </div>
              )}

              {/* Due Summary */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 block">Total payment due:</span>
                  <span className="font-extrabold text-slate-900 text-lg">KSh {cartTotal.toLocaleString()}</span>
                </div>
                <button
                  id="checkout-confirm-btn"
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase shadow-md"
                >
                  Confirm & Pay Order
                </button>
              </div>
            </form>
          )}

          {checkoutStep === 'processing' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <h4 className="font-bold text-slate-800">Processing Payment...</h4>
                {paymentMethod === 'mpesa' ? (
                  <p className="text-xs text-slate-400 mt-1">Please check your mobile phone for the M-Pesa STK PIN input request...</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Verifying credentials with card issuer secure gates...</p>
                )}
              </div>
            </div>
          )}

          {checkoutStep === 'done' && placedOrder && (
            <div className="text-center py-12 space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-md mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you! Your payment of <span className="font-bold text-slate-800">KSh {placedOrder.totalAmount.toLocaleString()}</span> has been confirmed.
                </p>
              </div>

              {/* Details card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Order ID:</span>
                  <span className="font-bold text-slate-800">{placedOrder.id}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tracking Code:</span>
                  <span className="font-bold text-slate-800">{placedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Deliver To:</span>
                  <span className="font-bold text-slate-800">{placedOrder.shippingAddress}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Status:</span>
                  <span className="font-bold text-orange-500 capitalize">{placedOrder.status}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => { setActiveSubView('browse'); setCheckoutStep('form'); }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => { setTrackingId(placedOrder.id); setActiveSubView('track'); setCheckoutStep('form'); }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Track Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Track Order Subview */}
      {activeSubView === 'track' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Track Your Order</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your Order ID (e.g. ord-1001) or Tracking Code to look up shipping and status updates.</p>
          </div>

          <form onSubmit={handleTrackOrder} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. ord-1001"
              required
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Search Status
            </button>
          </form>

          {trackError && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-xs text-red-600 font-medium">
              {trackError}
            </div>
          )}

          {trackedOrder && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Order Reference</span>
                  <span className="font-extrabold text-slate-900 text-sm">{trackedOrder.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Shipped On</span>
                  <span className="font-bold text-slate-700">{trackedOrder.date}</span>
                </div>
              </div>

              {/* Tracker status line */}
              <div className="relative pt-4 pb-2">
                <div className="absolute top-7 left-3.5 right-3.5 h-1 bg-slate-200 -z-0"></div>
                <div className={`absolute top-7 left-3.5 right-3.5 h-1 -z-0 bg-blue-600 transition-all`} style={{
                  width: trackedOrder.status === 'processing' ? '0%' : trackedOrder.status === 'shipped' ? '50%' : '100%'
                }}></div>
                
                <div className="relative z-10 flex justify-between">
                  {[
                    { id: 'processing', label: 'Processing' },
                    { id: 'shipped', label: 'Dispatched' },
                    { id: 'delivered', label: 'Delivered' },
                  ].map((step, index) => {
                    const isPassed = (trackedOrder.status === 'processing' && index === 0) ||
                                     (trackedOrder.status === 'shipped' && index <= 1) ||
                                     (trackedOrder.status === 'delivered');
                    return (
                      <div key={step.id} className="flex flex-col items-center space-y-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                          isPassed ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-bold text-slate-600">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <span className="text-slate-400 font-bold block uppercase text-[9px] mb-2">Package Items</span>
                {trackedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">{item.productName} (x{item.quantity})</span>
                    <span className="font-bold">KSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>Total Amount paid:</span>
                <span>KSh {trackedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
