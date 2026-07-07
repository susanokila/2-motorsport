import React from 'react';
import { Wrench, Car, ShoppingBag, User, Sparkles, Phone, MessageSquare, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  userPoints: number;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, wishlistCount, userPoints }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Car },
    { id: 'spares', label: 'Auto Spares', icon: ShoppingBag },
    { id: 'garage', label: 'Garage', icon: Wrench },
    { id: 'carwash', label: 'Car Wash', icon: Car },
    { id: 'ai', label: 'AI Diagnostic', icon: Sparkles },
    { id: 'blog', label: 'Blog', icon: MessageSquare },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'account', label: 'My Account', icon: User },
    { id: 'admin', label: 'Admin Panel', icon: ShieldAlert, isAdmin: true },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-gradient-to-tr from-blue-600 to-orange-500 p-2.5 rounded-lg flex items-center justify-center shadow-md">
              <Wrench className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-orange-400 bg-clip-text text-transparent">
                OKILA
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-orange-500 font-bold">
                MOTORSPORT
              </span>
            </div>
          </div>

          {/* Nav Items - Desktop */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow'
                      : item.isAdmin
                      ? 'text-orange-400 hover:bg-slate-800/60 hover:text-orange-300'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Loyalty points */}
            <div className="hidden sm:flex items-center bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <Sparkles className="w-4 h-4 text-orange-500 mr-1.5 animate-bounce" />
              <span className="text-xs font-bold text-slate-200">{userPoints} pts</span>
            </div>

            {/* Shopping Cart Trigger */}
            <button
              id="btn-navbar-cart"
              onClick={() => setActiveTab('spares')}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nav Items - Mobile/Tablet Tab Bar */}
      <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-2 py-1.5 flex justify-around items-center overflow-x-auto gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-md min-w-[64px] transition-all ${
                isActive
                  ? 'text-blue-500'
                  : item.isAdmin
                  ? 'text-orange-500'
                  : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-1 truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
