import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, HelpCircle, ShieldCheck } from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('Suzie Lizbel');
  const [email, setEmail] = useState('suzielizbel@gmail.com');
  const [subject, setSubject] = useState('Brake Pad Compatibility Query');
  const [message, setMessage] = useState('I wanted to check if you have front brake pads in stock for my Toyota Premio 2016.');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    })
    .then(res => res.json())
    .then(data => {
      setSuccess(data.message || 'Message sent successfully!');
      setLoading(false);
      setMessage('');
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  return (
    <div id="contact-section-view" className="grid lg:grid-cols-3 gap-8 pb-16">
      {/* Contact Details Card */}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Get In Touch</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Contact Us</h2>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Have a technical question or need assistance with your booking? Reach out to our customer response desk.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 text-xs text-slate-600">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-slate-800 uppercase text-[9px]">Location</span>
              <span className="font-bold text-slate-700 text-xs block mt-1">Dar es Salaam Road</span>
              <span>Industrial Area, Nairobi, Kenya</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-slate-800 uppercase text-[9px]">Phone & WhatsApp</span>
              <span className="font-bold text-slate-700 text-xs block mt-1">+254 712 345678</span>
              <span>+254 799 OKILA</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-slate-800 uppercase text-[9px]">Email Inbox</span>
              <span className="font-bold text-slate-700 text-xs block mt-1">service@okila-motorsport.co.ke</span>
              <span>support@okila-motorsport.co.ke</span>
            </div>
          </div>
        </div>

        {/* FAQ helper */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 flex items-start gap-3 text-xs leading-relaxed">
          <HelpCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <span className="font-bold text-orange-400 block uppercase text-[10px]">Towing Support</span>
            <p className="text-slate-300">Need emergency towing in Nairobi? Loyalty points members get absolutely free breakdown recovery inside city parameters. Call +254 799 OKILA.</p>
          </div>
        </div>
      </div>

      {/* Online Contact Message Form */}
      <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={handleContactSubmit} className="space-y-5">
          <h3 className="text-xl font-extrabold text-slate-950 border-b border-slate-50 pb-2.5">Send a Message Online</h3>
          
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 block">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e=>setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-500 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e=>setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-slate-500 block">Subject / Query Topic</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e=>setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-slate-500 block">Detail Message</label>
            <textarea
              required
              rows={5}
              placeholder="How can we assist you with your engine tuning or ceramic coating details today?"
              value={message}
              onChange={e=>setMessage(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-600 font-bold">
              {success}
            </div>
          )}

          <button
            id="contact-form-submit"
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Submitting request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit message request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
