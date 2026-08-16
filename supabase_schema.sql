-- ========================================================
-- FISH MART — SUPABASE DATABASE SCHEMA & AUTO-SEEDING SQL
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ========================================================

-- 1. Create Seafood Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  weights JSONB[] DEFAULT '{}',
  cutting_options TEXT[] DEFAULT '{}',
  stock INT DEFAULT 50,
  badge TEXT,
  net_weight TEXT,
  gross_weight TEXT,
  pieces TEXT,
  delivery_time TEXT DEFAULT 'Today in 90 mins',
  rating NUMERIC DEFAULT 4.8,
  reviews_count INT DEFAULT 120,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Customer Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT DEFAULT ('FM' || FLOOR(10000000 + RANDOM() * 90000000)::TEXT),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_slot TEXT DEFAULT 'ASAP',
  payment_method TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  items JSONB[] NOT NULL,
  status TEXT DEFAULT 'PLACED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies
-- Allow anyone to read active products
CREATE POLICY "Allow public product read" ON public.products
  FOR SELECT USING (is_active = TRUE);

-- Allow authenticated users & guests to insert orders
CREATE POLICY "Allow order creation" ON public.orders
  FOR INSERT WITH CHECK (TRUE);

-- Allow users to view their own orders
CREATE POLICY "Allow users to view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- 5. Seed Initial Seafood Products into Supabase
INSERT INTO public.products (name, description, category, images, weights, cutting_options, stock, badge, net_weight, gross_weight, pieces, rating, reviews_count)
VALUES
  (
    'Seer Fish (Surmai) Medium - Steak Cut',
    'Cleaned, descaled & cut into firm steaks. Known for its firm texture & rich flavor. Best for Surmai Fry and coastal curries.',
    'Sea Fish',
    ARRAY['https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'],
    ARRAY['{"label": "300g (Net Wt: 300g)", "price": 449}'::jsonb, '{"label": "500g (Net Wt: 500g)", "price": 699}'::jsonb],
    ARRAY['Steak Cut', 'Curry Cut', 'Boneless Cubes'],
    45,
    'Bestseller',
    '300g',
    '450g',
    '4-6 Pcs',
    4.9,
    1420
  ),
  (
    'White Pomfret - Whole Cleaned & Gutted',
    'Delicate texture, mild sweet taste. Descaled, degutted and thoroughly cleaned. Ideal for Tandoori Pomfret fry or Goan Fish Curry.',
    'Sea Fish',
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'],
    ARRAY['{"label": "350g (Net Wt: 350g)", "price": 599}'::jsonb],
    ARRAY['Whole Cleaned', 'Fry Cut'],
    30,
    'Top Rated',
    '350g',
    '500g',
    '2 Pcs',
    4.8,
    980
  ),
  (
    'Freshwater Large Prawns - Cleaned & Deveined',
    'Juicy, tender prawns completely cleaned, deshelled, and deveined. Ready to cook immediately for Prawn Butter Masala.',
    'Prawns & Shrimps',
    ARRAY['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80'],
    ARRAY['{"label": "250g (Net Wt: 250g)", "price": 379}'::jsonb],
    ARRAY['Cleaned & Deveined', 'Tail On'],
    60,
    'Bestseller',
    '250g',
    '400g',
    '15-20 Pcs',
    4.9,
    2150
  )
ON CONFLICT DO NOTHING;
