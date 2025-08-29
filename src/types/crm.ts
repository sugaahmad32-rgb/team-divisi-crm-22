export type CustomerStatus = 'new' | 'cold' | 'warm' | 'hot' | 'deal';
export type InteractionType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'followup';
export type InteractionStatus = 'pending' | 'done' | 'overdue';
export type UserRole = 'superadmin' | 'owner' | 'manager' | 'spv' | 'marketing';

export interface Division {
  id: string;
  name: string;
  description?: string;
}

export interface Source {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division_id?: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  status: CustomerStatus;
  source_id: string;
  assigned_to: string;
  supervisor_id?: string;
  manager_id?: string;
  division_id: string;
  estimation_value?: number;
  description?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  products?: string[]; // Product IDs
}

export interface Interaction {
  id: string;
  customer_id: string;
  user_id: string;
  type: InteractionType;
  notes: string;
  status: InteractionStatus;
  due_date?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DashboardMetrics {
  totalCustomers: number;
  pipelineValue: number;
  statusBreakdown: Record<CustomerStatus, number>;
  overdueFollowups: number;
  todayFollowups: number;
  conversionRate: number;
}