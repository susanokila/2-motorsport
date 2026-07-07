import { Product, GarageService, CarWashPackage, BlogPost, Review } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Brembo Ceramic Brake Pads (Front)',
    description: 'High-performance, low-dust front brake pads designed for premium braking efficiency and quiet operation. Fits Toyota Camry, RAV4, and Premio.',
    price: 6500,
    category: 'Brakes',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    compatibility: ['Toyota Camry', 'Toyota RAV4', 'Toyota Premio', 'Toyota Axio'],
    partNumber: 'BRM-77402'
  },
  {
    id: 'prod-2',
    name: 'Castrol EDGE 5W-30 Full Synthetic Motor Oil (4L)',
    description: 'Advanced full synthetic engine oil engineered with Fluid Titanium technology. Provides superior engine wear protection under extreme driving conditions.',
    price: 5200,
    category: 'Filters & Fluids',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1635848602276-db9f6f4336c8?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    compatibility: ['Subaru Impreza', 'Toyota Land Cruiser', 'Mitsubishi Outlander', 'Nissan X-Trail', 'Honda Civic'],
    partNumber: 'CST-5W30-4L'
  },
  {
    id: 'prod-3',
    name: 'KYB Excel-G Gas Shock Absorber',
    description: 'Twin-tube gas shock absorber designed to restore original vehicle handling, comfort, and steering control. Sold individually.',
    price: 8500,
    category: 'Suspension & Steering',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=600&auto=format&fit=crop',
    rating: 4.6,
    compatibility: ['Toyota Premio', 'Toyota Fielder', 'Toyota Axio', 'Nissan Sylphy'],
    partNumber: 'KYB-341307'
  },
  {
    id: 'prod-4',
    name: 'Bosch S4 Maintenance-Free Battery (12V 65AH)',
    description: 'Long-life car battery with patented powerframe grid technology for maximum starting power, fast rechargeability, and high corrosion resistance.',
    price: 11500,
    category: 'Electrical & Batteries',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    compatibility: ['Mazda CX-5', 'Subaru Forester', 'Toyota Vanguard', 'Honda CR-V'],
    partNumber: 'BSH-S465AH'
  },
  {
    id: 'prod-5',
    name: 'Michelin Pilot Sport 4S Tyre (225/45 R17)',
    description: 'Ultra-high performance passenger car tyre offering superb braking performance on wet and dry pavement, coupled with long tread life.',
    price: 18500,
    category: 'Tyres & Wheels',
    stock: 16,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    compatibility: ['Subaru Legacy', 'Toyota Mark X', 'Volkswagen Golf', 'Mercedes Benz C-Class'],
    partNumber: 'MCH-PS4S-17'
  },
  {
    id: 'prod-6',
    name: 'K&N High-Flow Drop-In Air Filter',
    description: 'Washable and reusable lifetime air filter. Designed to increase horsepower and acceleration while providing exceptional engine filtration.',
    price: 7800,
    category: 'Filters & Fluids',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    compatibility: ['Toyota Land Cruiser Prado', 'Subaru Forester', 'Mitsubishi Pajero', 'Toyota Hilux'],
    partNumber: 'KN-332030'
  },
  {
    id: 'prod-7',
    name: 'Denso Iridium Tough Spark Plugs (Set of 4)',
    description: 'High-end iridium spark plugs providing highly efficient combustion, better fuel economy, and outstanding acceleration response.',
    price: 4800,
    category: 'Engine Parts',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    compatibility: ['Toyota Vitz', 'Honda Fit', 'Nissan Note', 'Mazda Demio', 'Toyota Axio'],
    partNumber: 'DEN-IR-TOUGH'
  },
  {
    id: 'prod-8',
    name: 'Meguiars Ultimate Gold Class Car Wash Foam (1.8L)',
    description: 'Rich and luxurious car wash designed to both clean and condition paint in one easy step. Contains premium paint conditioning agents.',
    price: 3200,
    category: 'Accessories & Care',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=600&auto=format&fit=crop',
    rating: 4.5,
    compatibility: ['All Vehicles'],
    partNumber: 'MEG-GOLD-01'
  }
];

