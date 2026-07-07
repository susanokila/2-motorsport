import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory database
import {
  INITIAL_PRODUCTS,
  INITIAL_GARAGE_SERVICES,
  INITIAL_CAR_WASH_PACKAGES,
  INITIAL_REVIEWS,
  INITIAL_BLOG_POSTS
} from './src/preseededData.js';

let products = [...INITIAL_PRODUCTS];
let garageServices = [...INITIAL_GARAGE_SERVICES];
let carWashPackages = [...INITIAL_CAR_WASH_PACKAGES];
let reviews = [...INITIAL_REVIEWS];
let blogs = [...INITIAL_BLOG_POSTS];

let bookings: any[] = [
  {
    id: 'book-1',
    customerId: 'cust-1',
    customerName: 'Suzie Lizbel',
    customerEmail: 'suzielizbel@gmail.com',
    vehicle: { make: 'Toyota', model: 'Premio', year: 2016, regNo: 'KCD 123X', vin: 'AT260-104928' },
    serviceType: 'garage',
    serviceId: 'gar-3',
    serviceName: 'Synthetic Oil Change & General Service',
    date: '2026-07-10',
    time: '10:00 AM',
    mechanicId: 'mech-1',
    mechanicName: 'Peter Kamau',
    status: 'confirmed',
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    totalAmount: 6500,
    notes: 'Please check the rear brakes as well.'
  },
  {
    id: 'book-2',
    customerId: 'cust-1',
    customerName: 'Suzie Lizbel',
    customerEmail: 'suzielizbel@gmail.com',
    vehicle: { make: 'Toyota', model: 'Premio', year: 2016, regNo: 'KCD 123X', vin: 'AT260-104928' },
    serviceType: 'car_wash',
    serviceId: 'wash-2',
    serviceName: 'Premium OKILA Wash',
    date: '2026-07-05',
    time: '02:30 PM',
    status: 'completed',
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    totalAmount: 1500,
    jobCard: {
      id: 'job-2',
      bookingId: 'book-2',
      mechanicName: 'Wash Bay Team',
      diagnosticsResults: 'Cleaned interior and exterior detailing',
      tasksPerformed: ['Foaming body wash', 'Upholstery vacuuming', 'Engine compartment wipe down', 'Liquid spray wax'],
      partsUsed: [],
      laborCharges: 1500,
      totalCost: 1500,
      serviceReport: 'Vehicle was thoroughly detailed inside and out. Dust extracted from all cabin vents, spray wax finish applied to body.',
      completedDate: '2026-07-05'
    }
  }
];

let orders: any[] = [
  {
    id: 'ord-1001',
    customerId: 'cust-1',
    customerName: 'Suzie Lizbel',
    customerEmail: 'suzielizbel@gmail.com',
    items: [
      {
        productId: 'prod-1',
        productName: 'Brembo Ceramic Brake Pads (Front)',
        quantity: 1,
        price: 6500,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop'
      }
    ],
    totalAmount: 6500,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    status: 'processing',
    trackingNumber: 'OKL-TRK-749283',
    shippingAddress: 'Nairobi, Kilimani Road, Apt 4B',
    date: '2026-07-06'
  }
];

let contactMessages: any[] = [];

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. AI features will fallback to rule-based responses.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const ai = getGeminiClient();

// API Endpoints

// Products API
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: `prod-${Date.now()}`,
    ...req.body,
    rating: req.body.rating || 5.0,
    stock: Number(req.body.stock) || 0,
    price: Number(req.body.price) || 0
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Services API
app.get('/api/services', (req, res) => {
  res.json(garageServices);
});

app.get('/api/wash-packages', (req, res) => {
  res.json(carWashPackages);
});

// Reviews API
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const newReview = {
    id: `rev-${Date.now()}`,
    name: req.body.name || 'Anonymous Customer',
    rating: Number(req.body.rating) || 5,
    comment: req.body.comment || '',
    date: new Date().toISOString().split('T')[0],
    category: req.body.category || 'general'
  };
  reviews.unshift(newReview);
  res.status(201).json(newReview);
});

