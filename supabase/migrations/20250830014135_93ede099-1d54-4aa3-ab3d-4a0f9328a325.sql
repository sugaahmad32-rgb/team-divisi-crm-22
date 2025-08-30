-- First, drop the existing duplicate policy
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.profiles;

-- Now create the corrected policies
CREATE POLICY "Enable read access for all authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Apply the superadmin role assignment
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