export const INITIAL_GARAGE_SERVICES: GarageService[] = [
  {
    id: 'gar-1',
    name: 'Engine Diagnostics & Tuning',
    description: 'Full ECU scanning, diagnostic error code analysis, sensor testing, and expert engine performance tuning.',
    price: 4500,
    category: 'Electrical & Diagnostics',
    duration: '1.5 Hours'
  },
  {
    id: 'gar-2',
    name: 'Premium Wheel Alignment & Balancing',
    description: '3D laser wheel alignment for front and rear axles, dynamic wheel balancing, suspension health check, and tyre pressure calibration.',
    price: 3500,
    category: 'Suspension & Steering',
    duration: '1 Hour'
  },
  {
    id: 'gar-3',
    name: 'Synthetic Oil Change & General Service',
    description: 'Replacement of engine oil with high-grade Castrol synthetic oil, premium oil filter change, fluid top-ups (coolant, brake fluid, wiper fluid), and 25-point safety check.',
    price: 6500,
    category: 'Filters & Fluids',
    duration: '45 Mins'
  },
  {
    id: 'gar-4',
    name: 'Brake Pad & Disc Replacement',
    description: 'Fitting of ceramic brake pads, cleaning of brake callipers, lubrication of guide pins, brake fluid bleeding, and thorough system safety check.',
    price: 4000,
    category: 'Brakes',
    duration: '1.5 Hours'
  },
  {
    id: 'gar-5',
    name: 'Suspension Overhaul & Repair',
    description: 'Replacement of shock absorbers, control arms, ball joints, stabilizers, and bushes to restore factory-smooth suspension handling.',
    price: 12000,
    category: 'Suspension & Steering',
    duration: '4 Hours'
  },
  {
    id: 'gar-6',
    name: 'AC Recharge & Leak Diagnostics',
    description: 'Refrigerant pressure leak detection, system evacuation, replenishing compressor oil, and fresh R134a gas recharging.',
    price: 4500,
    category: 'Air Conditioning',
    duration: '1 Hour'
  },
  {
    id: 'gar-7',
    name: 'Automatic Transmission Flush & Service',
    description: 'Draining transmission fluid, flushing the system of metallic shavings, renewing transmission filter and sealing gasket, and refilling with premium ATF.',
    price: 15000,
    category: 'Transmission',
    duration: '2.5 Hours'
  },
  {
    id: 'gar-8',
    name: 'Full Vehicle Multipoint Inspection',
    description: 'Comprehensive diagnostic audit of engine, gearbox, electricals, suspension, brakes, tyres, and structural safety. Recommended before purchasing pre-owned cars.',
    price: 2500,
    category: 'Diagnostics',
    duration: '1 Hour'
  }
];

