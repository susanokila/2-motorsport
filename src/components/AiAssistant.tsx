import React, { useState } from 'react';
import { Sparkles, Send, Wrench, ShieldAlert, AlertCircle, RefreshCw, Cpu, Calculator, HelpCircle, FileText, Calendar } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AiAssistantProps {
  onPreFillBooking: (serviceId: string, serviceType: 'garage' | 'car_wash', serviceName: string, price: number) => void;
}

export default function AiAssistant({ onPreFillBooking }: AiAssistantProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'diagnose' | 'estimate' | 'reminder'>('chat');

  // Chat states
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I am your OKILA Motorsport AI assistant. I can help you find premium spare parts (like Brembo brakes or Castrol synthetic oils), recommend professional garage/car-wash packages, diagnose vehicle symptoms, or help you book an appointment. What vehicle do you drive today?" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Diagnostics states
  const [diagMake, setDiagMake] = useState('Toyota');
  const [diagModel, setDiagModel] = useState('Premio');
  const [diagYear, setDiagYear] = useState('2016');
  const [diagSymptom, setDiagSymptom] = useState('');
  const [diagResult, setDiagResult] = useState<any | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  // Estimator states
  const [estDescription, setEstDescription] = useState('');
  const [estResult, setEstResult] = useState<any | null>(null);
  const [estLoading, setEstLoading] = useState(false);

  // Reminder states
  const [remOdometer, setRemOdometer] = useState('115000');
  const [remLastService, setRemLastService] = useState('2026-02-15');
  const [remOutput, setRemOutput] = useState<any | null>(null);

  // 1. Send Chat message
  const handleSendChat = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setChatHistory(prev => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            text: msg.text
          }))
        })
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'assistant', text: "I'm sorry, but I'm having trouble communicating with my knowledge center. Please try again in a bit!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. AI vehicle symptom diagnosis
  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagSymptom.trim() || diagLoading) return;

    setDiagLoading(true);
    setDiagResult(null);

    try {
      const response = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptom: diagSymptom,
          make: diagMake,
          model: diagModel,
          year: diagYear
        })
      });
      const data = await response.json();
      setDiagResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDiagLoading(false);
    }
  };

  // 3. AI cost estimator
  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estDescription.trim() || estLoading) return;

    setEstLoading(true);
    setEstResult(null);

    try {
      const response = await fetch('/api/ai-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: estDescription })
      });
      const data = await response.json();
      setEstResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setEstLoading(false);
    }
  };

  // 4. Maintenance reminder calculation
  const handleCalculateReminders = (e: React.FormEvent) => {
    e.preventDefault();
    const odo = Number(remOdometer) || 100000;
    
    // Simulate smart predictions
    const predictions = [
      { task: 'Full Synthetic Engine Oil Service', interval: 'Every 10,000 KM', dueMileage: odo + (10000 - (odo % 10000)), details: 'Essential to prevent cylinder head sludge & turbo wear' },
      { task: 'Brake System Safety Flush', interval: 'Every 40,000 KM', dueMileage: odo + (40000 - (odo % 40000)), details: 'Critical brake fluid boiling protection under high temperatures' },
      { task: 'Spark Plug Renewal (Denso Iridium)', interval: 'Every 100,000 KM', dueMileage: odo + (100000 - (odo % 100000)), details: 'Restores lost fuel combustion efficiency and smooth starting' },
      { task: 'Gearbox Automatic Transmission Flush', interval: 'Every 80,000 KM', dueMileage: odo + (80000 - (odo % 80000)), details: 'Prevents gear shuddering & torque-converter overheating' },
    ];

    setRemOutput(predictions);
  };

  return (
    <div id="ai-automotive-view" className="space-y-8 pb-16">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-blue-100 to-orange-100 px-3.5 py-1.5 rounded-full border border-blue-200">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700">OKILA Intelligent System</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950 mt-1">AI Automotive Center</h2>
        </div>

        {/* Sub-tabs navigator */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-stretch md:self-auto gap-1">
          {[
            { id: 'chat', label: 'AI Support Chat' },
            { id: 'diagnose', label: 'AI Symptom Diagnosis' },
            { id: 'estimate', label: 'AI Repair Estimator' },
            { id: 'reminder', label: 'AI Maintenance Tracker' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === tab.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. AI SUPPORT CHATBOX VIEW */}
      {activeSubTab === 'chat' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main chat box */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
            {/* Header banner */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 text-white flex items-center space-x-3 shrink-0">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Cpu className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-wide">OKILA AI Diagnostics Assistant</h4>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">● Online - Powered by Gemini 3.5</span>
              </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-white text-slate-800 border border-slate-100'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 text-xs flex items-center space-x-2 text-slate-500">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="text-[10px] font-bold">Diagnosing specifications...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat footer input form */}
            <form onSubmit={(e) => handleSendChat(e)} className="p-4 border-t border-slate-100 bg-white flex gap-2 shrink-0">
              <input
                id="assistant-chat-input"
                type="text"
                placeholder="Ask me about brake noise, oil service rates, or parts availability..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                id="btn-send-assistant-chat"
                type="submit"
                disabled={chatLoading}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Prompts Helper Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 h-fit">
            <h4 className="font-extrabold text-slate-950 text-sm">Common AI Inquiries</h4>
            <p className="text-xs text-slate-400">Click a sample prompt below to instantly query the diagnostics database:</p>
            <div className="flex flex-col gap-2.5">
              {[
                "My Toyota Premio makes a squealing noise when braking.",
                "Why should I choose full synthetic Castrol oil over mineral?",
                "Do you have genuine front brake pads for Toyota Premio?",
                "What is included in the KSh 18,000 Royal Ceramic Detail?",
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(undefined, prompt)}
                  className="text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 text-xs text-slate-700 font-bold transition-all line-clamp-2"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. AI VEHICLE SYMPTOM DIAGNOSIS VIEW */}
      {activeSubTab === 'diagnose' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Diagnostic form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
            <h4 className="font-extrabold text-slate-900 text-base">Vehicle Specifications</h4>
            <form onSubmit={handleDiagnose} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Make</label>
                  <input type="text" value={diagMake} onChange={e=>setDiagMake(e.target.value)} required className="w-full px-3 py-2 border rounded-lg border-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Model</label>
                  <input type="text" value={diagModel} onChange={e=>setDiagModel(e.target.value)} required className="w-full px-3 py-2 border rounded-lg border-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Year of Manufacture</label>
                <input type="text" value={diagYear} onChange={e=>setDiagYear(e.target.value)} required className="w-full px-3 py-2 border rounded-lg border-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Describe Symptom or Sound</label>
                <textarea
                  id="diagnose-symptom-text"
                  required
                  rows={4}
                  placeholder="e.g. Sharp clicking metallic sound from left front wheel when turning full lock, or warning battery light flashes on dashboard."
                  value={diagSymptom}
                  onChange={e=>setDiagSymptom(e.target.value)}
                  className="w-full p-3 border rounded-lg border-slate-200 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                id="btn-diagnose-submit"
                type="submit"
                disabled={diagLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                {diagLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Crunching Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-orange-400" />
                    <span>Submit Diagnostic Scan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Diagnostic results display */}
          <div className="lg:col-span-2 space-y-4">
            {!diagResult && !diagLoading && (
              <div className="bg-slate-50 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200 space-y-4">
                <Cpu className="w-12 h-12 text-slate-300 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-700">Awaiting Telemetry Feed</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Enter your car model and describe any squeals, rumbles, or electrical warnings on the left to activate Gemini diagnostics.</p>
                </div>
              </div>
            )}

            {diagLoading && (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Gemini Neural Assessment Active</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">Our AI is mapping mechanical failure databases, parts catalogs, and torque limits to isolate your problem...</p>
                </div>
              </div>
            )}

            {diagResult && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Gemini Diagnostic Report</h4>
                  <p className="text-xs text-slate-500 uppercase font-bold mt-1">Status: Assessed & Simulated</p>
                </div>

                {/* Causes listing */}
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400">Potential Failures Found</span>
                  <div className="space-y-3">
                    {diagResult.possibleCauses?.map((cause: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-900">{cause.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            cause.probability === 'High' ? 'bg-red-100 text-red-600' :
                            cause.probability === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {cause.probability} Probability
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{cause.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations and actions */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">Recommended Resolution</span>
                    <p className="font-bold text-slate-800">{diagResult.recommendation}</p>
                  </div>
                  {diagResult.estimatedLaborHours && (
                    <div className="mt-2 text-slate-500">
                      <span>Estimated repair time: </span>
                      <span className="font-bold text-slate-800">{diagResult.estimatedLaborHours}</span>
                    </div>
                  )}

                  <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex items-start gap-2.5 text-yellow-800 text-[10px] font-medium leading-relaxed mt-4">
                    <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p>{diagResult.disclaimer || 'Disclaimer: AI assessment is a preliminary guidance tool based on natural language symptoms. Please book a physical diagnostic hookup with our mechanics for safe physical scanning.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. AI REPAIR COST ESTIMATOR VIEW */}
      {activeSubTab === 'estimate' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
            <h4 className="font-extrabold text-slate-900 text-base">Cost Calculation</h4>
            <form onSubmit={handleEstimate} className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-500">Describe Required Repair Work</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g., Replace both front shock absorbers and stabilizer links on my Toyota Premio, and do a general oil service with Castrol oil"
                  value={estDescription}
                  onChange={e=>setEstDescription(e.target.value)}
                  className="w-full p-3 border rounded-xl border-slate-200 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={estLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 shadow"
              >
                {estLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Pricing...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 text-orange-400" />
                    <span>Get Itemized Estimate</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {!estResult && !estLoading && (
              <div className="bg-slate-50 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200 space-y-4">
                <Calculator className="w-12 h-12 text-slate-300 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-700">Awaiting Repair Parameters</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Type the mechanical adjustments or spare parts replacements you need estimated to compile an immediate price sheet in Kenya Shillings.</p>
                </div>
              </div>
            )}

            {estLoading && (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h4 className="font-bold text-slate-800">Calculating Nairobi Repair Index Rates...</h4>
              </div>
            )}

            {estResult && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Itemized Repair Quote</h4>
                  <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">Rates matched to Nairobi Automotive Standards</span>
                </div>

                <div className="space-y-2 text-xs">
                  {estResult.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 block">{item.label}</span>
                        <span className="text-[10px] text-slate-400">{item.detail}</span>
                      </div>
                      <span className="font-extrabold text-slate-950">KSh {item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Total Pricing Estimate</span>
                    <span className="text-2xl font-extrabold text-slate-950">KSh {estResult.totalEstimate?.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block italic">Time Estimate: {estResult.timeEstimate || '3 Hours'} | Confidence: {estResult.confidence || 'High'}</span>
                  </div>

                  <button
                    onClick={() => onPreFillBooking('gar-8', 'garage', estDescription, estResult.totalEstimate)}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase shadow transition-colors"
                  >
                    Instantly Book this Service
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. AI MAINTENANCE REMINDERS VIEW */}
      {activeSubTab === 'reminder' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
            <h4 className="font-extrabold text-slate-900 text-base">Predictive Reminders</h4>
            <form onSubmit={handleCalculateReminders} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Current Odometer Reading (KM)</label>
                <input
                  type="number"
                  required
                  value={remOdometer}
                  onChange={e=>setRemOdometer(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Date of Last Major Maintenance</label>
                <input
                  type="date"
                  required
                  value={remLastService}
                  onChange={e=>setRemLastService(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase shadow"
              >
                Compile Lifespan Reminders
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {!remOutput ? (
              <div className="bg-slate-50 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200 space-y-4">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-700">Predict Wear & Tear Schedules</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Enter your car’s current mileage reading and our automated estimator will compute scheduled maintenance intervals for crucial fluids and plugs.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Predictive Maintenance Forecast</h4>
                  <p className="text-xs text-slate-400 mt-1">Estimations computed based on a current reading of {Number(remOdometer).toLocaleString()} KM</p>
                </div>

                <div className="space-y-3 text-xs">
                  {remOutput.map((rem: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 block text-xs">{rem.task}</span>
                        <p className="text-xs text-slate-500 leading-relaxed">{rem.details}</p>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">{rem.interval}</span>
                      </div>
                      <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 shrink-0 text-center sm:text-right min-w-[120px]">
                        <span className="text-[9px] uppercase font-bold text-orange-500 block">Due Mileage</span>
                        <span className="font-extrabold text-slate-900 text-xs">{rem.dueMileage.toLocaleString()} KM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
