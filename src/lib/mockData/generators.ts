import { faker } from '@faker-js/faker';

// Set a seed for consistent data generation
faker.seed(12345);

// Types for our mock data
export interface MockCustomer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  territoryManagerId: string;
  regionalManagerId: string;
  affinityGroupId?: string;
  ownershipGroupId?: string;
  status: 'active' | 'inactive' | 'prospect';
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  lastContactDate: Date;
  totalOrders: number;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockLead {
  id: string;
  source: 'hubspot' | 'referral' | 'website' | 'trade_show';
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  score: number;
  status: 'new' | 'qualified' | 'discovery' | 'proposal' | 'won' | 'lost';
  assignedTo: string;
  notes: string;
  discoveryCallDate?: Date;
  cisSubmittedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockTrainingSession {
  id: string;
  customerId: string;
  trainerId: string;
  type: 'installation' | 'maintenance' | 'sales' | 'product_knowledge';
  title: string;
  scheduledDate: Date;
  completedDate?: Date;
  duration: number; // in minutes
  attendees: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: {
    rating: number;
    comments: string;
  };
  certificationAwarded?: string;
}

export interface MockOrder {
  id: string;
  customerId: string;
  orderNumber: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  expectedShipDate?: Date;
  actualShipDate?: Date;
  trackingNumber?: string;
  shippingCarrier?: string;
}

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'territory_manager' | 'regional_manager' | 'admin' | 'dealer';
  territoryId?: string;
  regionId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface MockDealer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessType: string;
  accountNumber: string;
  status: 'active' | 'pending' | 'suspended';
  creditLimit: number;
  availableCredit: number;
  paymentTerms: string;
  territoryManagerId: string;
  memberSince: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: Record<string, string>;
  basePrice: number;
  dealerPrice: number;
  inStock: boolean;
  stockQuantity: number;
  imageUrl: string;
  features: string[];
  warranty: string;
  createdAt: Date;
}

// Territory and Region data
export const territories = [
  { id: '1', name: 'Northeast', regionId: '1' },
  { id: '2', name: 'Southeast', regionId: '1' },
  { id: '3', name: 'Midwest', regionId: '2' },
  { id: '4', name: 'Southwest', regionId: '2' },
  { id: '5', name: 'West Coast', regionId: '3' },
  { id: '6', name: 'Northwest', regionId: '3' },
];

export const regions = [
  { id: '1', name: 'Eastern Region', managerId: 'rm-1' },
  { id: '2', name: 'Central Region', managerId: 'rm-2' },
  { id: '3', name: 'Western Region', managerId: 'rm-3' },
];

export const affinityGroups = [
  { id: '1', name: 'HVAC Excellence Alliance' },
  { id: '2', name: 'Comfort Systems Network' },
  { id: '3', name: 'Independent Dealers Association' },
];

export const ownershipGroups = [
  { id: '1', name: 'Comfort Corp Holdings' },
  { id: '2', name: 'Climate Solutions Group' },
  { id: '3', name: 'Regional HVAC Partners' },
];

// Generator functions
export function generateMockUsers(count: number = 20): MockUser[] {
  const users: MockUser[] = [];
  
  // Generate regional managers
  for (let i = 1; i <= 3; i++) {
    users.push({
      id: `rm-${i}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      role: 'regional_manager',
      regionId: i.toString(),
      isActive: true,
      lastLogin: faker.date.recent(),
      createdAt: faker.date.past({ years: 2 }),
    });
  }

  // Generate territory managers
  territories.forEach((territory, index) => {
    users.push({
      id: `tm-${territory.id}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      role: 'territory_manager',
      territoryId: territory.id,
      regionId: territory.regionId,
      isActive: true,
      lastLogin: faker.date.recent(),
      createdAt: faker.date.past({ years: 1 }),
    });
  });

  // Generate additional users
  for (let i = users.length; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'dealer']),
      isActive: faker.datatype.boolean(0.9),
      lastLogin: faker.date.recent(),
      createdAt: faker.date.past({ years: 2 }),
    });
  }

  return users;
}

export function generateMockCustomers(count: number = 500): MockCustomer[] {
  const customers: MockCustomer[] = [];
  
  for (let i = 0; i < count; i++) {
    const territory = faker.helpers.arrayElement(territories);
    customers.push({
      id: `customer-${i + 1}`,
      companyName: faker.company.name(),
      contactName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
      },
      territoryManagerId: `tm-${territory.id}`,
      regionalManagerId: `rm-${territory.regionId}`,
      affinityGroupId: faker.helpers.maybe(() => faker.helpers.arrayElement(affinityGroups).id, { probability: 0.3 }),
      ownershipGroupId: faker.helpers.maybe(() => faker.helpers.arrayElement(ownershipGroups).id, { probability: 0.2 }),
      status: faker.helpers.arrayElement(['active', 'inactive', 'prospect']),
      onboardingStatus: faker.helpers.arrayElement(['not_started', 'in_progress', 'completed']),
      lastContactDate: faker.date.recent(),
      totalOrders: faker.number.int({ min: 0, max: 50 }),
      totalRevenue: faker.number.float({ min: 0, max: 500000, fractionDigits: 2 }),
      createdAt: faker.date.past({ years: 3 }),
      updatedAt: faker.date.recent(),
    });
  }

  return customers;
}

