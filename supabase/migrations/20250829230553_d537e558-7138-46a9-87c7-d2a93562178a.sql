-- Create divisions table
CREATE TABLE public.divisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;

-- Create policies for divisions
CREATE POLICY "Allow all operations on divisions" 
ON public.divisions 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_divisions_updated_at
BEFORE UPDATE ON public.divisions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add division_id to customers table
ALTER TABLE public.customers 
ADD COLUMN division_id UUID REFERENCES public.divisions(id);