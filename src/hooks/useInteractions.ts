import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Interaction {
  id: string;
  customer_id: string;
  user_id?: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'followup';
  notes: string;
  status: 'pending' | 'done' | 'overdue';
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useInteractions = (customerId?: string) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('interactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInteractions((data as Interaction[]) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch interactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInteraction = async (interactionData: Omit<Interaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Get current user ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('interactions')
        .insert([{
          ...interactionData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setInteractions(prev => [data as Interaction, ...prev]);
      toast({
        title: "Success",
        description: "Interaction created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create interaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInteraction = async (id: string, interactionData: Partial<Omit<Interaction, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .update(interactionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInteractions(prev => prev.map(i => i.id === id ? data as Interaction : i));
      toast({
        title: "Success",
        description: "Interaction updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update interaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteInteraction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInteractions(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Success",
        description: "Interaction deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete interaction",
        variant: "destructive",
      });
      throw error;
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      await updateInteraction(id, {
        status: 'done',
        completed_at: new Date().toISOString(),
      });
    } catch (error) {
      // Error handling is done in updateInteraction
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [customerId]);

  return {
    interactions,
    loading,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    markAsCompleted,
    refetch: fetchInteractions,
  };
};