export function generateMockLeads(count: number = 200): MockLead[] {
  const leads: MockLead[] = [];
  
  for (let i = 0; i < count; i++) {
    const territory = faker.helpers.arrayElement(territories);
    leads.push({
      id: faker.string.uuid(),
      source: faker.helpers.arrayElement(['hubspot', 'referral', 'website', 'trade_show']),
      contactName: faker.person.fullName(),
      companyName: faker.company.name(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      score: faker.number.int({ min: 0, max: 100 }),
      status: faker.helpers.arrayElement(['new', 'qualified', 'discovery', 'proposal', 'won', 'lost']),
      assignedTo: `tm-${territory.id}`,
      notes: faker.lorem.paragraph(),
      discoveryCallDate: faker.helpers.maybe(() => faker.date.future(), { probability: 0.4 }),
      cisSubmittedDate: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.2 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
    });
  }

  return leads;
}

export function generateMockTrainingSessions(customers: MockCustomer[], count: number = 300): MockTrainingSession[] {
  const sessions: MockTrainingSession[] = [];
  
  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const isCompleted = faker.datatype.boolean(0.7);
    
    sessions.push({
      id: faker.string.uuid(),
      customerId: customer.id,
      trainerId: customer.territoryManagerId,
      type: faker.helpers.arrayElement(['installation', 'maintenance', 'sales', 'product_knowledge']),
      title: faker.lorem.words(3),
      scheduledDate: faker.date.between({ from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }),
      completedDate: isCompleted ? faker.date.recent() : undefined,
      duration: faker.number.int({ min: 60, max: 480 }),
      attendees: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.person.fullName()),
      status: isCompleted ? 'completed' : faker.helpers.arrayElement(['scheduled', 'cancelled']),
      feedback: isCompleted ? {
        rating: faker.number.int({ min: 1, max: 5 }),
        comments: faker.lorem.sentence(),
      } : undefined,
      certificationAwarded: isCompleted && faker.datatype.boolean(0.3) ? faker.lorem.words(2) : undefined,
    });
  }

  return sessions;
}

export function generateMockOrders(customers: MockCustomer[], count: number = 400): MockOrder[] {
  const orders: MockOrder[] = [];
  
  const products = [
    { id: '1', name: 'AQS Pro Series Heat Pump', basePrice: 3500 },
    { id: '2', name: 'AQS Comfort Air Handler', basePrice: 1200 },
    { id: '3', name: 'AQS Smart Thermostat', basePrice: 250 },
    { id: '4', name: 'AQS Ductwork Kit', basePrice: 800 },
    { id: '5', name: 'AQS Installation Tools', basePrice: 450 },
  ];
  
  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const itemCount = faker.number.int({ min: 1, max: 4 });
    const items = [];
    let totalAmount = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 3 });
      const unitPrice = product.basePrice * faker.number.float({ min: 0.8, max: 1.2, fractionDigits: 2 });
      const totalPrice = quantity * unitPrice;
      
      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice,
      });
      
      totalAmount += totalPrice;
    }
    
    const orderDate = faker.date.past({ years: 2 });
    const status = faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
    
    orders.push({
      id: faker.string.uuid(),
      customerId: customer.id,
      orderNumber: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
      items,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status,
      orderDate,
      expectedShipDate: status !== 'cancelled' ? faker.date.future() : undefined,
      actualShipDate: ['shipped', 'delivered'].includes(status) ? faker.date.recent() : undefined,
      trackingNumber: ['shipped', 'delivered'].includes(status) ? faker.string.alphanumeric(12).toUpperCase() : undefined,
      shippingCarrier: ['shipped', 'delivered'].includes(status) ? faker.helpers.arrayElement(['UPS', 'FedEx', 'USPS']) : undefined,
    });
  }

  return orders;
}