// Contact messages API
app.post('/api/contact', (req, res) => {
  const message = {
    id: `msg-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject || 'General Inquiry',
    message: req.body.message,
    date: new Date().toISOString().split('T')[0],
    status: 'unread'
  };
  contactMessages.push(message);
  res.status(201).json({ success: true, message: 'Message sent successfully!' });
});

app.get('/api/contact', (req, res) => {
  res.json(contactMessages);
});

// Bookings API
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: `book-${Date.now()}`,
    ...req.body,
    status: 'pending',
    paymentStatus: req.body.paymentMethod === 'mpesa' || req.body.paymentMethod === 'card' ? 'paid' : 'pending',
  };
  bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...req.body };
    res.json(bookings[index]);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'processing',
    trackingNumber: `OKL-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().split('T')[0]
  };

  // Adjust stock
  newOrder.items.forEach((item: any) => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  });

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// Blogs API
app.get('/api/blogs', (req, res) => {
  res.json(blogs);
});

// --- AI Service Endpoints using @google/genai ---

// 1. General AI Customer Assistant / Chatbot
app.post('/api/chat', async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `
    You are the OKILA Motorsport AI Customer Assistant. Your tone is professional, helpful, welcoming, and knowledgeable about automobiles.
    Our shop: "OKILA Motorsport" based in Nairobi, Kenya. We provide:
    1. Premium Auto Spares (Engine parts, Brakes, Suspension, Filters, Batteries, Fluids, Tyres).
    2. Professional Garage Services (ECU Diagnostics, Wheel alignment, Engine overhaul, General synthetic oil service, AC service).
    3. Car Wash Detailing (Express wash, Premium interior detaliing, Steam sterilization, Royal 9H Ceramic coating).

    Your responsibilities:
    - Answer customer queries about cars, pricing, maintenance, and diagnostics.
    - Recommend our specific preseeded products and services whenever possible.
    - Guide them on booking appointments or purchasing parts.
    - Maintain a humble, professional, and friendly attitude.
    - Keep answers relatively concise and highly structured.
    - If asked for diagnostic advice, give a preliminary, friendly assessment, but always add a professional disclaimer that a physical inspection is recommended.

    Available Products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, stock: p.stock })))}
    Available Garage Services: ${JSON.stringify(garageServices.map(s => ({ id: s.id, name: s.name, price: s.price })))}
    Available Wash Packages: ${JSON.stringify(carWashPackages.map(w => ({ id: w.id, name: w.name, price: w.price })))}
  `;

  if (!ai) {
    // Fallback if API key is not present
    return res.json({
      text: getFallbackChatResponse(message),
      isFallback: true
    });
  }

  try {
    const formattedHistory = (chatHistory || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current prompt
    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: `${systemInstruction}\n\nCustomer: ${message}` }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.json({
      text: "I apologize, but I am having trouble connecting to my diagnostic servers right now. Let me provide a helpful answer based on our standards: " + getFallbackChatResponse(message),
      isFallback: true
    });
  }
});

// 2. AI Spare Parts Smart Search / Natural Language Search
app.post('/api/ai-search', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (!ai) {
    // Basic fuzzy keyword search fallback
    const matched = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    return res.json({ matched, reason: "Traditional match based on product tags." });
  }

  try {
    const prompt = `
      You are the OKILA Motorsport Spare Parts Matcher.
      The user search query is: "${query}"
      Below is our current spares inventory catalog:
      ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, description: p.description, compatibility: p.compatibility })))}

      Select the IDs of products from the catalog that match or are highly relevant to the query. 
      Also, write a 1-2 sentence friendly explanation of why these match and if they are compatible.
      Return your response strictly in JSON format as follows:
      {
        "matchedIds": ["prod-1", "prod-2"],
        "explanation": "Here is why these are perfect for you..."
      }
      Do not write any markdown blocks besides the pure JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const matched = products.filter(p => (parsed.matchedIds || []).includes(p.id));
    
    res.json({
      matched: matched.length > 0 ? matched : products.slice(0, 3), // default to some if none matches
      reason: parsed.explanation || "AI-assisted semantic matches based on your specifications."
    });
  } catch (error) {
    console.error("Gemini API Error in /api/ai-search:", error);
    // Fallback
    const matched = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    res.json({ matched, reason: "Direct text alignment matches due to server load." });
  }
});

// 3. AI Vehicle Smart Diagnosis
app.post('/api/ai-diagnose', async (req, res) => {
  const { symptom, make, model, year } = req.body;

  if (!symptom) {
    return res.status(400).json({ error: 'Symptom description is required' });
  }

  const carInfo = `${year || ''} ${make || ''} ${model || ''}`.trim() || 'vehicle';

  if (!ai) {
    return res.json({
      possibleCauses: [
        { title: "Battery / Alternator weakness", probability: "High", explanation: "Often a car with starter/electrical glitches needs a quick battery or alternator check." },
        { title: "Worn brake components", probability: "Medium", explanation: "Squeals and grinding indicate it is time to inspect front pads." }
      ],
      recommendation: "Book our 'Full Vehicle Multipoint Inspection' or 'Engine Diagnostics & Tuning' service so our expert mechanics can hook up OBD scanners.",
      disclaimer: "Disclaimer: This is a preliminary computer assessment. Please book a physical inspection."
    });
  }

  try {
    const prompt = `
      You are the OKILA Motorsport Chief Mechanic AI Diagnostician.
      A customer reports this issue with their ${carInfo}:
      Symptom: "${symptom}"

      Based on this symptom and vehicle model, return a professional diagnostics assessment in JSON format:
      {
        "possibleCauses": [
          {
            "title": "Short title of cause",
            "probability": "High" | "Medium" | "Low",
            "explanation": "Brief mechanical explanation of what might be failing and why."
          }
        ],
        "recommendation": "Which of our service packages (e.g., 'Engine Diagnostics & Tuning' or 'Brake Pad & Disc Replacement' or 'Full Vehicle Multipoint Inspection') they should book, with price estimate.",
        "estimatedLaborHours": "e.g. 1-2 hours"
      }
      Do not write any markdown blocks besides the pure JSON. Include a disclaimer as a separate key "disclaimer".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error("Gemini API Error in /api/ai-diagnose:", error);
    res.json({
      possibleCauses: [
        { title: "System Overload / General Glitch", probability: "High", explanation: "The symptoms could indicate normal wear and tear." }
      ],
      recommendation: "Book a General Service (KSh 6,500) so our team can perform physical diagnostics.",
      disclaimer: "Disclaimer: Preliminary remote computer calculation only. Real test required."
    });
  }
});

