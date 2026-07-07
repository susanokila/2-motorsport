import React, { useState } from 'react';
import { Wrench, ShieldCheck, Clock, HelpCircle, AlertCircle } from 'lucide-react';
import { GarageService } from '../types';

interface GarageServicesProps {
  services: GarageService[];
  onBookService: (serviceId: string, serviceType: 'garage' | 'car_wash', serviceName: string, price: number) => void;
}

export default function GarageServices({ services, onBookService }: GarageServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Diagnostics',
    'Electrical & Diagnostics',
    'Brakes',
    'Filters & Fluids',
    'Suspension & Steering',
    'Air Conditioning',
    'Transmission'
  ];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory || s.category.includes(selectedCategory));

  return (
    <div id="garage-services-view" className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Expert Mechanical Workshop</span>
        <h2 className="text-3xl font-extrabold text-slate-950">Garage & Mechanical Services</h2>
        <p className="text-xs text-slate-500 max-w-xl mt-1">
          From advanced computer diagnostics to major mechanical rebuilding, our certified engineering team delivers precision you can rely on.
        </p>
      </div>

      {/* Categories Scroller */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-950 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid list */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3.5">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                  {service.category}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.duration}</span>
                </span>
              </div>
              
              <h3 className="text-lg font-extrabold text-slate-900">{service.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">{service.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Service Charge</span>
                <span className="text-xl font-extrabold text-slate-950">KSh {service.price.toLocaleString()}</span>
              </div>
              <button
                onClick={() => onBookService(service.id, 'garage', service.name, service.price)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workshop Certifications / Info Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center gap-6 justify-between mt-10 shadow-lg">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-1.5 text-orange-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-extrabold text-xs uppercase tracking-wider">OKILA Mechanical Warranty</span>
          </div>
          <h4 className="text-lg font-bold">12-Month or 10,000 KM Warranty on All Labour</h4>
          <p className="text-xs text-slate-300">
            We stand behind our craftsmanship. Every single part fitted and labor task performed comes with our full service center warranty and computerized service history tracking.
          </p>
        </div>
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center shrink-0 min-w-[180px]">
          <span className="block text-[10px] text-slate-400 uppercase font-bold">Need assistance?</span>
          <span className="block text-sm font-extrabold text-white mt-1">+254 799 OKILA</span>
          <p className="text-[9px] text-slate-500 mt-1 italic">Free towing for loyalty members</p>
        </div>
      </div>
    </div>
  );
}
