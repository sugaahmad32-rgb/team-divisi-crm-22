-- Create demo customers and interactions using existing superadmin user
DO $$
DECLARE
    superadmin_user_id UUID := '9584e6ba-9f63-431b-9a3b-004c3e222a3d';
    sales_div_id UUID;
    ops_div_id UUID;
    website_source_id UUID;
    social_source_id UUID;
    referral_source_id UUID;
    crm_product_id UUID;
    support_product_id UUID;
    consultation_product_id UUID;
    customer_id UUID;
BEGIN
    -- Get division IDs
    SELECT id INTO sales_div_id FROM divisions WHERE name = 'Sales & Marketing' LIMIT 1;
    SELECT id INTO ops_div_id FROM divisions WHERE name = 'Operations' LIMIT 1;
    
    -- Get source IDs
    SELECT id INTO website_source_id FROM sources WHERE name = 'Website' LIMIT 1;
    SELECT id INTO social_source_id FROM sources WHERE name = 'Social Media' LIMIT 1;
    SELECT id INTO referral_source_id FROM sources WHERE name = 'Referral' LIMIT 1;
    
    -- Get product IDs
    SELECT id INTO crm_product_id FROM products WHERE name = 'CRM Software License' LIMIT 1;
    SELECT id INTO support_product_id FROM products WHERE name = 'Support Package' LIMIT 1;
    SELECT id INTO consultation_product_id FROM products WHERE name = 'Consultation Service' LIMIT 1;

    -- Insert demo customers
    INSERT INTO public.customers (name, company, email, phone, whatsapp, address, status, source_id, assigned_to_user_id, division_id, estimation_value, description, created_by_user_id) VALUES
    ('Robert Johnson', 'TechCorp Inc', 'robert@techcorp.com', '+1234567890', '+1234567890', '123 Tech Street, Silicon Valley', 'hot', website_source_id, superadmin_user_id, sales_div_id, 150000, 'Large tech company looking for enterprise CRM solution', superadmin_user_id),
    
    ('Maria Garcia', 'StartupXYZ', 'maria@startupxyz.com', '+1234567891', '+1234567891', '456 Innovation Ave, Austin', 'warm', social_source_id, superadmin_user_id, ops_div_id, 75000, 'Growing startup needs scalable CRM', superadmin_user_id),
    
    ('David Chen', 'ManufacturingPro', 'david@manufacturingpro.com', '+1234567892', '+1234567892', '789 Industrial Blvd, Detroit', 'new', referral_source_id, superadmin_user_id, sales_div_id, 200000, 'Manufacturing company exploring CRM options', superadmin_user_id),
    
    ('Jennifer Smith', 'HealthCare Solutions', 'jennifer@healthcare.com', '+1234567893', '+1234567893', '321 Medical Center Dr, Boston', 'deal', website_source_id, superadmin_user_id, sales_div_id, 300000, 'Healthcare provider ready to close CRM deal', superadmin_user_id),
    
    ('Ahmed Al-Rashid', 'Global Trading Co', 'ahmed@globaltrading.com', '+1234567894', '+1234567894', '654 Trade Plaza, Dubai', 'cold', website_source_id, superadmin_user_id, ops_div_id, 50000, 'International trading company, initial contact', superadmin_user_id),
    
    ('Emma Thompson', 'RetailChain Ltd', 'emma@retailchain.com', '+1234567895', '+1234567895', '987 Retail Park, London', 'warm', social_source_id, superadmin_user_id, sales_div_id, 120000, 'Retail chain looking to improve customer management', superadmin_user_id),
    
    ('Carlos Rodriguez', 'Restaurant Group', 'carlos@restaurantgroup.com', '+1234567896', '+1234567896', '555 Food Court, Miami', 'new', referral_source_id, superadmin_user_id, ops_div_id, 80000, 'Restaurant chain needs customer loyalty system', superadmin_user_id),
    
    ('Sophie Mueller', 'TechStart Berlin', 'sophie@techstart.com', '+1234567897', '+1234567897', '111 Startup Str, Berlin', 'hot', website_source_id, superadmin_user_id, sales_div_id, 90000, 'Berlin-based tech startup, very interested', superadmin_user_id),
    
    ('Michael O''Connor', 'Construction Plus', 'michael@constructionplus.com', '+1234567898', '+1234567898', '222 Build Ave, Chicago', 'cold', social_source_id, superadmin_user_id, ops_div_id, 60000, 'Construction company, needs follow up', superadmin_user_id),
    
    ('Lisa Kim', 'Fashion Forward', 'lisa@fashionforward.com', '+1234567899', '+1234567899', '333 Style Blvd, NYC', 'warm', referral_source_id, superadmin_user_id, sales_div_id, 110000, 'Fashion retailer interested in customer analytics', superadmin_user_id);

    -- Get the first customer ID for interactions
    SELECT id INTO customer_id FROM customers WHERE email = 'robert@techcorp.com' LIMIT 1;

    -- Insert demo interactions
    INSERT INTO public.interactions (customer_id, user_id, type, notes, status, due_date, completed_at) VALUES
    (customer_id, superadmin_user_id, 'call', 'Initial discovery call - discussed enterprise requirements', 'done', '2024-01-15 10:00:00', '2024-01-15 10:30:00'),
    (customer_id, superadmin_user_id, 'meeting', 'Demo presentation scheduled', 'pending', '2024-01-25 14:00:00', NULL);

    -- Add customer-product relationships
    INSERT INTO public.customer_products (customer_id, product_id) VALUES
    (customer_id, crm_product_id),
    (customer_id, support_product_id);

    -- Get other customer IDs and add more interactions
    FOR customer_id IN (SELECT id FROM customers WHERE email IN ('maria@startupxyz.com', 'david@manufacturingpro.com') LIMIT 2)
    LOOP
        INSERT INTO public.interactions (customer_id, user_id, type, notes, status, due_date) VALUES
        (customer_id, superadmin_user_id, 'email', 'Sent pricing information and follow-up materials', 'done', '2024-01-20 09:00:00'),
        (customer_id, superadmin_user_id, 'followup', 'Schedule follow-up meeting', 'pending', '2024-01-28 10:00:00');
    END LOOP;

END $$;