import React from 'react';
import { Car, Check, Clock, Sparkles, Droplets } from 'lucide-react';
import { CarWashPackage } from '../types';

interface CarWashServicesProps {
  packages: CarWashPackage[];
  onBookWash: (packageId: string, serviceType: 'garage' | 'car_wash', packageName: string, price: number) => void;
}

export default function CarWashServices({ packages, onBookWash }: CarWashServicesProps) {
  return (
    <div id="carwash-services-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Premium Cleaning & Detailing</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Car Wash Packages</h2>
          <p className="text-xs text-slate-500 max-w-lg mt-1">
            Keep your vehicle sparkling clean and protected from equatorial sun, acidic rain, and road dust using our state-of-the-art water purification and foaming systems.
          </p>
        </div>
        
        <div className="inline-flex items-center space-x-1.5 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 text-xs font-bold text-blue-600 self-start md:self-auto">
          <Droplets className="w-4 h-4 text-blue-500 animate-bounce" />
          <span>Purified Soft Water Used Only</span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const isPremium = pkg.name.includes('Royal') || pkg.name.includes('Steam');
          const isBestSeller = pkg.name.includes('OKILA');

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-5 border flex flex-col justify-between relative hover:shadow-lg transition-all ${
                isBestSeller 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-100 shadow-sm'
              }`}
            >
              {/* Badges */}
              {isBestSeller && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                {/* Title & Price */}
                <div className="text-center pb-4 border-b border-slate-50">
                  <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Car Wash Package</span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{pkg.name}</h3>
                  <div className="mt-3 flex items-baseline justify-center">
                    <span className="text-xs font-bold text-slate-500 uppercase mr-1">KSh</span>
                    <span className="text-2xl font-extrabold text-slate-950">{pkg.price.toLocaleString()}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. {pkg.duration}</span>
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2.5">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Included Services</span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-50">
                <button
                  onClick={() => onBookWash(pkg.id, 'car_wash', pkg.name, pkg.price)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm uppercase tracking-wider ${
                    isBestSeller
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Book Wash bay
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promotional Card */}
      <div className="bg-gradient-to-tr from-slate-950 to-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between mt-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="space-y-3.5 relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full border border-blue-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly Detailing Specials</span>
          </div>
          <h3 className="text-xl font-extrabold md:text-2xl">Get 20% off Premium Detailing this Weekend!</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Protect your clear coat from road salt and sun oxidation. Book our multi-stage paint correction and 9H premium liquid ceramic coating service and receive an interior steam sanitation absolutely free of charge.
          </p>
        </div>
        <button
          onClick={() => {
            const royal = packages.find(p => p.id === 'wash-4');
            if (royal) onBookWash(royal.id, 'car_wash', royal.name, royal.price * 0.8);
          }}
          className="relative z-10 shrink-0 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-transform hover:-translate-y-0.5"
        >
          Book Special Now
        </button>
      </div>
    </div>
  );
}
