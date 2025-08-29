import { Customer, User, Division, Source, Product, Interaction, CustomerStatus, InteractionType } from '@/types/crm';

export const divisions: Division[] = [
  { id: '1', name: 'Excavator', description: 'Heavy machinery division' },
  { id: '2', name: 'Sparepart', description: 'Spare parts and maintenance' },
  { id: '3', name: 'Property', description: 'Real estate division' },
];

export const sources: Source[] = [
  { id: '1', name: 'Website' },
  { id: '2', name: 'Instagram' },
  { id: '3', name: 'Facebook Ads' },
  { id: '4', name: 'Referral' },
  { id: '5', name: 'WhatsApp' },
  { id: '6', name: 'Direct Call' },
];

export const products: Product[] = [
  { id: '1', name: 'Excavator CAT 320', description: 'Heavy duty excavator', price: 500000000, stock: 5 },
  { id: '2', name: 'Hydraulic Pump', description: 'Replacement hydraulic pump', price: 25000000, stock: 15 },
  { id: '3', name: 'Commercial Land', description: '5000m² commercial land', price: 2000000000, stock: 1 },
  { id: '4', name: 'Track Chain', description: 'Excavator track chain', price: 15000000, stock: 8 },
];

export const users: User[] = [
  { id: '1', name: 'Admin System', email: 'admin@company.com', role: 'superadmin' },
  { id: '2', name: 'John Owner', email: 'owner@company.com', role: 'owner' },
  { id: '3', name: 'Sarah Manager', email: 'sarah@company.com', role: 'manager', division_id: '1' },
  { id: '4', name: 'Mike SPV', email: 'mike@company.com', role: 'spv', division_id: '1' },
  { id: '5', name: 'Anna Marketing', email: 'anna@company.com', role: 'marketing', division_id: '1' },
  { id: '6', name: 'David Marketing', email: 'david@company.com', role: 'marketing', division_id: '2' },
];

// Current user simulation
export const currentUser: User = users[4]; // Anna Marketing

export const customers: Customer[] = [
  {
    id: '1',
    name: 'PT Konstruksi Prima',
    company: 'PT Konstruksi Prima',
    email: 'info@konstruksip.com',
    phone: '+62812345678',
    whatsapp: '+62812345678',
    address: 'Jakarta Selatan',
    status: 'hot',
    source_id: '1',
    assigned_to: '5',
    supervisor_id: '4',
    manager_id: '3',
    division_id: '1',
    estimation_value: 750000000,
    description: 'Interested in heavy machinery for construction project',
    created_by: '5',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-20'),
    products: ['1']
  },
  {
    id: '2',
    name: 'Budi Santoso',
    company: 'CV Maju Jaya',
    email: 'budi@majujaya.com',
    phone: '+62823456789',
    status: 'warm',
    source_id: '2',
    assigned_to: '5',
    supervisor_id: '4',
    manager_id: '3',
    division_id: '1',
    estimation_value: 35000000,
    description: 'Needs spare parts for existing excavator',
    created_by: '5',
    created_at: new Date('2024-01-18'),
    updated_at: new Date('2024-01-22'),
    products: ['2', '4']
  },
  {
    id: '3',
    name: 'Siti Rahayu',
    company: 'PT Property Indah',
    email: 'siti@propertyindah.com',
    phone: '+62834567890',
    status: 'cold',
    source_id: '3',
    assigned_to: '6',
    division_id: '3',
    estimation_value: 1500000000,
    description: 'Looking for commercial land investment',
    created_by: '6',
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-25'),
    products: ['3']
  },
  {
    id: '4',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@email.com',
    phone: '+62845678901',
    status: 'new',
    source_id: '5',
    assigned_to: '5',
    supervisor_id: '4',
    manager_id: '3',
    division_id: '1',
    estimation_value: 500000000,
    description: 'New inquiry about excavator rental',
    created_by: '5',
    created_at: new Date('2024-01-28'),
    updated_at: new Date('2024-01-28'),
    products: ['1']
  }
];

export const interactions: Interaction[] = [
  {
    id: '1',
    customer_id: '1',
    user_id: '5',
    type: 'call',
    notes: 'Discussed project timeline and equipment specifications',
    status: 'done',
    completed_at: new Date('2024-01-20T10:30:00'),
    created_at: new Date('2024-01-20T10:30:00'),
    updated_at: new Date('2024-01-20T10:30:00')
  },
  {
    id: '2',
    customer_id: '1',
    user_id: '5',
    type: 'followup',
    notes: 'Follow up on price negotiation',
    status: 'pending',
    due_date: new Date('2024-01-30'),
    created_at: new Date('2024-01-22'),
    updated_at: new Date('2024-01-22')
  },
  {
    id: '3',
    customer_id: '2',
    user_id: '5',
    type: 'whatsapp',
    notes: 'Sent spare parts catalog and pricing',
    status: 'done',
    completed_at: new Date('2024-01-23T14:15:00'),
    created_at: new Date('2024-01-23T14:15:00'),
    updated_at: new Date('2024-01-23T14:15:00')
  },
  {
    id: '4',
    customer_id: '3',
    user_id: '6',
    type: 'followup',
    notes: 'Follow up on property viewing',
    status: 'overdue',
    due_date: new Date('2024-01-25'),
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20')
  }
];

// Helper functions
export const getCustomersByUser = (userId: string) => {
  return customers.filter(c => c.assigned_to === userId);
};

export const getOverdueFollowups = (userId?: string) => {
  const today = new Date();
  return interactions.filter(i => 
    i.status === 'overdue' || 
    (i.status === 'pending' && i.due_date && i.due_date < today)
  ).filter(i => !userId || i.user_id === userId);
};

export const getTodayFollowups = (userId?: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return interactions.filter(i => 
    i.status === 'pending' && 
    i.due_date && 
    i.due_date >= today && 
    i.due_date < tomorrow
  ).filter(i => !userId || i.user_id === userId);
};