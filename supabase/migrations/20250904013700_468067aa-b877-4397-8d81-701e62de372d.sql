-- Create demo user profiles with realistic UUIDs (these would normally be created by Supabase Auth)
-- Note: In production, these would be actual auth.users records
DO $$
DECLARE
    sales_div_id UUID;
    ops_div_id UUID;
    support_div_id UUID;
    it_div_id UUID;
    website_source_id UUID;
    social_source_id UUID;
    referral_source_id UUID;
    crm_product_id UUID;
    support_product_id UUID;
    consultation_product_id UUID;
BEGIN
    -- Get division IDs
    SELECT id INTO sales_div_id FROM divisions WHERE name = 'Sales & Marketing' LIMIT 1;
    SELECT id INTO ops_div_id FROM divisions WHERE name = 'Operations' LIMIT 1;
    SELECT id INTO support_div_id FROM divisions WHERE name = 'Customer Support' LIMIT 1;
    SELECT id INTO it_div_id FROM divisions WHERE name = 'IT & Development' LIMIT 1;
    
    -- Get source IDs
    SELECT id INTO website_source_id FROM sources WHERE name = 'Website' LIMIT 1;
    SELECT id INTO social_source_id FROM sources WHERE name = 'Social Media' LIMIT 1;
    SELECT id INTO referral_source_id FROM sources WHERE name = 'Referral' LIMIT 1;
    
    -- Get product IDs
    SELECT id INTO crm_product_id FROM products WHERE name = 'CRM Software License' LIMIT 1;
    SELECT id INTO support_product_id FROM products WHERE name = 'Support Package' LIMIT 1;
    SELECT id INTO consultation_product_id FROM products WHERE name = 'Consultation Service' LIMIT 1;

    -- Insert demo user profiles
    INSERT INTO public.profiles (user_id, display_name, email, division_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Manager', 'sarah@company.com', sales_div_id),
    ('550e8400-e29b-41d4-a716-446655440002', 'John Smith', 'john@company.com', it_div_id),
    ('550e8400-e29b-41d4-a716-446655440003', 'Lisa Wong', 'lisa@company.com', support_div_id),
    ('550e8400-e29b-41d4-a716-446655440004', 'Mike Johnson', 'mike@company.com', sales_div_id),
    ('550e8400-e29b-41d4-a716-446655440005', 'Anna Davis', 'anna@company.com', ops_div_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Insert demo user roles
    INSERT INTO public.user_roles (user_id, role, assigned_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'owner', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440002', 'manager', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440003', 'supervisor', '550e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440004', 'marketing', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440005', 'marketing', '550e8400-e29b-41d4-a716-446655440001')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Insert demo customers
    INSERT INTO public.customers (name, company, email, phone, whatsapp, address, status, source_id, assigned_to_user_id, supervisor_user_id, manager_user_id, division_id, estimation_value, description, created_by_user_id) VALUES
    ('Robert Johnson', 'TechCorp Inc', 'robert@techcorp.com', '+1234567890', '+1234567890', '123 Tech Street, Silicon Valley', 'hot', website_source_id, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', sales_div_id, 150000, 'Large tech company looking for enterprise CRM solution', '550e8400-e29b-41d4-a716-446655440004'),
    
    ('Maria Garcia', 'StartupXYZ', 'maria@startupxyz.com', '+1234567891', '+1234567891', '456 Innovation Ave, Austin', 'warm', social_source_id, '550e8400-e29b-41d4-a716-446655440005', NULL, '550e8400-e29b-41d4-a716-446655440001', ops_div_id, 75000, 'Growing startup needs scalable CRM', '550e8400-e29b-41d4-a716-446655440005'),
    
    ('David Chen', 'ManufacturingPro', 'david@manufacturingpro.com', '+1234567892', '+1234567892', '789 Industrial Blvd, Detroit', 'new', referral_source_id, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', sales_div_id, 200000, 'Manufacturing company exploring CRM options', '550e8400-e29b-41d4-a716-446655440004'),
    
    ('Jennifer Smith', 'HealthCare Solutions', 'jennifer@healthcare.com', '+1234567893', '+1234567893', '321 Medical Center Dr, Boston', 'deal', website_source_id, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', sales_div_id, 300000, 'Healthcare provider ready to close CRM deal', '550e8400-e29b-41d4-a716-446655440004'),
    
    ('Ahmed Al-Rashid', 'Global Trading Co', 'ahmed@globaltrading.com', '+1234567894', '+1234567894', '654 Trade Plaza, Dubai', 'cold', website_source_id, '550e8400-e29b-41d4-a716-446655440005', NULL, '550e8400-e29b-41d4-a716-446655440001', ops_div_id, 50000, 'International trading company, initial contact', '550e8400-e29b-41d4-a716-446655440005'),
    
    ('Emma Thompson', 'RetailChain Ltd', 'emma@retailchain.com', '+1234567895', '+1234567895', '987 Retail Park, London', 'warm', social_source_id, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', sales_div_id, 120000, 'Retail chain looking to improve customer management', '550e8400-e29b-41d4-a716-446655440004'),
    
    ('Carlos Rodriguez', 'Restaurant Group', 'carlos@restaurantgroup.com', '+1234567896', '+1234567896', '555 Food Court, Miami', 'new', referral_source_id, '550e8400-e29b-41d4-a716-446655440005', NULL, '550e8400-e29b-41d4-a716-446655440001', ops_div_id, 80000, 'Restaurant chain needs customer loyalty system', '550e8400-e29b-41d4-a716-446655440005'),
    
    ('Sophie Mueller', 'TechStart Berlin', 'sophie@techstart.com', '+1234567897', '+1234567897', '111 Startup Str, Berlin', 'hot', website_source_id, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', sales_div_id, 90000, 'Berlin-based tech startup, very interested', '550e8400-e29b-41d4-a716-446655440004'),
    
    ('Michael O''Connor', 'Construction Plus', 'michael@constructionplus.com', '+1234567898', '+1234567898', '222 Build Ave, Chicago', 'cold', social_source_id, '550e8400-e29b-41d4-a716-446655440005', NULL, '550e8400-e29b-41d4-a716-446655440001', ops_div_id, 60000, 'Construction company, needs follow up', '550e8400-e29b-41d4-a716-446655440005'),
    
    ('Lisa Kim', 'Fashion Forward', 'lisa@fashionforward.com', '+1234567899', '+1234567899', '333 Style Blvd, NYC', 'warm', referral_source_id, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', sales_div_id, 110000, 'Fashion retailer interested in customer analytics', '550e8400-e29b-41d4-a716-446655440004');

END $$;