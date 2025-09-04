-- Insert demo divisions
INSERT INTO public.divisions (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Sales & Marketing', 'Responsible for lead generation and sales activities'),
('22222222-2222-2222-2222-222222222222', 'IT & Development', 'Technology and product development division'),
('33333333-3333-3333-3333-333333333333', 'Customer Support', 'Customer service and support operations'),
('44444444-4444-4444-4444-444444444444', 'Operations', 'Business operations and administration')
ON CONFLICT (id) DO NOTHING;

-- Insert demo sources
INSERT INTO public.sources (id, name, description) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Website', 'Leads from company website'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Social Media', 'Leads from social media platforms'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Referral', 'Customer referrals and word of mouth'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Trade Show', 'Leads from trade shows and events'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Cold Call', 'Cold calling campaigns'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Email Campaign', 'Email marketing campaigns'),
('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Partner Channel', 'Leads from business partners')
ON CONFLICT (id) DO NOTHING;

-- Insert demo products
INSERT INTO public.products (id, name, description, price, stock) VALUES
('p1111111-1111-1111-1111-111111111111', 'CRM Pro', 'Professional CRM solution for small to medium businesses', 99900, 100),
('p2222222-2222-2222-2222-222222222222', 'CRM Enterprise', 'Enterprise-grade CRM with advanced analytics', 299900, 50),
('p3333333-3333-3333-3333-333333333333', 'Marketing Automation', 'Automated marketing tools and campaigns', 149900, 75),
('p4444444-4444-4444-4444-444444444444', 'Sales Analytics', 'Advanced sales reporting and analytics', 79900, 200),
('p5555555-5555-5555-5555-555555555555', 'Customer Support Suite', 'Complete customer support management', 59900, 150),
('p6666666-6666-6666-6666-666666666666', 'Integration Platform', 'Third-party integrations and API access', 199900, 25)
ON CONFLICT (id) DO NOTHING;

