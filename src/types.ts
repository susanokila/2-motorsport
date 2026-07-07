export interface Vehicle {
  make: string;
  model: string;
  year: number;
  regNo: string;
  vin?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'mechanic' | 'admin' | 'staff';
  savedVehicles: Vehicle[];
  savedAddresses: string[];
  loyaltyPoints: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  rating: number;
  compatibility: string[]; // compatible vehicle models
  partNumber: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface GarageService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  duration: string; // e.g. "1.5 hours"
}

export interface CarWashPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
}

export interface JobCard {
  id: string;
  bookingId: string;
  mechanicName: string;
  diagnosticsResults: string;
  tasksPerformed: string[];
  partsUsed: { partId: string; name: string; quantity: number; price: number }[];
  laborCharges: number;
  totalCost: number;
  serviceReport: string;
  completedDate?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  vehicle: Vehicle;
  serviceType: 'garage' | 'car_wash';
  serviceId: string; // references GarageService or CarWashPackage
  serviceName: string;
  date: string;
  time: string;
  mechanicId?: string;
  mechanicName?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentMethod: 'card' | 'mpesa' | 'bank' | 'cash';
  paymentStatus: 'pending' | 'paid';
  totalAmount: number;
  notes?: string;
  jobCard?: JobCard;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'card' | 'mpesa' | 'bank' | 'cash';
  paymentStatus: 'pending' | 'paid';
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  shippingAddress: string;
  date: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  category: 'general' | 'parts' | 'garage' | 'carwash';
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
}

export interface DashboardStats {
  totalSales: number;
  totalBookingsCount: number;
  activeBookingsCount: number;
  lowStockItemsCount: number;
  salesByMonth: { month: string; sales: number }[];
  popularServices: { name: string; bookings: number }[];
  topProducts: { name: string; sold: number }[];
  bookingStatusBreakdown: { status: string; count: number }[];
}
