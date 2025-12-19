// Demo data for the construction company app

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  dateAdded: string;
  notes: string;
  financialRecords: FinancialRecord[];
  resourceUsage: ResourceUsage[];
}

export interface FinancialRecord {
  id: string;
  date: string;
  amount: number;
  type: 'Received' | 'Due';
  notes: string;
  attachment?: string;
}

export interface ResourceUsage {
  id: string;
  resourceType: string;
  quantity: number;
  price: number;
  notes: string;
}

export interface Labour {
  id: string;
  name: string;
  phone: string;
  address: string;
  dateJoined: string;
  status: 'Active' | 'Inactive';
  notes: string;
  attendance: AttendanceRecord[];
  financialRecords: LabourFinancialRecord[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'Present' | 'Absent';
  notes: string;
}

export interface LabourFinancialRecord {
  id: string;
  date: string;
  advance: number;
  paid: number;
  due: number;
  notes: string;
}

export interface Resource {
  id: string;
  type: string;
  quantityPurchased: number;
  used: number;
  remaining: number;
  startDate: string;
  endDate: string;
  price: number;
  notes: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: 'client' | 'labour' | 'resource' | 'payment';
}

export const clients: Client[] = [
  {
    id: '1',
    name: 'Rajesh Kumar Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@email.com',
    address: 'Plot 45, Sector 12, Imphal East, Manipur',
    dateAdded: '2024-07-15',
    notes: 'Residential building project - 3 floors',
    financialRecords: [
      { id: 'f1', date: '2024-07-20', amount: 500000, type: 'Received', notes: 'Initial advance' },
      { id: 'f2', date: '2024-08-15', amount: 300000, type: 'Received', notes: 'Second installment' },
      { id: 'f3', date: '2024-09-10', amount: 200000, type: 'Due', notes: 'Pending payment' },
    ],
    resourceUsage: [
      { id: 'r1', resourceType: 'Cement', quantity: 200, price: 72000, notes: 'Foundation work' },
      { id: 'r2', resourceType: 'Steel Rods', quantity: 5, price: 275000, notes: '10mm and 12mm rods' },
    ],
  },
  {
    id: '2',
    name: 'Priya Devi Singh',
    phone: '+91 87654 32109',
    email: 'priya.singh@email.com',
    address: '12-A, Lamphel Road, Imphal West, Manipur',
    dateAdded: '2024-08-01',
    notes: 'Commercial complex renovation',
    financialRecords: [
      { id: 'f4', date: '2024-08-05', amount: 800000, type: 'Received', notes: 'Project start payment' },
      { id: 'f5', date: '2024-09-01', amount: 450000, type: 'Due', notes: 'Phase 2 payment' },
    ],
    resourceUsage: [
      { id: 'r3', resourceType: 'Bricks', quantity: 15000, price: 105000, notes: 'Partition walls' },
    ],
  },
  {
    id: '3',
    name: 'Tomba Meitei',
    phone: '+91 76543 21098',
    email: 'tomba.meitei@email.com',
    address: 'Uripok Bachaspati Leikai, Imphal, Manipur',
    dateAdded: '2024-09-10',
    notes: 'New residential construction',
    financialRecords: [
      { id: 'f6', date: '2024-09-15', amount: 1200000, type: 'Received', notes: 'Full advance' },
    ],
    resourceUsage: [],
  },
  {
    id: '4',
    name: 'Sanjay Ningthoujam',
    phone: '+91 65432 10987',
    email: 'sanjay.n@email.com',
    address: 'Keishamthong, Imphal West, Manipur',
    dateAdded: '2024-06-20',
    notes: 'Warehouse construction project',
    financialRecords: [
      { id: 'f7', date: '2024-06-25', amount: 2000000, type: 'Received', notes: 'Initial payment' },
      { id: 'f8', date: '2024-07-30', amount: 1500000, type: 'Received', notes: 'Progress payment' },
      { id: 'f9', date: '2024-10-01', amount: 800000, type: 'Due', notes: 'Final payment pending' },
    ],
    resourceUsage: [
      { id: 'r4', resourceType: 'Cement', quantity: 500, price: 180000, notes: 'Main structure' },
      { id: 'r5', resourceType: 'Sand', quantity: 100, price: 45000, notes: 'River sand' },
    ],
  },
  {
    id: '5',
    name: 'Monika Laishram',
    phone: '+91 54321 09876',
    email: 'monika.l@email.com',
    address: 'Sagolband, Imphal, Manipur',
    dateAdded: '2024-10-05',
    notes: 'Home extension and renovation',
    financialRecords: [
      { id: 'f10', date: '2024-10-10', amount: 350000, type: 'Received', notes: 'Booking amount' },
    ],
    resourceUsage: [],
  },
];

export const labours: Labour[] = [
  {
    id: '1',
    name: 'Ibomcha Singh',
    phone: '+91 98761 23456',
    address: 'Singjamei, Imphal, Manipur',
    dateJoined: '2024-01-15',
    status: 'Active',
    notes: 'Expert mason - 15 years experience',
    attendance: [
      { id: 'a1', date: '2024-10-14', status: 'Present', notes: '' },
      { id: 'a2', date: '2024-10-15', status: 'Present', notes: '' },
      { id: 'a3', date: '2024-10-16', status: 'Absent', notes: 'Medical leave' },
      { id: 'a4', date: '2024-10-17', status: 'Present', notes: '' },
    ],
    financialRecords: [
      { id: 'lf1', date: '2024-10-01', advance: 5000, paid: 15000, due: 0, notes: 'October salary' },
      { id: 'lf2', date: '2024-09-01', advance: 3000, paid: 15000, due: 0, notes: 'September salary' },
    ],
  },
  {
    id: '2',
    name: 'Romen Thokchom',
    phone: '+91 87652 34567',
    address: 'Thangmeiband, Imphal, Manipur',
    dateJoined: '2024-03-20',
    status: 'Active',
    notes: 'Carpenter - specializes in roofing',
    attendance: [
      { id: 'a5', date: '2024-10-14', status: 'Present', notes: '' },
      { id: 'a6', date: '2024-10-15', status: 'Present', notes: '' },
      { id: 'a7', date: '2024-10-16', status: 'Present', notes: '' },
    ],
    financialRecords: [
      { id: 'lf3', date: '2024-10-01', advance: 2000, paid: 12000, due: 1000, notes: 'Partial payment' },
    ],
  },
  {
    id: '3',
    name: 'Sanatombi Chanu',
    phone: '+91 76543 45678',
    address: 'Kakching, Manipur',
    dateJoined: '2024-05-10',
    status: 'Active',
    notes: 'General labor - hardworking',
    attendance: [
      { id: 'a8', date: '2024-10-14', status: 'Present', notes: '' },
      { id: 'a9', date: '2024-10-15', status: 'Absent', notes: 'Personal work' },
    ],
    financialRecords: [
      { id: 'lf4', date: '2024-10-01', advance: 0, paid: 10000, due: 0, notes: 'Full payment' },
    ],
  },
  {
    id: '4',
    name: 'Biren Moirangthem',
    phone: '+91 65434 56789',
    address: 'Thoubal, Manipur',
    dateJoined: '2024-02-01',
    status: 'Inactive',
    notes: 'Electrician - currently on leave',
    attendance: [],
    financialRecords: [
      { id: 'lf5', date: '2024-09-01', advance: 4000, paid: 8000, due: 2000, notes: 'Advance pending' },
    ],
  },
  {
    id: '5',
    name: 'Memcha Devi',
    phone: '+91 54325 67890',
    address: 'Bishnupur, Manipur',
    dateJoined: '2024-06-15',
    status: 'Active',
    notes: 'Plumber - skilled in modern fittings',
    attendance: [
      { id: 'a10', date: '2024-10-14', status: 'Present', notes: '' },
      { id: 'a11', date: '2024-10-15', status: 'Present', notes: '' },
      { id: 'a12', date: '2024-10-16', status: 'Present', notes: '' },
      { id: 'a13', date: '2024-10-17', status: 'Present', notes: '' },
    ],
    financialRecords: [
      { id: 'lf6', date: '2024-10-01', advance: 1000, paid: 14000, due: 0, notes: 'October complete' },
    ],
  },
];

export const resources: Resource[] = [
  {
    id: '1',
    type: 'Cement (Bags)',
    quantityPurchased: 1000,
    used: 720,
    remaining: 280,
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    price: 360000,
    notes: 'ACC Cement - 50kg bags',
  },
  {
    id: '2',
    type: 'Steel Rods (Tons)',
    quantityPurchased: 20,
    used: 14,
    remaining: 6,
    startDate: '2024-07-15',
    endDate: '2024-11-30',
    price: 1100000,
    notes: 'TMT bars - mixed sizes',
  },
  {
    id: '3',
    type: 'Bricks (Units)',
    quantityPurchased: 50000,
    used: 35000,
    remaining: 15000,
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    price: 350000,
    notes: 'First class bricks',
  },
  {
    id: '4',
    type: 'Sand (Cubic Meters)',
    quantityPurchased: 200,
    used: 150,
    remaining: 50,
    startDate: '2024-07-01',
    endDate: '2024-10-31',
    price: 90000,
    notes: 'River sand for construction',
  },
  {
    id: '5',
    type: 'Gravel (Cubic Meters)',
    quantityPurchased: 150,
    used: 120,
    remaining: 30,
    startDate: '2024-07-01',
    endDate: '2024-10-31',
    price: 75000,
    notes: '20mm aggregate',
  },
  {
    id: '6',
    type: 'Timber (Cubic Feet)',
    quantityPurchased: 500,
    used: 200,
    remaining: 300,
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    price: 250000,
    notes: 'Sal wood for doors and frames',
  },
];

export const activityLog: ActivityLog[] = [
  { id: '1', action: 'Payment received from Rajesh Kumar Sharma - ₹3,00,000', timestamp: '2024-10-17 14:30', type: 'payment' },
  { id: '2', action: 'New client added - Monika Laishram', timestamp: '2024-10-17 11:15', type: 'client' },
  { id: '3', action: 'Attendance marked for 5 labours', timestamp: '2024-10-17 09:00', type: 'labour' },
  { id: '4', action: 'Cement stock updated - 100 bags used', timestamp: '2024-10-16 16:45', type: 'resource' },
  { id: '5', action: 'Labour advance paid to Ibomcha Singh - ₹5,000', timestamp: '2024-10-16 12:00', type: 'payment' },
];

export const dashboardStats = {
  totalClients: 5,
  totalLabours: 5,
  activeProjects: 3,
  totalTransactions: 7650000,
};

export const companySettings = {
  companyName: 'Ningthoujam Constructions',
  ownerName: 'Arnold Ningthoujam',
  phone: '+91 84139 39905',
  email: 'contact@ningthoujamconstructions.com',
  address: 'Chajing Mamang Leikai (Near Triveni School), Imphal West, Manipur - 795130',
};

export const services = [
  {
    id: '1',
    title: 'Building Construction',
    description: 'Complete residential and commercial building construction with modern techniques and quality materials.',
    icon: 'Building2',
  },
  {
    id: '2',
    title: 'Foundation Work',
    description: 'Strong and durable foundation construction ensuring structural integrity for decades.',
    icon: 'Layers',
  },
  {
    id: '3',
    title: 'Structural Work',
    description: 'Expert structural engineering and construction for safe and stable buildings.',
    icon: 'Hammer',
  },
  {
    id: '4',
    title: 'Renovation',
    description: 'Transform your existing space with our professional renovation and remodeling services.',
    icon: 'Paintbrush',
  },
  {
    id: '5',
    title: 'Project Management',
    description: 'End-to-end project management ensuring timely delivery and budget compliance.',
    icon: 'ClipboardCheck',
  },
  {
    id: '6',
    title: 'Interior Finishing',
    description: 'Premium interior finishing including flooring, painting, and modern fixtures.',
    icon: 'Home',
  },
];

export const projects = [
  {
    id: '1',
    name: 'Sharma Residence',
    location: 'Sector 12, Imphal East',
    status: 'Ongoing',
    progress: 65,
    image: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Singh Commercial Complex',
    location: 'Lamphel Road, Imphal West',
    status: 'Ongoing',
    progress: 40,
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Meitei Family Home',
    location: 'Uripok, Imphal',
    status: 'Completed',
    progress: 100,
    image: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Industrial Warehouse',
    location: 'Keishamthong, Imphal',
    status: 'Ongoing',
    progress: 80,
    image: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Government School Building',
    location: 'Kakching, Manipur',
    status: 'Completed',
    progress: 100,
    image: '/placeholder.svg',
  },
  {
    id: '6',
    name: 'Community Health Center',
    location: 'Thoubal, Manipur',
    status: 'Completed',
    progress: 100,
    image: '/placeholder.svg',
  },
];
