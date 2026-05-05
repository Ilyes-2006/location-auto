// ─── Dashboard ──────────────────────────────────────────────────────────────
export const dashboardMetrics = {
  totalRevenue: { value: '€142,380', change: '+12.4%', positive: true, label: 'Total Revenue (30d)', sub: 'vs. previous 30 days' },
  activeBookings: { value: '38', change: '+5', positive: true, label: 'Active Bookings', sub: 'Currently on-road' },
  maintenanceAlerts: { value: '4', change: '', positive: false, label: 'Maintenance Alerts', sub: 'Requires immediate attention' },
  utilizationRate: { value: '87%', change: '+3.1%', positive: true, label: 'Fleet Utilization', sub: 'Fleet efficiency this month' },
};

export const recentActivity = [
  { id: 'ACT-1', title: 'Booking #4092 completed successfully.', time: '10 mins ago', sub: 'S-Class Sedan', icon: 'check', color: 'teal' },
  { id: 'ACT-2', title: 'New Reservation created by Admin.', time: '45 mins ago', sub: 'G-Wagon', icon: 'calendar', color: 'info' },
  { id: 'ACT-3', title: 'Maintenance Logged for Vehicle ID 882.', time: '2 hours ago', sub: 'Tire Replacement', icon: 'wrench', color: 'warning' },
  { id: 'ACT-4', title: 'Booking #4091 completed successfully.', time: '5 hours ago', sub: 'Model S', icon: 'check', color: 'teal' },
  { id: 'ACT-5', title: 'New customer verified: Sarah Jenkins.', time: '6 hours ago', sub: 'CLI-9012', icon: 'user', color: 'info' },
];

export const utilizationData = [
  { day: 'Mon', value: 82 },
  { day: 'Tue', value: 91 },
  { day: 'Wed', value: 78 },
  { day: 'Thu', value: 95 },
  { day: 'Fri', value: 88 },
  { day: 'Sat', value: 72 },
  { day: 'Sun', value: 65 },
];

// ─── Fleet Inventory ─────────────────────────────────────────────────────────
export const fleetVehicles = [
  { id: 'VEH-001', name: 'Mercedes-Benz S-Class', vin: 'WDB2220561A...8F92A', year: 2023, color: 'Obsidian Black', status: 'available', location: 'Paris CDG', fuel: 92, mileage: 14820, dailyRate: 320, lastService: '2026-04-01' },
  { id: 'VEH-002', name: 'BMW X7 M60i', vin: '5UXCW2C04N9...3C44B', year: 2024, color: 'Alpine White', status: 'rented', location: 'Lyon Centre', fuel: 41, mileage: 8340, dailyRate: 280, lastService: '2026-03-15' },
  { id: 'VEH-003', name: 'Tesla Model S Plaid', vin: '5YJSA1E26MF...9E11T', year: 2024, color: 'Midnight Silver', status: 'available', location: 'Paris CDG', fuel: 78, mileage: 6120, dailyRate: 250, lastService: '2026-04-20' },
  { id: 'VEH-004', name: 'Audi RS6 Avant', vin: 'WAUZZZ4G0MN...2A77R', year: 2023, color: 'Nardo Grey', status: 'maintenance', location: 'Workshop A', fuel: 15, mileage: 22400, dailyRate: 290, lastService: '2026-02-28' },
  { id: 'VEH-005', name: 'Range Rover SVR', vin: 'SALWA2BK4MA...6B01P', year: 2023, color: 'Santorini Black', status: 'available', location: 'Marseille', fuel: 68, mileage: 19870, dailyRate: 340, lastService: '2026-03-30' },
  { id: 'VEH-006', name: 'Porsche Cayenne Turbo', vin: 'WP1ZZZ9YZNL...5K33M', year: 2024, color: 'GT Silver', status: 'rented', location: 'Nice Airport', fuel: 55, mileage: 11200, dailyRate: 360, lastService: '2026-04-10' },
];

// ─── Car Catalog ─────────────────────────────────────────────────────────────
export const catalogCars = [
  {
    id: 'CAT-001',
    name: 'Tesla Model 3',
    category: 'Electric Sedan',
    seats: 5,
    transmission: 'Auto',
    range: '570 km',
    dailyRate: 180,
    rating: 4.9,
    reviewCount: 142,
    available: true,
    features: ['Autopilot', 'Panoramic Roof', 'Premium Sound', 'Supercharger Access'],
    imgColor: '#1e293b',
  },
  {
    id: 'CAT-002',
    name: 'Range Rover Sport',
    category: 'Luxury SUV',
    seats: 7,
    transmission: 'Auto',
    range: '—',
    dailyRate: 340,
    rating: 4.8,
    reviewCount: 97,
    available: true,
    features: ['4x4 Terrain Response', 'Meridian Sound', 'Head-Up Display', 'Air Suspension'],
    imgColor: '#0f172a',
  },
  {
    id: 'CAT-003',
    name: 'BMW 5 Series',
    category: 'Executive Sedan',
    seats: 5,
    transmission: 'Auto',
    range: '—',
    dailyRate: 220,
    rating: 4.7,
    reviewCount: 211,
    available: false,
    features: ['xDrive AWD', 'Driving Assistant Pro', 'Leather Interior', 'HiFi Sound'],
    imgColor: '#334155',
  },
  {
    id: 'CAT-004',
    name: 'Mercedes-Benz G-Wagon',
    category: 'Luxury Off-Road',
    seats: 5,
    transmission: 'Auto',
    range: '—',
    dailyRate: 420,
    rating: 5.0,
    reviewCount: 56,
    available: true,
    features: ['AMG Package', '3 Differential Locks', 'Burmester Sound', 'Night Vision'],
    imgColor: '#1e3a8a',
  },
];

// ─── Customers ───────────────────────────────────────────────────────────────
export const customers = [
  { id: 'CLI-8839', name: 'Eleanor Ashton', email: 'e.ashton@velox.io', phone: '+33 6 12 34 56 78', verified: true, rentals: 7, spent: '€4,820', joinDate: '2024-03-12', lastRental: 'S-Class Sedan', status: 'active' },
  { id: 'CLI-7421', name: 'Marcus Reyes', email: 'mreyes@corp.fr', phone: '+33 6 98 76 54 32', verified: true, rentals: 3, spent: '€1,260', joinDate: '2025-01-08', lastRental: 'BMW X7', status: 'active' },
  { id: 'CLI-9012', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', phone: '+33 6 45 67 89 01', verified: false, rentals: 1, spent: '€540', joinDate: '2026-02-14', lastRental: 'Tesla Model S', status: 'pending' },
  { id: 'CLI-1104', name: 'David Thompson', email: 'd.thompson@luxura.com', phone: '+33 6 23 45 67 89', verified: true, rentals: 12, spent: '€9,480', joinDate: '2023-11-20', lastRental: 'Range Rover SVR', status: 'active' },
  { id: 'CLI-3302', name: 'Isabelle Martin', email: 'isabelle.m@agence.fr', phone: '+33 6 78 90 12 34', verified: true, rentals: 5, spent: '€3,100', joinDate: '2024-07-30', lastRental: 'Porsche Cayenne', status: 'active' },
];

export const customerStats = {
  total: '1,248',
  verified: '89%',
  avgRentals: '4.2',
  pendingReviews: '12',
};
