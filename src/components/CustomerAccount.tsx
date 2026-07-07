import React, { useState } from 'react';
import { User, Car, Calendar, ShoppingBag, Award, MapPin, Sparkles, FileText, CheckCircle, Clock } from 'lucide-react';
import { Booking, Order, Vehicle } from '../types';

interface CustomerAccountProps {
  user: {
    name: string;
    email: string;
    savedVehicles: Vehicle[];
    savedAddresses: string[];
    loyaltyPoints: number;
  };
  bookings: Booking[];
  orders: Order[];
}

export default function CustomerAccount({ user, bookings, orders }: CustomerAccountProps) {
  const [activeAccountTab, setActiveAccountTab] = useState<'profile' | 'bookings' | 'orders'>('profile');
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);

  return (
    <div id="customer-account-view" className="space-y-8 pb-16">
      {/* Header Banner card */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center font-black text-2xl uppercase shadow shadow-orange-500/20">
            {user.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold sm:text-2xl">{user.name}</h2>
            <span className="text-xs text-slate-400 block">{user.email}</span>
            <div className="inline-flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded text-[10px] text-orange-400 font-bold border border-slate-700">
              <Award className="w-3.5 h-3.5 text-orange-500 mr-1 animate-pulse" />
              <span>OKILA Motorsport Gold Member</span>
            </div>
          </div>
        </div>

        {/* Loyalty details */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shrink-0 min-w-[160px] relative z-10">
          <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Loyalty Balance</span>
          <span className="block text-2xl font-black text-white mt-1">{user.loyaltyPoints} pts</span>
          <p className="text-[9px] text-orange-400 font-semibold mt-1.5 animate-bounce">5% discount applies next checkout</p>
        </div>
      </div>

      {/* Account Navigator Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-stretch">
        {[
          { id: 'profile', label: 'My Profile & Garage', icon: User },
          { id: 'bookings', label: 'Workshop Bookings', icon: Calendar },
          { id: 'orders', label: 'Spares Order History', icon: ShoppingBag },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveAccountTab(tab.id as any); setViewingInvoice(null); }}
              className={`flex-1 py-3.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeAccountTab === tab.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile & Saved Vehicles Sub-tab */}
      {activeAccountTab === 'profile' && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* User metadata */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-950 text-sm border-b border-slate-100 pb-2.5">User Specifications</h3>
            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Account Name</span>
                <span className="text-slate-800 font-bold">{user.name}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Linked Email</span>
                <span className="text-slate-800 font-bold">{user.email}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Registered Address</span>
                <span className="text-slate-800 font-bold flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{user.savedAddresses[0]}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Saved vehicles list */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-950 text-sm border-b border-slate-100 pb-2.5">My Active Garage</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {user.savedVehicles.map((vehicle, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl mt-1 shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-slate-900">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                    <div className="space-y-1 text-slate-500">
                      <span className="block font-bold">Plate: <span className="text-slate-800 font-extrabold">{vehicle.regNo}</span></span>
                      {vehicle.vin && <span className="block text-[10px]">VIN: {vehicle.vin}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookings history sub-tab */}
      {activeAccountTab === 'bookings' && !viewingInvoice && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Service Appointments History</h3>
          {bookings.length === 0 ? (
            <p className="text-xs text-slate-400">No appointments scheduled under your email yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{b.serviceName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${
                        b.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                        b.status === 'in_progress' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                        b.status === 'confirmed' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-slate-500 font-bold">
                      <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{b.vehicle.make} {b.vehicle.model} ({b.vehicle.regNo})</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{b.date} @ {b.time}</span>
                      {b.mechanicName && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />Mech: {b.mechanicName}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between border-t border-slate-200 sm:border-t-0 pt-3 sm:pt-0">
                    <span className="font-black text-slate-950 text-sm">KSh {b.totalAmount.toLocaleString()}</span>
                    <button
                      onClick={() => setViewingInvoice(b)}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invoice details view */}
      {activeAccountTab === 'bookings' && viewingInvoice && (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">Invoice Statement</span>
              <h3 className="font-black text-slate-950 text-base mt-1">{viewingInvoice.id}</h3>
              <span className="text-slate-400 block mt-1">Date Issued: {viewingInvoice.date}</span>
            </div>
            <button
              onClick={() => setViewingInvoice(null)}
              className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-lg border"
            >
              Back to List
            </button>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Billed To</span>
              <span className="font-bold text-slate-800 text-xs block mt-1">{viewingInvoice.customerName}</span>
              <span className="text-slate-500 text-[11px]">{viewingInvoice.customerEmail}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Vehicle Particulars</span>
              <span className="font-bold text-slate-800 text-xs block mt-1">{viewingInvoice.vehicle.year} {viewingInvoice.vehicle.make} {viewingInvoice.vehicle.model}</span>
              <span className="text-slate-500 text-[11px] font-mono">Reg No: {viewingInvoice.vehicle.regNo}</span>
            </div>
          </div>

          {/* Itemized pricing list */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Itemized Breakdown</span>
            <div className="flex justify-between py-2 border-b border-slate-50 text-slate-700">
              <span className="font-medium">{viewingInvoice.serviceName} (Standard fee)</span>
              <span className="font-bold">KSh {(viewingInvoice.totalAmount * 0.85).toLocaleString()}</span>
            </div>
            {viewingInvoice.jobCard?.partsUsed?.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between py-2 border-b border-slate-50 text-slate-700">
                <span className="font-medium">{p.name} (x{p.quantity})</span>
                <span className="font-bold">KSh {(p.price * p.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-b border-slate-50 text-slate-700">
              <span>Standard VAT (16%)</span>
              <span>KSh {(viewingInvoice.totalAmount * 0.15).toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-between items-center text-sm">
            <span className="font-bold text-slate-900">Total Invoice Amount Paid:</span>
            <span className="text-lg font-black text-slate-950">KSh {viewingInvoice.totalAmount.toLocaleString()}</span>
          </div>

          {/* Service job card details if present */}
          {viewingInvoice.jobCard && (
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center space-x-1.5 text-blue-600">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-700">Official Mechanic Report</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[9px]">Tasks Executed</span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  {viewingInvoice.jobCard.tasksPerformed.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-slate-400 font-bold block uppercase text-[9px]">Summary Report</span>
                <p className="text-[11px] text-slate-600 italic leading-relaxed">"{viewingInvoice.jobCard.serviceReport}"</p>
              </div>
              <span className="block text-[10px] text-slate-400 text-right font-semibold">Signed: {viewingInvoice.jobCard.mechanicName}</span>
            </div>
          )}
        </div>
      )}

      {/* Orders History Sub-tab */}
      {activeAccountTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Spares Shopping Orders</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-400">No spare parts orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">Order #{o.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        o.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                        o.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-slate-500 font-bold block text-[11px]">
                      Items: {o.items.map((i: any) => `${i.productName} (x${i.quantity})`).join(', ')}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">Tracking Code: {o.trackingNumber} | Delivered To: {o.shippingAddress}</span>
                  </div>

                  <span className="font-black text-slate-950 text-sm shrink-0">KSh {o.totalAmount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
