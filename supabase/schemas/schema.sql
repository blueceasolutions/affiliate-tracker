-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS (public profile linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'affiliate')),
  full_name TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  payout_per_conversion DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  is_affiliate_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AFFILIATE LINKS
CREATE TABLE public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  unique_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_id, product_id)
);

-- AFFILIATE CLICKS (Raw Analytics)
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_link_id UUID NOT NULL REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSIONS
CREATE TABLE public.conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_link_id UUID NOT NULL REFERENCES public.affiliate_links(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE SET NULL,
  end_user_identifier TEXT,
  payout_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AFFILIATE WALLETS
CREATE TABLE public.affiliate_wallets (
  affiliate_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_earned DECIMAL(10, 2) DEFAULT 0.00,
  total_withdrawn DECIMAL(10, 2) DEFAULT 0.00,
  available_balance DECIMAL(10, 2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WITHDRAWAL REQUESTS
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_details JSONB DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_affiliate_clicks_link ON public.affiliate_clicks(affiliate_link_id);
CREATE INDEX idx_conversions_link ON public.conversions(affiliate_link_id);
CREATE INDEX idx_conversions_status ON public.conversions(status);
CREATE INDEX idx_withdrawal_requests_affiliate ON public.withdrawal_requests(affiliate_id);

-- Wallet Logic Function
CREATE OR REPLACE FUNCTION update_wallet_on_conversion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    INSERT INTO public.affiliate_wallets (affiliate_id, total_earned, available_balance)
    SELECT
      al.affiliate_id,
      NEW.payout_amount,
      NEW.payout_amount
    FROM public.affiliate_links al
    WHERE al.id = NEW.affiliate_link_id
    ON CONFLICT (affiliate_id) DO UPDATE SET
      total_earned = affiliate_wallets.total_earned + EXCLUDED.total_earned,
      available_balance = affiliate_wallets.available_balance + EXCLUDED.available_balance,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_wallet_conversion
AFTER UPDATE ON public.conversions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_on_conversion();

-- Handle New User Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (NEW.id, NEW.email, 'affiliate', NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.affiliate_wallets (affiliate_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Note: Trigger must be created on auth.users in Supabase dashboard or via migration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
-- ROW LEVEL SECURITY
-- ------------------

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

CREATE POLICY "Admins can update any profile."
  ON public.profiles FOR UPDATE
  USING ( public.is_admin() );

-- 2. products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone."
  ON public.products FOR SELECT
  USING ( true );

CREATE POLICY "Admins can insert products."
  ON public.products FOR INSERT
  WITH CHECK ( public.is_admin() );

CREATE POLICY "Admins can update products."
  ON public.products FOR UPDATE
  USING ( public.is_admin() );

CREATE POLICY "Admins can delete products."
  ON public.products FOR DELETE
  USING ( public.is_admin() );

-- 3. affiliate_links
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own links."
  ON public.affiliate_links FOR SELECT
  USING ( auth.uid() = affiliate_id );

CREATE POLICY "Admins can view all links."
  ON public.affiliate_links FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Affiliates can create links."
  ON public.affiliate_links FOR INSERT
  WITH CHECK ( auth.uid() = affiliate_id );

CREATE POLICY "Affiliates can delete own links."
  ON public.affiliate_links FOR DELETE
  USING ( auth.uid() = affiliate_id );

CREATE POLICY "Public can view affiliate links for tracking."
  ON public.affiliate_links FOR SELECT
  USING ( true );


-- 4. affiliate_clicks
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all clicks."
  ON public.affiliate_clicks FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Affiliates view clicks for their links."
  ON public.affiliate_clicks FOR SELECT
  USING (
    affiliate_link_id IN (
      SELECT id FROM public.affiliate_links WHERE affiliate_id = auth.uid()
    )
  );

-- Insert usually happens via Edge Function (service role) or anon if public tracking
CREATE POLICY "Public can insert clicks (tracking)."
  ON public.affiliate_clicks FOR INSERT
  WITH CHECK ( true );

-- 5. conversions
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all conversions."
  ON public.conversions FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Affiliates view own conversions."
  ON public.conversions FOR SELECT
  USING (
    affiliate_link_id IN (
      SELECT id FROM public.affiliate_links WHERE affiliate_id = auth.uid()
    )
  );

-- Insert/Update primarily by system/admin
CREATE POLICY "Admins can insert/update conversions."
  ON public.conversions FOR ALL
  USING ( public.is_admin() );

-- 6. affiliate_wallets
ALTER TABLE public.affiliate_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own wallet."
  ON public.affiliate_wallets FOR SELECT
  USING ( auth.uid() = affiliate_id );

CREATE POLICY "Admins view all wallets."
  ON public.affiliate_wallets FOR SELECT
  USING ( public.is_admin() );

-- 7. withdrawal_requests
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own requests."
  ON public.withdrawal_requests FOR SELECT
  USING ( auth.uid() = affiliate_id );

CREATE POLICY "Admins view all requests."
  ON public.withdrawal_requests FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Affiliates can create requests."
  ON public.withdrawal_requests FOR INSERT
  WITH CHECK ( auth.uid() = affiliate_id );

CREATE POLICY "Admins can update requests."
  ON public.withdrawal_requests FOR UPDATE
  USING ( public.is_admin() );