export function generateMockDealers(count: number = 100): MockDealer[] {
  const dealers: MockDealer[] = [];
  
  for (let i = 0; i < count; i++) {
    const territory = faker.helpers.arrayElement(territories);
    const memberSince = faker.date.past({ years: 5 });
    const totalOrders = faker.number.int({ min: 0, max: 100 });
    const totalSpent = totalOrders * faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 });
    const creditLimit = faker.helpers.arrayElement([25000, 50000, 75000, 100000]);
    const availableCredit = creditLimit - faker.number.float({ min: 0, max: creditLimit * 0.7, fractionDigits: 2 });
    
    dealers.push({
      id: faker.string.uuid(),
      companyName: faker.company.name(),
      contactName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
      },
      businessType: faker.helpers.arrayElement([
        'HVAC Contractor',
        'Plumbing Contractor',
        'Electrical Contractor',
        'General Contractor',
        'Distributor',
      ]),
      accountNumber: `DLR-${faker.string.alphanumeric(5).toUpperCase()}`,
      status: faker.helpers.arrayElement(['active', 'pending', 'suspended']),
      creditLimit,
      availableCredit,
      paymentTerms: faker.helpers.arrayElement(['Net 15', 'Net 30', 'Net 45', 'COD']),
      territoryManagerId: `tm-${territory.id}`,
      memberSince,
      lastOrderDate: totalOrders > 0 ? faker.date.recent() : undefined,
      totalOrders,
      totalSpent,
      createdAt: memberSince,
      updatedAt: faker.date.recent(),
    });
  }

  return dealers;
}

export function generateMockProducts(count: number = 50): MockProduct[] {
  const products: MockProduct[] = [];
  
  const categories = [
    'Heat Pumps',
    'Air Handlers',
    'Thermostats',
    'Ductwork',
    'Installation Tools',
    'Accessories',
  ];

  const productNames = {
    'Heat Pumps': [
      'AQS Pro Series Heat Pump',
      'AQS Comfort Plus Heat Pump',
      'AQS Elite Heat Pump',
      'AQS Residential Heat Pump',
    ],
    'Air Handlers': [
      'AQS Comfort Air Handler',
      'AQS Pro Air Handler',
      'AQS Variable Speed Air Handler',
      'AQS Compact Air Handler',
    ],
    'Thermostats': [
      'AQS Smart Thermostat',
      'AQS WiFi Thermostat',
      'AQS Programmable Thermostat',
      'AQS Basic Thermostat',
    ],
    'Ductwork': [
      'AQS Flexible Ductwork Kit',
      'AQS Rigid Ductwork System',
      'AQS Insulated Duct Kit',
      'AQS Return Air Kit',
    ],
    'Installation Tools': [
      'AQS Professional Tool Kit',
      'AQS Refrigerant Manifold',
      'AQS Digital Multimeter',
      'AQS Vacuum Pump',
    ],
    'Accessories': [
      'AQS Filter Kit',
      'AQS Drain Pan',
      'AQS Mounting Brackets',
      'AQS Electrical Kit',
    ],
  };

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const productName = faker.helpers.arrayElement(productNames[category as keyof typeof productNames]);
    const basePrice = faker.number.float({ min: 100, max: 5000, fractionDigits: 2 });
    const dealerPrice = basePrice * faker.number.float({ min: 0.6, max: 0.8, fractionDigits: 2 });
    
    products.push({
      id: faker.string.uuid(),
      name: productName,
      category,
      description: faker.lorem.paragraph(),
      specifications: {
        'Model Number': faker.string.alphanumeric(8).toUpperCase(),
        'Dimensions': `${faker.number.int({ min: 20, max: 60 })}" x ${faker.number.int({ min: 20, max: 60 })}" x ${faker.number.int({ min: 10, max: 30 })}"`,
        'Weight': `${faker.number.int({ min: 50, max: 200 })} lbs`,
        'Efficiency Rating': `${faker.number.float({ min: 14, max: 22, fractionDigits: 1 })} SEER`,
      },
      basePrice,
      dealerPrice: Math.round(dealerPrice * 100) / 100,
      inStock: faker.datatype.boolean(0.8),
      stockQuantity: faker.number.int({ min: 0, max: 100 }),
      imageUrl: `/images/products/${category.toLowerCase().replace(' ', '-')}.jpg`,
      features: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => faker.lorem.sentence()),
      warranty: faker.helpers.arrayElement(['1 Year', '2 Years', '5 Years', '10 Years']),
      createdAt: faker.date.past({ years: 2 }),
    });
  }

  return products;
}

// Generate all mock data
export function generateAllMockData() {
  const users = generateMockUsers(20);
  const customers = generateMockCustomers(500);
  const leads = generateMockLeads(200);
  const trainingSessions = generateMockTrainingSessions(customers, 300);
  const orders = generateMockOrders(customers, 400);
  const dealers = generateMockDealers(100);
  const products = generateMockProducts(50);
  
  return {
    users,
    customers,
    leads,
    trainingSessions,
    orders,
    dealers,
    products,
    territories,
    regions,
    affinityGroups,
    ownershipGroups,
  };
}