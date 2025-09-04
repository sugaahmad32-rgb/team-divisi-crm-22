-- Insert demo divisions
INSERT INTO public.divisions (name, description) VALUES
('Sales & Marketing', 'Responsible for lead generation and sales activities'),
('IT & Development', 'Technology and product development division'),
('Customer Support', 'Customer service and support operations'),
('Operations', 'Business operations and administration')
ON CONFLICT (name) DO NOTHING;

-- Insert demo sources
INSERT INTO public.sources (name, description) VALUES
('Website', 'Leads from company website'),
('Social Media', 'Leads from social media platforms'),
('Referral', 'Customer referrals and word of mouth'),
('Trade Show', 'Leads from trade shows and events'),
('Cold Call', 'Cold calling campaigns'),
('Email Campaign', 'Email marketing campaigns'),
('Partner Channel', 'Leads from business partners')
ON CONFLICT (name) DO NOTHING;

-- Insert demo products
INSERT INTO public.products (name, description, price, stock) VALUES
('CRM Pro', 'Professional CRM solution for small to medium businesses', 99900, 100),
('CRM Enterprise', 'Enterprise-grade CRM with advanced analytics', 299900, 50),
('Marketing Automation', 'Automated marketing tools and campaigns', 149900, 75),
('Sales Analytics', 'Advanced sales reporting and analytics', 79900, 200),
('Customer Support Suite', 'Complete customer support management', 59900, 150),
('Integration Platform', 'Third-party integrations and API access', 199900, 25)
ON CONFLICT (name) DO NOTHING;