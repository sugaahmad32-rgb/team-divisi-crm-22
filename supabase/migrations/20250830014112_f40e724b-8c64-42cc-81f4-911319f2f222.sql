-- Fix infinite recursion in RLS policies
-- Drop problematic policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Owner can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Manager can view profiles in their division" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can manage all profiles" ON public.profiles;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.get_current_user_division()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT division_id FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Create simpler, non-recursive policies
CREATE POLICY "Enable read access for all authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Superadmin can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- Fix user_roles policies to be simpler
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmin can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Owner can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Owner can manage non-superadmin roles" ON public.user_roles;
DROP POLICY IF EXISTS "Manager can view roles in division" ON public.user_roles;

CREATE POLICY "Enable read access for authenticated users" ON public.user_roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Superadmin can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

CREATE POLICY "Owner can manage non-superadmin roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    role != 'superadmin' AND
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role IN ('superadmin', 'owner')
    )
  );

-- Manually assign superadmin role to the user that just signed up
-- Get the user ID for bajra3131@gmail.com and assign superadmin role
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user ID from profiles
  SELECT user_id INTO target_user_id
  FROM public.profiles
  WHERE email = 'bajra3131@gmail.com';
  
  IF target_user_id IS NOT NULL THEN
    -- Insert superadmin role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (target_user_id, 'superadmin', target_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Superadmin role assigned to user: %', target_user_id;
  ELSE
    RAISE NOTICE 'User bajra3131@gmail.com not found in profiles';
  END IF;
END;
$$;