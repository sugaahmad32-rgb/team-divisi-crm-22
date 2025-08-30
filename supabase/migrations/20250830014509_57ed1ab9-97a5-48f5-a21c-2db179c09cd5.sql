-- Fix infinite recursion in user_roles RLS policies
-- Drop problematic policies that cause recursion
DROP POLICY IF EXISTS "Superadmin can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmin can manage all profiles" ON public.profiles;

-- Recreate user_roles policies using has_role function to avoid recursion
CREATE POLICY "Superadmin can manage all roles" ON public.user_roles
  FOR ALL USING (has_role(auth.uid(), 'superadmin'));

-- Recreate profiles policy using has_role function  
CREATE POLICY "Superadmin can manage all profiles" ON public.profiles
  FOR ALL USING (has_role(auth.uid(), 'superadmin'));

-- Ensure owner can manage non-superadmin roles (recreate if needed)
DROP POLICY IF EXISTS "Owner can manage non-superadmin roles" ON public.user_roles;
CREATE POLICY "Owner can manage non-superadmin roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    role != 'superadmin' AND 
    (has_role(auth.uid(), 'superadmin') OR has_role(auth.uid(), 'owner'))
  );