export const INITIAL_CAR_WASH_PACKAGES: CarWashPackage[] = [
  {
    id: 'wash-1',
    name: 'Express Eco Wash',
    description: 'Quick exterior clean. Perfect for vehicles that need a fast refresh.',
    price: 600,
    duration: '20 Mins',
    features: [
      'High-pressure pre-wash',
      'pH-neutral foaming body wash',
      'Microfiber hand dry',
      'Tyre cleaning and shine',
      'Door mudguards cleaning'
    ]
  },
  {
    id: 'wash-2',
    name: 'Premium OKILA Wash',
    description: 'Complete inside-and-out detailing. Highly recommended for daily drivers.',
    price: 1500,
    duration: '45 Mins',
    features: [
      'Everything in Express Eco Wash',
      'Full interior upholstery vacuuming',
      'Dashboard & door trim wiping',
      'AC vents dust extraction',
      'Boot vacuum & clean',
      'Engine compartment surface wipe-down',
      'Liquid spray wax protective coating'
    ]
  },
  {
    id: 'wash-3',
    name: 'Steam Interior Detailing & Sanitization',
    description: 'Deep sanitary steam extraction for vehicle upholstery, removing deep stains, bacteria, and persistent odours.',
    price: 6500,
    duration: '2 Hours',
    features: [
      'Full seats deep steam cleaning',
      'Stain extraction from carpets and ceiling',
      'Leather conditioning / Fabric treatment',
      'Anti-bacterial AC duct steaming',
      'Ozone deodorizer treatment',
      'All interior panels scrubbed & polished'
    ]
  },
  {
    id: 'wash-4',
    name: 'OKILA Royal Ceramic Detail',
    description: 'Ultra-premium vehicle detailing with high-gloss machine polishing and protective ceramic sealant.',
    price: 18000,
    duration: '6 Hours',
    features: [
      'Multi-stage paint correction & swirl removal',
      '9H Ceramic liquid wax application',
      'Chassis deep pressure cleaning',
      'Engine bay thorough chemical detail',
      'Glass water-repellent protective layer',
      'Alloy wheel de-ironing and polishing',
      'Premium leather wax finishing'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'David Ndolo',
    rating: 5,
    comment: 'The OKILA Motorsport team is top-tier! They solved a mysterious suspension rattle on my Subaru Forester that other garages failed to diagnose twice. Fair price and very fast service.',
    date: '2026-06-25',
    category: 'garage'
  },
  {
    id: 'rev-2',
    name: 'Sarah Wangari',
    rating: 5,
    comment: 'Brought my Toyota Axio for the Royal Ceramic Detail. The car looks cleaner than it did in the showroom! The gloss finish is amazing and the rain beads right off.',
    date: '2026-07-02',
    category: 'carwash'
  },
  {
    id: 'rev-3',
    name: 'Emmanuel Kiprop',
    rating: 4,
    comment: 'Purchased front brake pads and spark plugs here. Very authentic Bosch and Denso parts, not like the cheap fakes common in downtown stores. Stock was available immediately.',
    date: '2026-06-18',
    category: 'parts'
  },
  {
    id: 'rev-4',
    name: 'Grace Mutua',
    rating: 5,
    comment: 'Using their AI diagnostics assistant before booking was awesome! It correctly guessed my clicking noise was a CV joint. Booked online, mechanic confirmed it, and changed it in 2 hours.',
    date: '2026-07-05',
    category: 'general'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: '5 Warning Signs Your Brake Pads Need Immediate Replacement',
    content: `Your car's brakes are the single most critical safety feature. Recognizing warning signs before complete brake failure can save you thousands of shillings and keep you safe on the highway.\n\n### 1. High-Pitch Squealing Noises\nIf you hear a sharp squeal when applying the brakes, this is often the brake pad wear indicator—a small metal tab scraping against the disc rotor to warn you that the friction material is running thin.\n\n### 2. Spongy or Soft Brake Pedal\nIf the brake pedal feels mushy or pushes all the way to the floorboard, this is a major indicator of air bubbles in your brake lines, low brake fluid, or a failing master brake cylinder. Do not drive until inspected!\n\n### 3. Vibration or Shuddering Under Braking\nFeeling a rhythmic vibration in your steering wheel or brake pedal suggests warped brake rotors (discs). High temperatures caused by intense braking can warp the metal, requiring the discs to be skimmed or fully replaced.\n\n### 4. Vehicle Pulling to One Side\nIf the car veers to the left or right while braking, you might have a stuck brake caliper, collapsed brake hose, or uneven pad wear.\n\n### 5. Metal-on-Metal Grinding\nIf the squeal turns into a deep, harsh grinding sound, the friction material is completely worn out. The steel backing of your brake pad is now directly crushing the brake rotor. This destroys rotors instantly and severely reduces stopping power. Replace pads immediately!`,
    date: '2026-06-12',
    category: 'Car Maintenance',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
    author: 'Eng. Francis Okila',
    readTime: '4 Min Read'
  },
  {
    id: 'post-2',
    title: 'Why Premium Engine Oil is Worth Every Shilling',
    content: `We often get asked: "Can I just use the cheapest oil for my engine?" The short answer is yes—if you want your engine to expire years ahead of schedule. Premium synthetic oils play a vital role in engine longevity.\n\n### Full Synthetic vs. Mineral Oil\nMineral oil is simply refined crude oil. Full synthetic oils like Castrol EDGE or Mobil 1 are synthesized chemically to create uniform molecular structures. This provides:\n- **Superior Thermal Stability:** Synthetic oil won't break down or turn to sludge under high turbo-charger heat.\n- **Excellent Cold Flow:** Flows instantly to overhead camshafts upon cold starting—when 75% of engine wear occurs.\n- **Sustained Viscosity:** Keeps its lubricating thickness longer, allowing 10,000 km drain intervals instead of 5,000 km.\n\nAt OKILA Motorsport, we match the exact viscosity specifications required by your manufacturer (e.g., 0W-20, 5W-30) to preserve fuel economy and seal piston rings. Investing in good oil saves you from costly engine rebuilding!`,
    date: '2026-06-28',
    category: 'Vehicle Care',
    image: 'https://images.unsplash.com/photo-1635848602276-db9f6f4336c8?q=80&w=600&auto=format&fit=crop',
    author: 'Samson Kiptoo (Lead Tuner)',
    readTime: '5 Min Read'
  },
  {
    id: 'post-3',
    title: 'Ceramic Coatings vs. Traditional Wax: The Ultimate Guide',
    content: `When cleaning your car, protection is key to safeguarding its resale value. Let's compare traditional carnauba waxes against modern liquid ceramic (nano-SiO2) coatings.\n\n### Traditional Carnauba Wax\n- **Pros:** Low cost, rich warm wet-look shine, easy hand application.\n- **Cons:** Melts under direct tropical sun, washed away after 3-4 basic washes, offers minimal protection against minor scratches.\n\n### Ceramic Coating Protection\n- **Chemical Bonding:** Unlike wax which sits on top of paint, ceramic coatings bond chemically with the clear coat to create a semi-permanent hard crystalline shield.\n- **Hydrophobic Bead Effect:** Repels rain, dirt, and mud instantly. Washing the car becomes a 5-minute breeze because dust can't stick.\n- **UV Protection:** Guards against paint oxidation, fading, and yellowing from Kenya's intense equatorial sun.\n- **Longevity:** A single multi-stage ceramic coat lasts 12 to 24 months, whereas wax lasts only 4 weeks.\n\nOur OKILA Royal Ceramic Detail provides professional high-gloss paint correction prior to applying 9H nano coatings. Your car stays looking showroom-fresh for years!`,
    date: '2026-07-04',
    category: 'Car Wash',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=600&auto=format&fit=crop',
    author: 'Derrick Aluda (Detailing Specialist)',
    readTime: '3 Min Read'
  }
];
