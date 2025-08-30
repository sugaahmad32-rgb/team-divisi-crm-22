-- Fix security definer functions by setting search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = $1 LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
AS $$
  SELECT CASE 
    WHEN manager_role = 'superadmin' THEN target_role IN ('owner', 'manager', 'supervisor', 'marketing')
    WHEN manager_role = 'owner' THEN target_role IN ('manager', 'supervisor', 'marketing')
    WHEN manager_role = 'manager' THEN target_role IN ('supervisor', 'marketing')
    ELSE FALSE
  END;
$$;