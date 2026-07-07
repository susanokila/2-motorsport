import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import SparesStore from './components/SparesStore';
import GarageServices from './components/GarageServices';
import CarWashServices from './components/CarWashServices';
import BookingSystem from './components/BookingSystem';
import AiAssistant from './components/AiAssistant';
import CustomerAccount from './components/CustomerAccount';
import ContactSection from './components/ContactSection';
import BlogSection from './components/BlogSection';
import AdminPanel from './components/AdminPanel';

import { Product, GarageService, CarWashPackage, Review, BlogPost, Booking, Order, Vehicle, User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Database lists fetched from API
  const [products, setProducts] = useState<Product[]>([]);
  const [garageServices, setGarageServices] = useState<GarageService[]>([]);
  const [carWashPackages, setCarWashPackages] = useState<CarWashPackage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Cart & Wishlist state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Prefill helper states for redirecting with booking options
  const [prefilledServiceId, setPrefilledServiceId] = useState('');
  const [prefilledServiceType, setPrefilledServiceType] = useState<'garage' | 'car_wash'>('garage');
  const [prefilledServiceName, setPrefilledServiceName] = useState('');
  const [prefilledPrice, setPrefilledPrice] = useState(0);

  // Simulated Customer Account
  const [user, setUser] = useState<User>({
    id: 'cust-1',
    name: 'Suzie Lizbel',
    email: 'suzielizbel@gmail.com',
    role: 'customer',
    savedVehicles: [
      { make: 'Toyota', model: 'Premio', year: 2016, regNo: 'KCD 123X', vin: 'AT260-104928' }
    ],
    savedAddresses: ['Nairobi, Kilimani Road, Apt 4B'],
    loyaltyPoints: 340
  });

  // Fetch initial data from back-end server
  const fetchAllData = () => {
    // Products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));

    // Garage services
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setGarageServices(data))
      .catch(err => console.error(err));

    // Car wash packages
    fetch('/api/wash-packages')
      .then(res => res.json())
      .then(data => setCarWashPackages(data))
      .catch(err => console.error(err));

    // Reviews
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));

    // Blogs
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));

    // Bookings
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));

    // Orders
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync state helpers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    // Check stock boundaries
    const prod = products.find(p => p.id === productId);
    if (prod && quantity > prod.stock) {
      alert(`Cannot add more. Only ${prod.stock} units are currently available in stock.`);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handlePlaceOrder = (newOrder: Order) => {
    // Clear cart and update points
    setCart([]);
    setOrders(prev => [newOrder, ...prev]);
    const earnedPoints = Math.floor(newOrder.totalAmount * 0.05);
    setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + earnedPoints }));
    // Refresh products catalog to reflect lowered stock
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  // Redirect from various sections directly into pre-filled booking flow
  const handleQuickBookRedirect = (serviceId: string, serviceType: 'garage' | 'car_wash', serviceName: string, price: number) => {
    setPrefilledServiceId(serviceId);
    setPrefilledServiceType(serviceType);
    setPrefilledServiceName(serviceName);
    setPrefilledPrice(price);
    setActiveTab('booking-wizard');
  };

  const handleBookingCompleted = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    // Award loyalty points for booking
    const earnedPoints = Math.floor(newBooking.totalAmount * 0.05);
    setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + earnedPoints }));
  };

  // Admin updates
  const handleAdminUpdateProduct = (updatedProduct: Product) => {
    fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    })
    .then(res => res.json())
    .then(() => {
      // Refresh
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data));
    })
    .catch(err => console.error(err));
  };

  const handleAdminAddProduct = (newProductData: any) => {
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductData)
    })
    .then(res => res.json())
    .then(() => {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data));
    })
    .catch(err => console.error(err));
  };

  const handleAdminUpdateBooking = (bookingId: string, updatedFields: any) => {
    fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    })
    .then(res => res.json())
    .then(() => {
      // Refresh bookings
      fetch('/api/bookings')
        .then(res => res.json())
        .then(data => setBookings(data));
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Dynamic Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        userPoints={user.loyaltyPoints}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <HomeSection
            setActiveTab={setActiveTab}
            featuredProducts={products}
            reviews={reviews}
            onQuickBook={handleQuickBookRedirect}
          />
        )}

        {activeTab === 'spares' && (
          <SparesStore
            products={products}
            cart={cart}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateCartQty={handleUpdateCartQty}
            onToggleWishlist={handleToggleWishlist}
            onPlaceOrder={handlePlaceOrder}
            userEmail={user.email}
          />
        )}

        {activeTab === 'garage' && (
          <GarageServices
            services={garageServices}
            onBookService={handleQuickBookRedirect}
          />
        )}

        {activeTab === 'carwash' && (
          <CarWashServices
            packages={carWashPackages}
            onBookWash={handleQuickBookRedirect}
          />
        )}

        {activeTab === 'booking-wizard' && (
          <BookingSystem
            garageServices={garageServices}
            carWashPackages={carWashPackages}
            initialServiceId={prefilledServiceId}
            initialServiceType={prefilledServiceType}
            initialServiceName={prefilledServiceName}
            initialPrice={prefilledPrice}
            savedVehicles={user.savedVehicles}
            onBookingComplete={handleBookingCompleted}
            userEmail={user.email}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistant
            onPreFillBooking={handleQuickBookRedirect}
          />
        )}

        {activeTab === 'blog' && (
          <BlogSection
            posts={blogs}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection />
        )}

        {activeTab === 'account' && (
          <CustomerAccount
            user={user}
            bookings={bookings}
            orders={orders}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            products={products}
            bookings={bookings}
            orders={orders}
            onUpdateProduct={handleAdminUpdateProduct}
            onUpdateBooking={handleAdminUpdateBooking}
            onAddProduct={handleAdminAddProduct}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 text-xs shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="block font-bold text-white text-sm">OKILA MOTORSPORT LTD</span>
            <span>Dar es Salaam Road, Industrial Area, Nairobi, Kenya</span>
          </div>
          <div className="space-y-1">
            <span>&copy; {new Date().getFullYear()} OKILA Motorsport. All rights reserved.</span>
            <span className="block text-slate-500">Premium spares, automated garage schedules, and professional wash details.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