// 4. AI Cost Estimator
app.post('/api/ai-estimate', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!ai) {
    return res.json({
      items: [
        { label: "Estimated Spare Parts", cost: 8500, detail: "Standard replacement parts" },
        { label: "Labor and Calibration", cost: 3000, detail: "OKILA mechanics standard hourly rate" }
      ],
      totalEstimate: 11500,
      timeEstimate: "2 Hours",
      confidence: "Medium"
    });
  }

  try {
    const prompt = `
      You are the OKILA Motorsport Service Pricing Estimator.
      A customer is asking for a repair cost estimate for: "${description}"

      Provide an itemized repair cost breakdown in Kenya Shillings (Ksh) based on common repair rates in Nairobi.
      Return your response strictly in JSON format as follows:
      {
        "items": [
          { "label": "e.g. Front Suspension Shocks (KYB)", "cost": 17000, "detail": "Replacement parts cost estimate" },
          { "label": "e.g. Wheel alignment and mounting labor", "cost": 3500, "detail": "Labor and safety calibrations" }
        ],
        "totalEstimate": 20500,
        "timeEstimate": "e.g. 3 Hours",
        "confidence": "High" | "Medium" | "Low"
      }
      Do not write any markdown blocks besides the pure JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error("Gemini API Error in /api/ai-estimate:", error);
    res.json({
      items: [
        { label: "Estimated service cost", cost: 5000, detail: "Generic repair estimate" }
      ],
      totalEstimate: 5000,
      timeEstimate: "1.5 Hours",
      confidence: "Low"
    });
  }
});

// Fallback rule-based responses for Chatbot
function getFallbackChatResponse(message: string): string {
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes('squeal') || lowercaseMsg.includes('noise') || lowercaseMsg.includes('brake') || lowercaseMsg.includes('stop')) {
    return "This sounds like worn brake pads or warped rotors. Brembo Ceramic Brake Pads are available in our Spares Store (KSh 6,500). I highly recommend booking our 'Brake Pad & Disc Replacement' service (KSh 4,000) for a secure fitment and road test.";
  }
  if (lowercaseMsg.includes('oil') || lowercaseMsg.includes('service') || lowercaseMsg.includes('maintain')) {
    return "Our 'Synthetic Oil Change & General Service' costs KSh 6,500 and includes Castrol 5W-30 premium oil, oil filter replacement, fluid top-ups, and a 25-point safety inspection. It takes about 45 minutes. Would you like to book this appointment?";
  }
  if (lowercaseMsg.includes('ceramic') || lowercaseMsg.includes('paint') || lowercaseMsg.includes('shine') || lowercaseMsg.includes('wash')) {
    return "For ultimate shine and paint protection under the Kenyan sun, we offer the 'OKILA Royal Ceramic Detail' (KSh 18,000) which includes multi-stage paint correction and 9H premium liquid ceramic coating. For regular washing, our 'Premium OKILA Wash' is KSh 1,500 and includes complete interior vacuuming.";
  }
  if (lowercaseMsg.includes('battery') || lowercaseMsg.includes('start') || lowercaseMsg.includes('click')) {
    return "Starting or clicking issues are usually caused by a weak battery. We have the maintenance-free Bosch S4 65AH Battery in stock for KSh 11,500. We can also run an electrical diagnostic for KSh 4,500. Let me know if you would like to book a slots!";
  }
  if (lowercaseMsg.includes('align') || lowercaseMsg.includes('tire') || lowercaseMsg.includes('steering')) {
    return "We offer 3D laser Wheel Alignment & Balancing for KSh 3,500 (takes about 1 hour). This corrects steering wheel drift and prevents uneven tyre wear. We also have Michelin Pilot Sport 4S tyres in stock!";
  }
  
  return "Hello! I am your OKILA Motorsport AI assistant. I can help you find premium spare parts (like Brembo brakes or Castrol synthetic oils), recommend professional garage/car-wash packages, diagnose vehicle symptoms, or help you book an appointment. What vehicle do you drive today?";
}

// Serve Frontend static assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other routes to index.html for SPA router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OKILA Motorsport fullstack server running on port ${PORT}`);
});
