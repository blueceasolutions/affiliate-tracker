-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS (public profile linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'affiliate')),
  full_name TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  unique_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_id, product_id)
);

-- AFFILIATE CLICKS (Raw Analytics)
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_link_id UUID NOT NULL REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSIONS
CREATE TABLE public.conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- PAYMENT METHODS
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'NGN')),
  type TEXT NOT NULL CHECK (type IN ('bank', 'paypal', 'crypto')),
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WITHDRAWAL REQUESTS
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_details JSONB DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ADMIN NOTIFICATIONS
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_affiliate_clicks_link ON public.affiliate_clicks(affiliate_link_id);
CREATE INDEX idx_conversions_link ON public.conversions(affiliate_link_id);
CREATE INDEX idx_conversions_status ON public.conversions(status);
CREATE INDEX idx_withdrawal_requests_affiliate ON public.withdrawal_requests(affiliate_id);
CREATE INDEX idx_payment_methods_affiliate ON public.payment_methods(affiliate_id);

-- Wallet Logic Function
CREATE OR REPLACE FUNCTION update_wallet_on_conversion()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'approved') OR (TG_OP = 'UPDATE' AND NEW.status = 'approved' AND OLD.status != 'approved') THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_wallet_conversion ON public.conversions;
CREATE TRIGGER trg_update_wallet_conversion
AFTER INSERT OR UPDATE ON public.conversions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_on_conversion();

-- Withdrawal Wallet Logic Function
CREATE OR REPLACE FUNCTION check_and_deduct_withdrawal_request()
RETURNS TRIGGER AS $$
DECLARE
  available_bal DECIMAL(10, 2);
BEGIN
  -- Get current available balance
  SELECT available_balance INTO available_bal
  FROM public.affiliate_wallets
  WHERE affiliate_id = NEW.affiliate_id;

  IF NEW.amount < 10 THEN
    RAISE EXCEPTION 'Minimum withdrawal amount is $10.';
  END IF;

  IF available_bal < NEW.amount THEN
    RAISE EXCEPTION 'Insufficient balance for withdrawal.';
  END IF;

  -- Deduct on insert
  UPDATE public.affiliate_wallets
  SET 
    available_balance = available_balance - NEW.amount,
    updated_at = NOW()
  WHERE affiliate_id = NEW.affiliate_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_check_deduct_withdrawal_request ON public.withdrawal_requests;
CREATE TRIGGER trg_check_deduct_withdrawal_request
BEFORE INSERT ON public.withdrawal_requests
FOR EACH ROW
EXECUTE FUNCTION check_and_deduct_withdrawal_request();

CREATE OR REPLACE FUNCTION update_wallet_on_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  -- If paid, increment total_withdrawn. available_balance was already deducted.
  IF TG_OP = 'UPDATE' AND NEW.status = 'paid' AND OLD.status != 'paid' THEN
    UPDATE public.affiliate_wallets
    SET 
      total_withdrawn = total_withdrawn + NEW.amount,
      updated_at = NOW()
    WHERE affiliate_id = NEW.affiliate_id;
  END IF;

  -- If rejected, add the amount back to available_balance
  IF TG_OP = 'UPDATE' AND NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE public.affiliate_wallets
    SET 
      available_balance = available_balance + NEW.amount,
      updated_at = NOW()
    WHERE affiliate_id = NEW.affiliate_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_wallet_withdrawal ON public.withdrawal_requests;
CREATE TRIGGER trg_update_wallet_withdrawal
AFTER UPDATE ON public.withdrawal_requests
FOR EACH ROW
EXECUTE FUNCTION update_wallet_on_withdrawal();

-- Handle New User Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, status)
  VALUES (NEW.id, NEW.email, 'affiliate', NEW.raw_user_meta_data->>'full_name', 'pending');
  
  INSERT INTO public.affiliate_wallets (affiliate_id) VALUES (NEW.id);
  
  INSERT INTO public.admin_notifications (type, message, metadata)
  VALUES ('new_affiliate', 'New affiliate signed up: ' || NEW.email, jsonb_build_object('user_id', NEW.id, 'email', NEW.email));

  -- We can also optionally trigger an http POST or use a database webhook extension (pg_net) to call the Deno Edge Function here
  -- For now, the webhook/email alert can be set up via Supabase Database Webhooks connecting to the admin_notifications insert event.

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

-- 8. payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own payment methods."
  ON public.payment_methods FOR SELECT
  USING ( auth.uid() = affiliate_id );

CREATE POLICY "Admins view all payment methods."
  ON public.payment_methods FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Affiliates can create payment methods."
  ON public.payment_methods FOR INSERT
  WITH CHECK ( auth.uid() = affiliate_id );

CREATE POLICY "Affiliates can update own payment methods."
  ON public.payment_methods FOR UPDATE
  USING ( auth.uid() = affiliate_id );

CREATE POLICY "Affiliates can delete own payment methods."
  ON public.payment_methods FOR DELETE
  USING ( auth.uid() = affiliate_id );

-- 9. admin_notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all notifications."
  ON public.admin_notifications FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Admins can update notifications."
  ON public.admin_notifications FOR UPDATE
  USING ( public.is_admin() );

-- Note: Insert happens via the database trigger (security definer) which bypasses RLS
