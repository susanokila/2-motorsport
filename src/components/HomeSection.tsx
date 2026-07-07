import React from 'react';
import { ShieldCheck, Truck, Clock, PhoneCall, Sparkles, MapPin, Star, Calendar, MessageSquare } from 'lucide-react';
import { Product, Review } from '../types';

interface HomeSectionProps {
  setActiveTab: (tab: string) => void;
  featuredProducts: Product[];
  reviews: Review[];
  onQuickBook: (serviceId: string, serviceType: 'garage' | 'car_wash', serviceName: string, price: number) => void;
}

export default function HomeSection({ setActiveTab, featuredProducts, reviews, onQuickBook }: HomeSectionProps) {
  return (
    <div id="home-section" className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative bg-slate-950 text-white py-24 px-6 md:px-12 overflow-hidden rounded-3xl mt-6 mx-4 md:mx-8 shadow-2xl border border-slate-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 text-sm font-semibold text-orange-400">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Nairobi’s Premier 3-in-1 Auto Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            High-Performance Care for <span className="bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent">Your Vehicle</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            At OKILA Motorsport, we integrate premium auto spares, professional diagnostics, expert garage repairs, and high-gloss car wash detailing under one high-tech roof.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              id="hero-book-garage-btn"
              onClick={() => setActiveTab('garage')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Book Garage Service
            </button>
            <button
              id="hero-book-wash-btn"
              onClick={() => setActiveTab('carwash')}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 hover:border-slate-500 transition-all"
            >
              Book Car Wash
            </button>
            <button
              id="hero-ai-btn"
              onClick={() => setActiveTab('ai')}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>AI Symptom Diagnoser</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {[
          { icon: ShieldCheck, title: '100% Genuine Parts', desc: 'Authorized dealers for Brembo, Castrol, Bosch & KYB' },
          { icon: Clock, title: 'Express Completion', desc: '45-min general service & high-speed washing bays' },
          { icon: Truck, title: 'Nairobi-Wide Delivery', desc: 'Fast delivery on all auto spares straight to your door' },
          { icon: PhoneCall, title: '24/7 AI Assistance', desc: 'Automated diagnostics & real-time pricing estimators' },
        ].map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">{badge.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Brief Company Introduction */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-950">
            About OKILA Motorsport
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Founded with a passion for mechanical precision, OKILA Motorsport has grown from a specialized racing garage in Nairobi into a premier full-service automotive hub. We eliminate the stress of vehicle maintenance by combining an extensive auto spares store, master mechanics, and state-of-the-art detailing facilities.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Certified Master Mechanics</h4>
                <p className="text-xs text-slate-500">All engineers have extensive diagnostics training with modern OBD-II and ECU software.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Laser-Precise Equipment</h4>
                <p className="text-xs text-slate-500">From 3D wheel alignment units to sanitary high-pressure steam extractors, we invest in perfection.</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('blog')}
            className="text-blue-600 hover:text-blue-700 font-bold text-sm inline-flex items-center gap-1.5 hover:underline"
          >
            <span>Read our Car Maintenance Blog</span>
            <span>&rarr;</span>
          </button>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg border border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=1000&auto=format&fit=crop"
            alt="OKILA Motorsport Workshop"
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white p-4 rounded-xl backdrop-blur-sm">
            <span className="block font-bold text-sm text-orange-400">Visit Us Today</span>
            <span className="text-xs text-slate-300">Dar es Salaam Road, Industrial Area, Nairobi</span>
          </div>
        </div>
      </section>

      {/* Featured Spares Showcase */}
      <section className="bg-slate-50 py-12 px-4 rounded-3xl mx-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Genuine Spares Store</span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-1">Featured Spares & Fluids</h2>
            </div>
            <button
              onClick={() => setActiveTab('spares')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
            >
              Shop All Parts
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all">
                <div className="h-40 rounded-xl overflow-hidden bg-slate-100 relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-900/85 text-orange-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                    {p.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mt-3 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">{p.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="font-extrabold text-slate-950 text-base">KSh {p.price.toLocaleString()}</span>
                  <button
                    onClick={() => setActiveTab('spares')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Testimonials</span>
          <h2 className="text-3xl font-extrabold text-slate-950">What Our Clients Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{r.comment}"
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <span className="font-bold text-slate-800 text-xs">{r.name}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">{r.category} client</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact, Business Hours & Map Mockup */}
      <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-6">
          <h3 className="text-xl font-extrabold">Contact Info</h3>
          <div className="space-y-4 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">Workshop Address</span>
                <span>Dar es Salaam Road, Industrial Area, Nairobi, Kenya</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">Phone & WhatsApp</span>
                <span>+254 712 345678 / +254 799 OKILA</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">Email Address</span>
                <span>service@okila-motorsport.co.ke</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('contact')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Send Online Message
          </button>
        </div>

        {/* Business Hours */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900">Business Hours</h3>
          <div className="space-y-3.5 text-sm">
            {[
              { day: 'Monday - Friday', time: '7:30 AM - 6:30 PM' },
              { day: 'Saturday', time: '8:00 AM - 5:00 PM' },
              { day: 'Sundays', time: '9:00 AM - 3:00 PM (Car Wash & Express Oil only)' },
              { day: 'Public Holidays', time: 'Closed' },
            ].map((hours, idx) => (
              <div key={idx} className="flex justify-between items-center pb-2 border-b border-slate-50 last:border-b-0">
                <span className="font-bold text-slate-700">{hours.day}</span>
                <span className="text-slate-500 font-medium">{hours.time}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center italic">
            Emergency mechanical diagnostics booking available online 24/7.
          </p>
        </div>

        {/* Map Mockup */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner border border-slate-200">
          {/* Interactive grid visual representing map */}
          <div className="absolute inset-0 bg-slate-200 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="border border-slate-300"></div>
            ))}
          </div>
          {/* Map details */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">OKILA MOTORSPORT HQ</h4>
              <p className="text-xs text-slate-500 mt-1">Dar es Salaam Rd, Nairobi</p>
              <p className="text-[10px] text-slate-400">Lat: -1.3047, Long: 36.8492</p>
            </div>
            <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200">
              Simulated Interactive Location
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
