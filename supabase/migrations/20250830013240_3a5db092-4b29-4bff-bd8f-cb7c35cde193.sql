-- Create initial superadmin user
-- This is handled through the signup process, but we can prepare the role assignment

-- Function to assign superadmin role to a specific user
CREATE OR REPLACE FUNCTION public.assign_superadmin_role(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email in profiles table
  SELECT user_id INTO target_user_id
  FROM public.profiles
  WHERE email = user_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Insert or update the role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (target_user_id, 'superadmin', target_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

-- Function to be called after bajra3131@gmail.com signs up
-- This will automatically assign superadmin role
CREATE OR REPLACE FUNCTION public.handle_superadmin_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the email is bajra3131@gmail.com, assign superadmin role
  IF NEW.email = 'bajra3131@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.user_id, 'superadmin', NEW.user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign superadmin role to bajra3131@gmail.com
CREATE TRIGGER auto_assign_superadmin
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_superadmin_assignment();