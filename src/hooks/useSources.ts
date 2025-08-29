import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Source {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSources = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSource = async (sourceData: Omit<Source, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sources')
        .insert([sourceData])
        .select()
        .single();

      if (error) throw error;
      
      setSources(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Source created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create source",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSource = async (id: string, sourceData: Partial<Omit<Source, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('sources')
        .update(sourceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSources(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Success",
        description: "Source updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update source",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSources(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Source deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete source",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return {
    sources,
    loading,
    createSource,
    updateSource,
    deleteSource,
    refetch: fetchSources,
  };
};