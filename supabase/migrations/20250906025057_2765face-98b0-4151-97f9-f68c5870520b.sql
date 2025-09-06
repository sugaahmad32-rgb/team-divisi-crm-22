-- Create user_sessions table for tracking user impersonation
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  impersonated_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  session_token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  ended_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = original_user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = original_user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = original_user_id);

-- Create function to check if user can impersonate target user
CREATE OR REPLACE FUNCTION public.can_impersonate_user(impersonator_id UUID, target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  impersonator_role app_role;
  target_role app_role;
  impersonator_division UUID;
  target_division UUID;
BEGIN
  -- Get impersonator role and division
  SELECT role INTO impersonator_role
  FROM public.user_roles 
  WHERE user_id = impersonator_id
  LIMIT 1;

  SELECT division_id INTO impersonator_division
  FROM public.profiles
  WHERE user_id = impersonator_id;

  -- Get target user role and division
  SELECT role INTO target_role
  FROM public.user_roles 
  WHERE user_id = target_user_id
  LIMIT 1;

  SELECT division_id INTO target_division
  FROM public.profiles
  WHERE user_id = target_user_id;

  -- Superadmin can impersonate anyone except other superadmins
  IF impersonator_role = 'superadmin' THEN
    RETURN target_role != 'superadmin';
  END IF;

  -- Owner can impersonate anyone except superadmin
  IF impersonator_role = 'owner' THEN
    RETURN target_role NOT IN ('superadmin', 'owner');
  END IF;

  -- Manager can impersonate supervisor and marketing in their division
  IF impersonator_role = 'manager' THEN
    RETURN target_role IN ('supervisor', 'marketing') 
      AND (target_division = impersonator_division OR target_division IS NULL);
  END IF;

  -- Supervisor can impersonate marketing in their division
  IF impersonator_role = 'supervisor' THEN
    RETURN target_role = 'marketing' 
      AND (target_division = impersonator_division OR target_division IS NULL);
  END IF;

  -- Marketing cannot impersonate anyone
  RETURN FALSE;
END;
$$;

-- Add index for better performance
CREATE INDEX idx_user_sessions_original_user ON public.user_sessions(original_user_id);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active, expires_at);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);