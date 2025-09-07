-- Add foreign key constraints for better data integrity and nested select support

-- Add foreign key from profiles.division_id to divisions.id
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_division 
FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE SET NULL;

-- Add foreign key from user_roles.user_id to profiles.user_id  
ALTER TABLE public.user_roles
ADD CONSTRAINT fk_user_roles_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key from customers to various user tables for better referential integrity
ALTER TABLE public.customers
ADD CONSTRAINT fk_customers_assigned_to
FOREIGN KEY (assigned_to_user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

ALTER TABLE public.customers  
ADD CONSTRAINT fk_customers_created_by
FOREIGN KEY (created_by_user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

ALTER TABLE public.customers
ADD CONSTRAINT fk_customers_supervisor  
FOREIGN KEY (supervisor_user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

ALTER TABLE public.customers
ADD CONSTRAINT fk_customers_manager
FOREIGN KEY (manager_user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

ALTER TABLE public.customers
ADD CONSTRAINT fk_customers_division
FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE SET NULL;

ALTER TABLE public.customers
ADD CONSTRAINT fk_customers_source
FOREIGN KEY (source_id) REFERENCES public.sources(id) ON DELETE SET NULL;

-- Add foreign key from interactions to customers and profiles
ALTER TABLE public.interactions
ADD CONSTRAINT fk_interactions_customer
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

ALTER TABLE public.interactions  
ADD CONSTRAINT fk_interactions_user
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;