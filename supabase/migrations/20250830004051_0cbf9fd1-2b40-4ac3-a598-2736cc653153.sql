-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('superadmin', 'owner', 'manager', 'supervisor', 'marketing');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  division_id UUID REFERENCES public.divisions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = $1 LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND role = $2
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_role(manager_role app_role, target_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN manager_role = 'superadmin' THEN target_role IN ('owner', 'manager', 'supervisor', 'marketing')
    WHEN manager_role = 'owner' THEN target_role IN ('manager', 'supervisor', 'marketing')
    WHEN manager_role = 'manager' THEN target_role IN ('supervisor', 'marketing')
    ELSE FALSE
  END;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Owner can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Manager can view profiles in their division" ON public.profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'manager') AND 
    division_id = (SELECT division_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can manage all profiles" ON public.profiles
  FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Owner can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can manage non-superadmin roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'owner') AND 
    role != 'superadmin'
  );

CREATE POLICY "Manager can view roles in division" ON public.user_roles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'manager') AND
    user_id IN (
      SELECT user_id FROM public.profiles 
      WHERE division_id = (SELECT division_id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing tables to link to user_id instead of mock data
ALTER TABLE public.customers ADD COLUMN assigned_to_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.customers ADD COLUMN created_by_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.customers ADD COLUMN supervisor_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.customers ADD COLUMN manager_user_id UUID REFERENCES auth.users(id);

ALTER TABLE public.interactions ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update customers RLS policies
DROP POLICY IF EXISTS "Allow all operations on customers" ON public.customers;

CREATE POLICY "Superadmin can manage all customers" ON public.customers
  FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Owner can manage all customers" ON public.customers
  FOR ALL USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Manager can manage customers in their division" ON public.customers
  FOR ALL USING (
    public.has_role(auth.uid(), 'manager') AND
    division_id = (SELECT division_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Supervisor can view customers in their division" ON public.customers
  FOR SELECT USING (
    public.has_role(auth.uid(), 'supervisor') AND
    division_id = (SELECT division_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Marketing can manage their assigned customers" ON public.customers
  FOR ALL USING (
    public.has_role(auth.uid(), 'marketing') AND
    assigned_to_user_id = auth.uid()
  );

-- Update interactions RLS policies
DROP POLICY IF EXISTS "Allow all operations on interactions" ON public.interactions;

CREATE POLICY "Superadmin can manage all interactions" ON public.interactions
  FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Owner can manage all interactions" ON public.interactions
  FOR ALL USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Manager can manage interactions in their division" ON public.interactions
  FOR ALL USING (
    public.has_role(auth.uid(), 'manager') AND
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE division_id = (SELECT division_id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own interactions" ON public.interactions
  FOR ALL USING (user_id = auth.uid());