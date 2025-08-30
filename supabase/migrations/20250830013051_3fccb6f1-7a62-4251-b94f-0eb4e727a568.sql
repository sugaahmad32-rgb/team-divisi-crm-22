-- Insert the superadmin user
-- Note: This is a simplified approach for demo purposes
-- In production, you would create this user through proper auth signup

-- Create a demo superadmin profile manually
-- First, we need to get the auth.users table populated with our demo user
-- This will be done through the app signup process

-- For now, let's add some sample divisions to test with
INSERT INTO public.divisions (name, description) VALUES 
('IT & Development', 'Information Technology and Software Development'),
('Sales & Marketing', 'Sales and Marketing Operations'),
('Customer Support', 'Customer Service and Support'),
('Operations', 'Business Operations and Management')
ON CONFLICT DO NOTHING;

-- Sample products
INSERT INTO public.products (name, description, price, stock) VALUES 
('CRM Software License', 'Annual license for CRM software', 120000, 100),
('Consultation Service', 'Business consultation and setup', 500000, 50),
('Training Package', 'Complete CRM training for teams', 250000, 30),
('Support Package', 'Premium support and maintenance', 180000, 75)
ON CONFLICT DO NOTHING;

-- Sample sources
INSERT INTO public.sources (name, description) VALUES 
('Website', 'Company website inquiries'),
('Social Media', 'Social media platforms'),
('Referral', 'Customer referrals'),
('Cold Call', 'Cold calling campaigns'),
('Trade Show', 'Trade shows and exhibitions'),
('Partner', 'Business partner referrals')
ON CONFLICT DO NOTHING;