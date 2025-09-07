import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  status: 'new' | 'cold' | 'warm' | 'hot' | 'deal';
  source_id: string;
  division_id?: string;
  estimation_value?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  assigned_to_user_id?: string;
  created_by_user_id?: string;
  supervisor_user_id?: string;
  manager_user_id?: string;
}

export interface CustomerWithRelations extends Customer {
  sources?: { name: string };
  divisions?: { name: string };
  customer_products?: { products: { name: string; price: number } }[];
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          sources!fk_customers_source (name),
          divisions!fk_customers_division (name),
          customer_products (
            products (name, price)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers((data as CustomerWithRelations[]) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomer = async (id: string): Promise<CustomerWithRelations | null> => {
    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.error('Invalid UUID format:', id);
        toast({
          title: "Error",
          description: "Invalid customer ID format",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          sources!fk_customers_source (name),
          divisions!fk_customers_division (name),
          customer_products (
            products (name, price)
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Error",
          description: "Customer not found",
          variant: "destructive",
        });
        return null;
      }
      
      return data as CustomerWithRelations;
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer",
        variant: "destructive",
      });
      return null;
    }
  };

  const createCustomer = async (customerData: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    whatsapp?: string;
    address?: string;
    status: 'new' | 'cold' | 'warm' | 'hot' | 'deal';
    source_id: string;
    division_id?: string;
    estimation_value?: number;
    description?: string;
    products?: string[];
  }) => {
    try {
      const { products, ...customer } = customerData;
      
      // Get current user ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
      // Create customer
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .insert([{
          ...customer,
          estimation_value: customer.estimation_value ? parseInt(customer.estimation_value.toString()) : null,
          created_by_user_id: user.id,
          assigned_to_user_id: user.id, // Default to current user, can be changed later
        }])
        .select()
        .single();

      if (customerError) throw customerError;

      // Add product relationships if any
      if (products && products.length > 0) {
        const productRelations = products.map(productId => ({
          customer_id: customerResult.id,
          product_id: productId,
        }));

        const { error: productError } = await supabase
          .from('customer_products')
          .insert(productRelations);

        if (productError) throw productError;
      }

      // Fetch the complete customer data with relations
      const completeCustomer = await fetchCustomer(customerResult.id);
      if (completeCustomer) {
        setCustomers(prev => [completeCustomer, ...prev]);
      }

      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      return customerResult;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          ...customerData,
          estimation_value: customerData.estimation_value ? parseInt(customerData.estimation_value.toString()) : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } as CustomerWithRelations : c));
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomers(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchCustomer,
    refetch: fetchCustomers,
  };
};