-- Create system settings table for global application configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company settings table
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_address TEXT,
  company_phone TEXT,
  company_email TEXT,
  company_website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system',
  language TEXT NOT NULL DEFAULT 'en',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create notification settings table
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_on_new_customer BOOLEAN NOT NULL DEFAULT true,
  email_on_interaction_due BOOLEAN NOT NULL DEFAULT true,
  email_on_status_change BOOLEAN NOT NULL DEFAULT true,
  email_on_assignment BOOLEAN NOT NULL DEFAULT true,
  daily_digest BOOLEAN NOT NULL DEFAULT false,
  weekly_report BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all settings tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings
CREATE POLICY "Superadmin can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Owner can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (has_role(auth.uid(), 'owner'::app_role));

CREATE POLICY "Manager can view system settings" 
ON public.system_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for company_settings
CREATE POLICY "Superadmin can manage company settings" 
ON public.company_settings 
FOR ALL 
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Owner can manage company settings" 
ON public.company_settings 
FOR ALL 
USING (has_role(auth.uid(), 'owner'::app_role));

CREATE POLICY "Manager can view company settings" 
ON public.company_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can view all user preferences" 
ON public.user_preferences 
FOR SELECT 
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- RLS Policies for notification_settings
CREATE POLICY "Users can manage their own notification settings" 
ON public.notification_settings 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can view all notification settings" 
ON public.notification_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at
BEFORE UPDATE ON public.company_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
BEFORE UPDATE ON public.notification_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, category) VALUES
('app_name', '"CRM System"', 'Application name', 'general'),
('allow_registration', 'true', 'Allow new user registration', 'security'),
('require_email_verification', 'true', 'Require email verification for new users', 'security'),
('session_timeout', '24', 'Session timeout in hours', 'security'),
('max_login_attempts', '5', 'Maximum login attempts before lockout', 'security'),
('backup_enabled', 'false', 'Enable automatic backups', 'backup'),
('backup_frequency', '"weekly"', 'Backup frequency (daily, weekly, monthly)', 'backup');

-- Insert default company settings (single row)
INSERT INTO public.company_settings (company_name, company_email) VALUES
('Your Company Name', 'admin@company.com');