-- Insert demo user profiles (these would normally be created by auth signup)
INSERT INTO public.profiles (user_id, display_name, email, division_id) VALUES
('u1111111-1111-1111-1111-111111111111', 'Sarah Manager', 'sarah@company.com', '11111111-1111-1111-1111-111111111111'),
('u2222222-2222-2222-2222-222222222222', 'John Smith', 'john@company.com', '22222222-2222-2222-2222-222222222222'),
('u3333333-3333-3333-3333-333333333333', 'Lisa Wong', 'lisa@company.com', '33333333-3333-3333-3333-333333333333'),
('u4444444-4444-4444-4444-444444444444', 'Mike Johnson', 'mike@company.com', '11111111-1111-1111-1111-111111111111'),
('u5555555-5555-5555-5555-555555555555', 'Anna Davis', 'anna@company.com', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (user_id) DO NOTHING;

-- Insert demo user roles
INSERT INTO public.user_roles (user_id, role, assigned_by) VALUES
('u1111111-1111-1111-1111-111111111111', 'owner', 'u1111111-1111-1111-1111-111111111111'),
('u2222222-2222-2222-2222-222222222222', 'manager', 'u1111111-1111-1111-1111-111111111111'),
('u3333333-3333-3333-3333-333333333333', 'supervisor', 'u2222222-2222-2222-2222-222222222222'),
('u4444444-4444-4444-4444-444444444444', 'marketing', 'u1111111-1111-1111-1111-111111111111'),
('u5555555-5555-5555-5555-555555555555', 'marketing', 'u1111111-1111-1111-1111-111111111111')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert demo customers
INSERT INTO public.customers (id, name, company, email, phone, whatsapp, address, status, source_id, assigned_to_user_id, supervisor_user_id, manager_user_id, division_id, estimation_value, description, created_by_user_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'Robert Johnson', 'TechCorp Inc', 'robert@techcorp.com', '+1234567890', '+1234567890', '123 Tech Street, Silicon Valley', 'hot', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'u4444444-4444-4444-4444-444444444444', 'u3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 150000, 'Large tech company looking for enterprise CRM solution', 'u4444444-4444-4444-4444-444444444444'),

('c2222222-2222-2222-2222-222222222222', 'Maria Garcia', 'StartupXYZ', 'maria@startupxyz.com', '+1234567891', '+1234567891', '456 Innovation Ave, Austin', 'warm', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'u5555555-5555-5555-5555-555555555555', NULL, 'u1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 75000, 'Growing startup needs scalable CRM', 'u5555555-5555-5555-5555-555555555555'),

('c3333333-3333-3333-3333-333333333333', 'David Chen', 'ManufacturingPro', 'david@manufacturingpro.com', '+1234567892', '+1234567892', '789 Industrial Blvd, Detroit', 'new', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'u4444444-4444-4444-4444-444444444444', 'u3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 200000, 'Manufacturing company exploring CRM options', 'u4444444-4444-4444-4444-444444444444'),

('c4444444-4444-4444-4444-444444444444', 'Jennifer Smith', 'HealthCare Solutions', 'jennifer@healthcare.com', '+1234567893', '+1234567893', '321 Medical Center Dr, Boston', 'deal', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'u4444444-4444-4444-4444-444444444444', 'u3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 300000, 'Healthcare provider ready to close CRM deal', 'u4444444-4444-4444-4444-444444444444'),

('c5555555-5555-5555-5555-555555555555', 'Ahmed Al-Rashid', 'Global Trading Co', 'ahmed@globaltrading.com', '+1234567894', '+1234567894', '654 Trade Plaza, Dubai', 'cold', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'u5555555-5555-5555-5555-555555555555', NULL, 'u1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 50000, 'International trading company, initial contact', 'u5555555-5555-5555-5555-555555555555'),

('c6666666-6666-6666-6666-666666666666', 'Emma Thompson', 'RetailChain Ltd', 'emma@retailchain.com', '+1234567895', '+1234567895', '987 Retail Park, London', 'warm', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'u4444444-4444-4444-4444-444444444444', 'u3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 120000, 'Retail chain looking to improve customer management', 'u4444444-4444-4444-4444-444444444444'),

('c7777777-7777-7777-7777-777777777777', 'Carlos Rodriguez', 'Restaurant Group', 'carlos@restaurantgroup.com', '+1234567896', '+1234567896', '555 Food Court, Miami', 'new', 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'u5555555-5555-5555-5555-555555555555', NULL, 'u1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 80000, 'Restaurant chain needs customer loyalty system', 'u5555555-5555-5555-5555-555555555555'),

('c8888888-8888-8888-8888-888888888888', 'Sophie Mueller', 'TechStart Berlin', 'sophie@techstart.com', '+1234567897', '+1234567897', '111 Startup Str, Berlin', 'hot', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'u4444444-4444-4444-4444-444444444444', 'u3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 90000, 'Berlin-based tech startup, very interested', 'u4444444-4444-4444-4444-444444444444'),

('c9999999-9999-9999-9999-999999999999', 'Michael O''Connor', 'Construction Plus', 'michael@constructionplus.com', '+1234567898', '+1234567898', '222 Build Ave, Chicago', 'cold', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'u5555555-5555-5555-5555-555555555555', NULL, 'u1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 60000, 'Construction company, needs follow up', 'u5555555-5555-5555-5555-555555555555'),

('c0000000-0000-0000-0000-000000000000', 'Lisa Kim', 'Fashion Forward', 'lisa@fashionforward.com', '+1234567899', '+1234567899', '333 Style Blvd, NYC', 'warm', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'u4444444-4444-4444-4444-444444444444', 'u3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 110000, 'Fashion retailer interested in customer analytics', 'u4444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Insert demo customer-product relationships
INSERT INTO public.customer_products (customer_id, product_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222'), -- TechCorp -> CRM Enterprise
('c1111111-1111-1111-1111-111111111111', 'p6666666-6666-6666-6666-666666666666'), -- TechCorp -> Integration Platform
('c2222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111'), -- StartupXYZ -> CRM Pro
('c2222222-2222-2222-2222-222222222222', 'p3333333-3333-3333-3333-333333333333'), -- StartupXYZ -> Marketing Automation
('c3333333-3333-3333-3333-333333333333', 'p2222222-2222-2222-2222-222222222222'), -- ManufacturingPro -> CRM Enterprise
('c4444444-4444-4444-4444-444444444444', 'p2222222-2222-2222-2222-222222222222'), -- HealthCare -> CRM Enterprise
('c4444444-4444-4444-4444-444444444444', 'p5555555-5555-5555-5555-555555555555'), -- HealthCare -> Support Suite
('c5555555-5555-5555-5555-555555555555', 'p1111111-1111-1111-1111-111111111111'), -- Global Trading -> CRM Pro
('c6666666-6666-6666-6666-666666666666', 'p1111111-1111-1111-1111-111111111111'), -- RetailChain -> CRM Pro
('c6666666-6666-6666-6666-666666666666', 'p4444444-4444-4444-4444-444444444444'), -- RetailChain -> Sales Analytics
('c7777777-7777-7777-7777-777777777777', 'p1111111-1111-1111-1111-111111111111'), -- Restaurant -> CRM Pro
('c8888888-8888-8888-8888-888888888888', 'p1111111-1111-1111-1111-111111111111'), -- TechStart -> CRM Pro
('c8888888-8888-8888-8888-888888888888', 'p3333333-3333-3333-3333-333333333333'), -- TechStart -> Marketing Automation
('c9999999-9999-9999-9999-999999999999', 'p1111111-1111-1111-1111-111111111111'), -- Construction -> CRM Pro
('c0000000-0000-0000-0000-000000000000', 'p1111111-1111-1111-1111-111111111111'), -- Fashion -> CRM Pro
('c0000000-0000-0000-0000-000000000000', 'p4444444-4444-4444-4444-444444444444')  -- Fashion -> Sales Analytics
ON CONFLICT (customer_id, product_id) DO NOTHING;

-- Insert demo interactions
INSERT INTO public.interactions (id, customer_id, user_id, type, notes, status, due_date, completed_at) VALUES
('i1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'u4444444-4444-4444-4444-444444444444', 'call', 'Initial discovery call - discussed enterprise requirements', 'done', '2024-01-15 10:00:00', '2024-01-15 10:30:00'),
('i2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'u4444444-4444-4444-4444-444444444444', 'meeting', 'Demo presentation scheduled for next week', 'pending', '2024-01-25 14:00:00', NULL),
('i3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'u5555555-5555-5555-5555-555555555555', 'email', 'Sent pricing information and feature comparison', 'done', '2024-01-18 09:00:00', '2024-01-18 09:15:00'),
('i4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'u5555555-5555-5555-5555-555555555555', 'whatsapp', 'Follow up on pricing questions', 'pending', '2024-01-26 11:00:00', NULL),
('i5555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333', 'u4444444-4444-4444-4444-444444444444', 'call', 'Initial contact - manufacturing industry discussion', 'done', '2024-01-20 15:00:00', '2024-01-20 15:45:00'),
('i6666666-6666-6666-6666-666666666666', 'c4444444-4444-4444-4444-444444444444', 'u4444444-4444-4444-4444-444444444444', 'meeting', 'Contract negotiation meeting', 'done', '2024-01-22 10:00:00', '2024-01-22 11:30:00'),
('i7777777-7777-7777-7777-777777777777', 'c5555555-5555-5555-5555-555555555555', 'u5555555-5555-5555-5555-555555555555', 'call', 'Cold call - initial introduction', 'done', '2024-01-10 14:00:00', '2024-01-10 14:20:00'),
('i8888888-8888-8888-8888-888888888888', 'c5555555-5555-5555-5555-555555555555', 'u5555555-5555-5555-5555-555555555555', 'email', 'Send follow up email with company brochure', 'overdue', '2024-01-23 10:00:00', NULL),
('i9999999-9999-9999-9999-999999999999', 'c6666666-6666-6666-6666-666666666666', 'u4444444-4444-4444-4444-444444444444', 'whatsapp', 'Quick check-in about retail requirements', 'pending', '2024-01-27 16:00:00', NULL),
('i0000000-0000-0000-0000-000000000000', 'c8888888-8888-8888-8888-888888888888', 'u4444444-4444-4444-4444-444444444444', 'meeting', 'Product demo for Berlin startup', 'pending', '2024-01-28 13:00:00', NULL),
('i1010101-1010-1010-1010-101010101010', 'c7777777-7777-7777-7777-777777777777', 'u5555555-5555-5555-5555-555555555555', 'call', 'Discussed restaurant chain CRM needs', 'done', '2024-01-19 11:00:00', '2024-01-19 11:30:00'),
('i2020202-2020-2020-2020-202020202020', 'c9999999-9999-9999-9999-999999999999', 'u5555555-5555-5555-5555-555555555555', 'followup', 'Need to reconnect with construction company', 'overdue', '2024-01-21 09:00:00', NULL),
('i3030303-3030-3030-3030-303030303030', 'c0000000-0000-0000-0000-000000000000', 'u4444444-4444-4444-4444-444444444444', 'email', 'Sent case studies from other fashion retailers', 'done', '2024-01-24 14:00:00', '2024-01-24 14:10:00')
ON CONFLICT (id) DO NOTHING;