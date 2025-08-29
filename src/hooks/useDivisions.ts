import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Division {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useDivisions = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('divisions')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setDivisions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch divisions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDivision = async (divisionData: {
    name: string;
    description?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('divisions')
        .insert([divisionData])
        .select()
        .single();

      if (error) throw error;

      setDivisions(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Division created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create division",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDivision = async (id: string, divisionData: Partial<Division>) => {
    try {
      const { data, error } = await supabase
        .from('divisions')
        .update(divisionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDivisions(prev => prev.map(d => d.id === id ? data : d));
      toast({
        title: "Success",
        description: "Division updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update division",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDivision = async (id: string) => {
    try {
      const { error } = await supabase
        .from('divisions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDivisions(prev => prev.filter(d => d.id !== id));
      toast({
        title: "Success",
        description: "Division deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete division",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  return {
    divisions,
    loading,
    createDivision,
    updateDivision,
    deleteDivision,
    refetch: fetchDivisions,
  };
};