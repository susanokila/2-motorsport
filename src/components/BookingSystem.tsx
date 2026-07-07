import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Car, ShieldAlert, Sparkles, CheckCircle, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';
import { GarageService, CarWashPackage, Vehicle } from '../types';

interface BookingSystemProps {
  garageServices: GarageService[];
  carWashPackages: CarWashPackage[];
  initialServiceId?: string;
  initialServiceType?: 'garage' | 'car_wash';
  initialServiceName?: string;
  initialPrice?: number;
  savedVehicles: Vehicle[];
  onBookingComplete: (booking: any) => void;
  userEmail: string;
}

export default function BookingSystem({
  garageServices,
  carWashPackages,
  initialServiceId = '',
  initialServiceType = 'garage',
  initialServiceName = '',
  initialPrice = 0,
  savedVehicles,
  onBookingComplete,
  userEmail
}: BookingSystemProps) {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<'garage' | 'car_wash'>(initialServiceType);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedServiceName, setSelectedServiceName] = useState(initialServiceName);
  const [selectedPrice, setSelectedPrice] = useState(initialPrice);

  // Vehicle states
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState<number>(2018);
  const [vehicleReg, setVehicleReg] = useState('');
  const [vehicleVin, setVehicleVin] = useState('');
  const [useSavedVehicle, setUseSavedVehicle] = useState(false);

  // Date/Time/Mechanic states
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [selectedMechanicId, setSelectedMechanicId] = useState('any');
  const [selectedMechanicName, setSelectedMechanicName] = useState('Any Available Expert');

  // Checkout states
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'bank' | 'cash'>('mpesa');
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('0712345678');
  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);

  const mechanics = [
    { id: 'any', name: 'Any Available Expert', specialty: 'General diagnostic and detailing' },
    { id: 'mech-1', name: 'Peter Kamau', specialty: 'Master ECU Engine Diagnostics' },
    { id: 'mech-2', name: 'Kiprotich Sang', specialty: 'Suspension & Steering Specialist' },
    { id: 'mech-3', name: 'Martin Aluda', specialty: 'Transmission & Gearbox Master' },
  ];

  const timeSlots = [
    '08:30 AM',
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
  ];

  // React to initial values if passed
  useEffect(() => {
    if (initialServiceId) {
      setServiceType(initialServiceType);
      setSelectedServiceId(initialServiceId);
      setSelectedServiceName(initialServiceName);
      setSelectedPrice(initialPrice);
    }
  }, [initialServiceId, initialServiceType, initialServiceName, initialPrice]);

  // Autofill if saved vehicle chosen
  const handleSavedVehicleToggle = (checked: boolean) => {
    setUseSavedVehicle(checked);
    if (checked && savedVehicles.length > 0) {
      const v = savedVehicles[0];
      setVehicleMake(v.make);
      setVehicleModel(v.model);
      setVehicleYear(v.year);
      setVehicleReg(v.regNo);
      setVehicleVin(v.vin || '');
    } else {
      setVehicleMake('');
      setVehicleModel('');
      setVehicleYear(2018);
      setVehicleReg('');
      setVehicleVin('');
    }
  };

  const handleMechanicChange = (id: string) => {
    setSelectedMechanicId(id);
    const found = mechanics.find(m => m.id === id);
    if (found) setSelectedMechanicName(found.name);
  };

  const handleStepNext = () => {
    if (step === 1 && !selectedServiceId) {
      alert('Please select a service before proceeding.');
      return;
    }
    if (step === 2 && (!vehicleMake || !vehicleModel || !vehicleReg)) {
      alert('Please fill out vehicle make, model, and registration number.');
      return;
    }
    if (step === 3 && !bookingDate) {
      alert('Please select a preferred date.');
      return;
    }
    setStep(step + 1);
  };

  const handleStepBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const bookingPayload = {
      customerId: 'cust-1',
      customerName: 'Suzie Lizbel',
      customerEmail: userEmail || 'suzielizbel@gmail.com',
      vehicle: {
        make: vehicleMake,
        model: vehicleModel,
        year: vehicleYear,
        regNo: vehicleReg,
        vin: vehicleVin
      },
      serviceType,
      serviceId: selectedServiceId,
      serviceName: selectedServiceName,
      date: bookingDate,
      time: bookingTime,
      mechanicId: serviceType === 'garage' ? selectedMechanicId : undefined,
      mechanicName: serviceType === 'garage' ? selectedMechanicName : undefined,
      paymentMethod,
      totalAmount: selectedPrice,
    };

    setTimeout(() => {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      })
      .then(res => res.json())
      .then(bookingResult => {
        setSuccessBooking(bookingResult);
        onBookingComplete(bookingResult); // update global state
        setLoading(false);
        setStep(5);
      })
      .catch(err => {
        console.error("Booking failed:", err);
        setLoading(false);
      });
    }, 2000);
  };

  return (
    <div id="booking-system-wizard" className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
      {/* Title */}
      <div className="text-center pb-6 border-b border-slate-50 space-y-1.5">
        <h2 className="text-2xl font-extrabold text-slate-950">Online Booking Scheduler</h2>
        <p className="text-xs text-slate-400">Step {step} of 4: Schedule mechanical services & custom washing bays</p>
      </div>

      {/* Wizard Progress Line */}
      {step <= 4 && (
        <div className="flex justify-between items-center max-w-md mx-auto my-6 text-xs font-bold text-slate-400">
          {[
            { s: 1, label: 'Service' },
            { s: 2, label: 'Vehicle' },
            { s: 3, label: 'Schedule' },
            { s: 4, label: 'Payment' },
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center space-y-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs ${
                step === item.s
                  ? 'bg-blue-600 text-white border-blue-600 shadow'
                  : step > item.s
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white border-slate-200'
              }`}>
                {item.s}
              </div>
              <span className={step === item.s ? 'text-blue-600' : ''}>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase block">1. Select Service Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setServiceType('garage'); setSelectedServiceId(''); setSelectedServiceName(''); }}
                className={`py-4 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                  serviceType === 'garage'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>Garage Mechanical Work</span>
              </button>
              <button
                type="button"
                onClick={() => { setServiceType('car_wash'); setSelectedServiceId(''); setSelectedServiceName(''); }}
                className={`py-4 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                  serviceType === 'car_wash'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>Car Wash & Detailing</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase block">2. Select Package / Task</label>
            <select
              id="booking-service-dropdown"
              value={selectedServiceId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedServiceId(id);
                if (serviceType === 'garage') {
                  const s = garageServices.find(item => item.id === id);
                  if (s) { setSelectedServiceName(s.name); setSelectedPrice(s.price); }
                } else {
                  const w = carWashPackages.find(item => item.id === id);
                  if (w) { setSelectedServiceName(w.name); setSelectedPrice(w.price); }
                }
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Choose available package --</option>
              {serviceType === 'garage'
                ? garageServices.map(s => <option key={s.id} value={s.id}>{s.name} - KSh {s.price.toLocaleString()}</option>)
                : carWashPackages.map(w => <option key={w.id} value={w.id}>{w.name} - KSh {w.price.toLocaleString()}</option>)
              }
            </select>
          </div>

          {selectedPrice > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Service Fee Due:</span>
              <span className="text-lg font-extrabold text-slate-950">KSh {selectedPrice.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Vehicle Details */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Saved vehicles pre-fill */}
          {savedVehicles.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">Autofill Suzie’s Toyota Premio?</span>
              </div>
              <input
                id="checkbox-saved-vehicle"
                type="checkbox"
                checked={useSavedVehicle}
                onChange={(e) => handleSavedVehicleToggle(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Vehicle Make (Manufacturer)</label>
              <input
                type="text"
                placeholder="e.g. Toyota"
                required
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                disabled={useSavedVehicle}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Vehicle Model</label>
              <input
                type="text"
                placeholder="e.g. Premio / CX-5"
                required
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                disabled={useSavedVehicle}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Manufacture Year</label>
              <input
                type="number"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(Number(e.target.value))}
                disabled={useSavedVehicle}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Plate Registration No.</label>
              <input
                type="text"
                placeholder="e.g. KCD 123X"
                required
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)}
                disabled={useSavedVehicle}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Chassis VIN Number (Optional)</label>
            <input
              type="text"
              placeholder="17-Character alphanumeric chassis code"
              value={vehicleVin}
              onChange={(e) => setVehicleVin(e.target.value)}
              disabled={useSavedVehicle}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Step 3: Date, Time & Mechanic */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Preferred Date</label>
              <input
                id="booking-date-picker"
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Available Time Slots</label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800"
              >
                {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
              </select>
            </div>
          </div>

          {/* Mechanic optional select (only for garage repairs) */}
          {serviceType === 'garage' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Assign Certified Mechanic</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {mechanics.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleMechanicChange(m.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedMechanicId === m.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-slate-900 block">{m.name}</span>
                    <span className="text-[10px] text-slate-500 mt-1">{m.specialty}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Payments & Submit */}
      {step === 4 && (
        <form onSubmit={handleSubmitBooking} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">Select Booking Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'mpesa', label: 'M-Pesa STK push' },
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'cash', label: 'Pay Cash at Station' },
                { id: 'bank', label: 'Bank Electronic Transfer' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-3.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    paymentMethod === m.id
                      ? 'border-blue-600 bg-blue-50 text-blue-600 font-extrabold'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-extrabold text-orange-500 block">Safaricom M-Pesa STK push</span>
              <label className="text-xs font-bold text-slate-600 block">Registered Mobile Number</label>
              <input
                type="text"
                required
                value={mpesaPhoneNumber}
                onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                className="max-w-xs px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Service Summary card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3.5 text-xs">
            <h4 className="font-extrabold uppercase text-orange-400 text-[10px]">Booking Summary Details</h4>
            <div className="grid grid-cols-2 gap-4 text-slate-300">
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Service Type</span>
                <span className="text-white font-bold">{serviceType === 'garage' ? 'Garage Mechanical Work' : 'Car Detailing'}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Package Name</span>
                <span className="text-white font-bold">{selectedServiceName}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Vehicle Info</span>
                <span className="text-white font-bold">{vehicleMake} {vehicleModel} ({vehicleReg})</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Appointment Schedule</span>
                <span className="text-white font-bold">{bookingDate} @ {bookingTime}</span>
              </div>
              {serviceType === 'garage' && (
                <div>
                  <span className="block font-bold text-slate-400 text-[10px] uppercase">Assigned Mechanic</span>
                  <span className="text-white font-bold">{selectedMechanicName}</span>
                </div>
              )}
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase">Total Cost</span>
                <span className="text-white font-extrabold text-sm">KSh {selectedPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4 space-y-2">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <span className="text-xs text-slate-500 font-bold">Initiating STK payment & reserving workshop slot...</span>
            </div>
          ) : (
            <button
              id="booking-submit-final-btn"
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Confirm Appointment & Checkout
            </button>
          )}
        </form>
      )}

      {/* Step 5: Success screen */}
      {step === 5 && successBooking && (
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-950">Appointment Secured!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your booking <span className="font-bold text-slate-800">{successBooking.id}</span> has been saved and your mechanic bay has been prepared!
            </p>
          </div>

          {/* SMS Notification simulation */}
          <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-800 max-w-sm mx-auto text-left space-y-2 relative shadow-md">
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Simulated SMS Alert</span>
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "OKILA Motorsport Alert: Hi Suzie, your booking for {successBooking.serviceName} is CONFIRMED on {successBooking.date} at {successBooking.time}. Assigned expert: {successBooking.mechanicName || 'Wash Bay Staff'}. Thank you!"
            </p>
            <span className="absolute bottom-1 right-2 text-[8px] text-slate-600">SMS delivered to {mpesaPhoneNumber}</span>
          </div>

          <button
            onClick={() => { setStep(1); setSuccessBooking(null); setSelectedServiceId(''); }}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase shadow-sm"
          >
            Schedule Another Appointment
          </button>
        </div>
      )}

      {/* Navigation footer buttons */}
      {step < 5 && (
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between">
          <button
            onClick={handleStepBack}
            disabled={step === 1}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {step < 4 && (
            <button
              id={`booking-next-step-${step}`}
              onClick={handleStepNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
