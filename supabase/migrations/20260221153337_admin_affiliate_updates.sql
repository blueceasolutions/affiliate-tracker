
  create table "public"."admin_notifications" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "type" text not null,
    "message" text not null,
    "is_read" boolean default false,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."admin_notifications" enable row level security;


  create table "public"."affiliate_clicks" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "affiliate_link_id" uuid not null,
    "ip_address" text,
    "user_agent" text,
    "referer" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."affiliate_clicks" enable row level security;


  create table "public"."affiliate_links" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "affiliate_id" uuid not null,
    "product_id" uuid not null,
    "unique_code" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."affiliate_links" enable row level security;


  create table "public"."affiliate_wallets" (
    "affiliate_id" uuid not null,
    "total_earned" numeric(10,2) default 0.00,
    "total_withdrawn" numeric(10,2) default 0.00,
    "available_balance" numeric(10,2) default 0.00,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."affiliate_wallets" enable row level security;


  create table "public"."conversions" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "affiliate_link_id" uuid not null,
    "product_id" uuid not null,
    "end_user_identifier" text,
    "payout_amount" numeric(10,2) not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."conversions" enable row level security;


  create table "public"."products" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "url" text not null,
    "payout_per_conversion" numeric(10,2) not null default 0.00,
    "is_affiliate_enabled" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."products" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "role" text not null,
    "full_name" text,
    "email" text not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."withdrawal_requests" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "affiliate_id" uuid not null,
    "amount" numeric(10,2) not null,
    "payment_method" text not null,
    "payment_details" jsonb default '{}'::jsonb,
    "status" text not null default 'pending'::text,
    "requested_at" timestamp with time zone default now(),
    "processed_at" timestamp with time zone
      );


alter table "public"."withdrawal_requests" enable row level security;

CREATE UNIQUE INDEX admin_notifications_pkey ON public.admin_notifications USING btree (id);

CREATE UNIQUE INDEX affiliate_clicks_pkey ON public.affiliate_clicks USING btree (id);

CREATE UNIQUE INDEX affiliate_links_affiliate_id_product_id_key ON public.affiliate_links USING btree (affiliate_id, product_id);

CREATE UNIQUE INDEX affiliate_links_pkey ON public.affiliate_links USING btree (id);

CREATE UNIQUE INDEX affiliate_links_unique_code_key ON public.affiliate_links USING btree (unique_code);

CREATE UNIQUE INDEX affiliate_wallets_pkey ON public.affiliate_wallets USING btree (affiliate_id);

CREATE UNIQUE INDEX conversions_pkey ON public.conversions USING btree (id);

CREATE INDEX idx_affiliate_clicks_link ON public.affiliate_clicks USING btree (affiliate_link_id);

CREATE INDEX idx_conversions_link ON public.conversions USING btree (affiliate_link_id);

CREATE INDEX idx_conversions_status ON public.conversions USING btree (status);

CREATE INDEX idx_withdrawal_requests_affiliate ON public.withdrawal_requests USING btree (affiliate_id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX withdrawal_requests_pkey ON public.withdrawal_requests USING btree (id);

alter table "public"."admin_notifications" add constraint "admin_notifications_pkey" PRIMARY KEY using index "admin_notifications_pkey";

alter table "public"."affiliate_clicks" add constraint "affiliate_clicks_pkey" PRIMARY KEY using index "affiliate_clicks_pkey";

alter table "public"."affiliate_links" add constraint "affiliate_links_pkey" PRIMARY KEY using index "affiliate_links_pkey";

alter table "public"."affiliate_wallets" add constraint "affiliate_wallets_pkey" PRIMARY KEY using index "affiliate_wallets_pkey";

alter table "public"."conversions" add constraint "conversions_pkey" PRIMARY KEY using index "conversions_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."withdrawal_requests" add constraint "withdrawal_requests_pkey" PRIMARY KEY using index "withdrawal_requests_pkey";

alter table "public"."affiliate_clicks" add constraint "affiliate_clicks_affiliate_link_id_fkey" FOREIGN KEY (affiliate_link_id) REFERENCES public.affiliate_links(id) ON DELETE CASCADE not valid;

alter table "public"."affiliate_clicks" validate constraint "affiliate_clicks_affiliate_link_id_fkey";

alter table "public"."affiliate_links" add constraint "affiliate_links_affiliate_id_fkey" FOREIGN KEY (affiliate_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."affiliate_links" validate constraint "affiliate_links_affiliate_id_fkey";

alter table "public"."affiliate_links" add constraint "affiliate_links_affiliate_id_product_id_key" UNIQUE using index "affiliate_links_affiliate_id_product_id_key";

alter table "public"."affiliate_links" add constraint "affiliate_links_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."affiliate_links" validate constraint "affiliate_links_product_id_fkey";

alter table "public"."affiliate_links" add constraint "affiliate_links_unique_code_key" UNIQUE using index "affiliate_links_unique_code_key";

alter table "public"."affiliate_wallets" add constraint "affiliate_wallets_affiliate_id_fkey" FOREIGN KEY (affiliate_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."affiliate_wallets" validate constraint "affiliate_wallets_affiliate_id_fkey";

alter table "public"."conversions" add constraint "conversions_affiliate_link_id_fkey" FOREIGN KEY (affiliate_link_id) REFERENCES public.affiliate_links(id) ON DELETE SET NULL not valid;

alter table "public"."conversions" validate constraint "conversions_affiliate_link_id_fkey";

alter table "public"."conversions" add constraint "conversions_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."conversions" validate constraint "conversions_product_id_fkey";

alter table "public"."conversions" add constraint "conversions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."conversions" validate constraint "conversions_status_check";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['admin'::text, 'affiliate'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

alter table "public"."profiles" add constraint "profiles_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'suspended'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_status_check";

alter table "public"."withdrawal_requests" add constraint "withdrawal_requests_affiliate_id_fkey" FOREIGN KEY (affiliate_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."withdrawal_requests" validate constraint "withdrawal_requests_affiliate_id_fkey";

alter table "public"."withdrawal_requests" add constraint "withdrawal_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'paid'::text, 'rejected'::text]))) not valid;

alter table "public"."withdrawal_requests" validate constraint "withdrawal_requests_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.update_wallet_on_conversion()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

grant delete on table "public"."admin_notifications" to "anon";

grant insert on table "public"."admin_notifications" to "anon";

grant references on table "public"."admin_notifications" to "anon";

grant select on table "public"."admin_notifications" to "anon";

grant trigger on table "public"."admin_notifications" to "anon";

grant truncate on table "public"."admin_notifications" to "anon";

grant update on table "public"."admin_notifications" to "anon";

grant delete on table "public"."admin_notifications" to "authenticated";

grant insert on table "public"."admin_notifications" to "authenticated";

grant references on table "public"."admin_notifications" to "authenticated";

grant select on table "public"."admin_notifications" to "authenticated";

grant trigger on table "public"."admin_notifications" to "authenticated";

grant truncate on table "public"."admin_notifications" to "authenticated";

grant update on table "public"."admin_notifications" to "authenticated";

grant delete on table "public"."admin_notifications" to "service_role";

grant insert on table "public"."admin_notifications" to "service_role";

grant references on table "public"."admin_notifications" to "service_role";

grant select on table "public"."admin_notifications" to "service_role";

grant trigger on table "public"."admin_notifications" to "service_role";

grant truncate on table "public"."admin_notifications" to "service_role";

grant update on table "public"."admin_notifications" to "service_role";

grant delete on table "public"."affiliate_clicks" to "anon";

grant insert on table "public"."affiliate_clicks" to "anon";

grant references on table "public"."affiliate_clicks" to "anon";

grant select on table "public"."affiliate_clicks" to "anon";

grant trigger on table "public"."affiliate_clicks" to "anon";

grant truncate on table "public"."affiliate_clicks" to "anon";

grant update on table "public"."affiliate_clicks" to "anon";

grant delete on table "public"."affiliate_clicks" to "authenticated";

grant insert on table "public"."affiliate_clicks" to "authenticated";

grant references on table "public"."affiliate_clicks" to "authenticated";

grant select on table "public"."affiliate_clicks" to "authenticated";

grant trigger on table "public"."affiliate_clicks" to "authenticated";

grant truncate on table "public"."affiliate_clicks" to "authenticated";

grant update on table "public"."affiliate_clicks" to "authenticated";

grant delete on table "public"."affiliate_clicks" to "service_role";

grant insert on table "public"."affiliate_clicks" to "service_role";

grant references on table "public"."affiliate_clicks" to "service_role";

grant select on table "public"."affiliate_clicks" to "service_role";

grant trigger on table "public"."affiliate_clicks" to "service_role";

grant truncate on table "public"."affiliate_clicks" to "service_role";

grant update on table "public"."affiliate_clicks" to "service_role";

grant delete on table "public"."affiliate_links" to "anon";

grant insert on table "public"."affiliate_links" to "anon";

grant references on table "public"."affiliate_links" to "anon";

grant select on table "public"."affiliate_links" to "anon";

grant trigger on table "public"."affiliate_links" to "anon";

grant truncate on table "public"."affiliate_links" to "anon";

grant update on table "public"."affiliate_links" to "anon";

grant delete on table "public"."affiliate_links" to "authenticated";

grant insert on table "public"."affiliate_links" to "authenticated";

grant references on table "public"."affiliate_links" to "authenticated";

grant select on table "public"."affiliate_links" to "authenticated";

grant trigger on table "public"."affiliate_links" to "authenticated";

grant truncate on table "public"."affiliate_links" to "authenticated";

grant update on table "public"."affiliate_links" to "authenticated";

grant delete on table "public"."affiliate_links" to "service_role";

grant insert on table "public"."affiliate_links" to "service_role";

grant references on table "public"."affiliate_links" to "service_role";

grant select on table "public"."affiliate_links" to "service_role";

grant trigger on table "public"."affiliate_links" to "service_role";

grant truncate on table "public"."affiliate_links" to "service_role";

grant update on table "public"."affiliate_links" to "service_role";

grant delete on table "public"."affiliate_wallets" to "anon";

grant insert on table "public"."affiliate_wallets" to "anon";

grant references on table "public"."affiliate_wallets" to "anon";

grant select on table "public"."affiliate_wallets" to "anon";

grant trigger on table "public"."affiliate_wallets" to "anon";

grant truncate on table "public"."affiliate_wallets" to "anon";

grant update on table "public"."affiliate_wallets" to "anon";

grant delete on table "public"."affiliate_wallets" to "authenticated";

grant insert on table "public"."affiliate_wallets" to "authenticated";

grant references on table "public"."affiliate_wallets" to "authenticated";

grant select on table "public"."affiliate_wallets" to "authenticated";

grant trigger on table "public"."affiliate_wallets" to "authenticated";

grant truncate on table "public"."affiliate_wallets" to "authenticated";

grant update on table "public"."affiliate_wallets" to "authenticated";

grant delete on table "public"."affiliate_wallets" to "service_role";

grant insert on table "public"."affiliate_wallets" to "service_role";

grant references on table "public"."affiliate_wallets" to "service_role";

grant select on table "public"."affiliate_wallets" to "service_role";

grant trigger on table "public"."affiliate_wallets" to "service_role";

grant truncate on table "public"."affiliate_wallets" to "service_role";

grant update on table "public"."affiliate_wallets" to "service_role";

grant delete on table "public"."conversions" to "anon";

grant insert on table "public"."conversions" to "anon";

grant references on table "public"."conversions" to "anon";

grant select on table "public"."conversions" to "anon";

grant trigger on table "public"."conversions" to "anon";

grant truncate on table "public"."conversions" to "anon";

grant update on table "public"."conversions" to "anon";

grant delete on table "public"."conversions" to "authenticated";

grant insert on table "public"."conversions" to "authenticated";

grant references on table "public"."conversions" to "authenticated";

grant select on table "public"."conversions" to "authenticated";

grant trigger on table "public"."conversions" to "authenticated";

grant truncate on table "public"."conversions" to "authenticated";

grant update on table "public"."conversions" to "authenticated";

grant delete on table "public"."conversions" to "service_role";

grant insert on table "public"."conversions" to "service_role";

grant references on table "public"."conversions" to "service_role";

grant select on table "public"."conversions" to "service_role";

grant trigger on table "public"."conversions" to "service_role";

grant truncate on table "public"."conversions" to "service_role";

grant update on table "public"."conversions" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."withdrawal_requests" to "anon";

grant insert on table "public"."withdrawal_requests" to "anon";

grant references on table "public"."withdrawal_requests" to "anon";

grant select on table "public"."withdrawal_requests" to "anon";

grant trigger on table "public"."withdrawal_requests" to "anon";

grant truncate on table "public"."withdrawal_requests" to "anon";

grant update on table "public"."withdrawal_requests" to "anon";

grant delete on table "public"."withdrawal_requests" to "authenticated";

grant insert on table "public"."withdrawal_requests" to "authenticated";

grant references on table "public"."withdrawal_requests" to "authenticated";

grant select on table "public"."withdrawal_requests" to "authenticated";

grant trigger on table "public"."withdrawal_requests" to "authenticated";

grant truncate on table "public"."withdrawal_requests" to "authenticated";

grant update on table "public"."withdrawal_requests" to "authenticated";

grant delete on table "public"."withdrawal_requests" to "service_role";

grant insert on table "public"."withdrawal_requests" to "service_role";

grant references on table "public"."withdrawal_requests" to "service_role";

grant select on table "public"."withdrawal_requests" to "service_role";

grant trigger on table "public"."withdrawal_requests" to "service_role";

grant truncate on table "public"."withdrawal_requests" to "service_role";

grant update on table "public"."withdrawal_requests" to "service_role";


  create policy "Admins can update notifications."
  on "public"."admin_notifications"
  as permissive
  for update
  to public
using (public.is_admin());



  create policy "Admins view all notifications."
  on "public"."admin_notifications"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Admins view all clicks."
  on "public"."affiliate_clicks"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Affiliates view clicks for their links."
  on "public"."affiliate_clicks"
  as permissive
  for select
  to public
using ((affiliate_link_id IN ( SELECT affiliate_links.id
   FROM public.affiliate_links
  WHERE (affiliate_links.affiliate_id = auth.uid()))));



  create policy "Public can insert clicks (tracking)."
  on "public"."affiliate_clicks"
  as permissive
  for insert
  to public
with check (true);



  create policy "Admins can view all links."
  on "public"."affiliate_links"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Affiliates can create links."
  on "public"."affiliate_links"
  as permissive
  for insert
  to public
with check ((auth.uid() = affiliate_id));



  create policy "Affiliates can delete own links."
  on "public"."affiliate_links"
  as permissive
  for delete
  to public
using ((auth.uid() = affiliate_id));



  create policy "Affiliates can view own links."
  on "public"."affiliate_links"
  as permissive
  for select
  to public
using ((auth.uid() = affiliate_id));



  create policy "Public can view affiliate links for tracking."
  on "public"."affiliate_links"
  as permissive
  for select
  to public
using (true);



  create policy "Admins view all wallets."
  on "public"."affiliate_wallets"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Affiliates view own wallet."
  on "public"."affiliate_wallets"
  as permissive
  for select
  to public
using ((auth.uid() = affiliate_id));



  create policy "Admins can insert/update conversions."
  on "public"."conversions"
  as permissive
  for all
  to public
using (public.is_admin());



  create policy "Admins view all conversions."
  on "public"."conversions"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Affiliates view own conversions."
  on "public"."conversions"
  as permissive
  for select
  to public
using ((affiliate_link_id IN ( SELECT affiliate_links.id
   FROM public.affiliate_links
  WHERE (affiliate_links.affiliate_id = auth.uid()))));



  create policy "Admins can delete products."
  on "public"."products"
  as permissive
  for delete
  to public
using (public.is_admin());



  create policy "Admins can insert products."
  on "public"."products"
  as permissive
  for insert
  to public
with check (public.is_admin());



  create policy "Admins can update products."
  on "public"."products"
  as permissive
  for update
  to public
using (public.is_admin());



  create policy "Products are viewable by everyone."
  on "public"."products"
  as permissive
  for select
  to public
using (true);



  create policy "Admins can update any profile."
  on "public"."profiles"
  as permissive
  for update
  to public
using (public.is_admin());



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert their own profile."
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update own profile."
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Admins can update requests."
  on "public"."withdrawal_requests"
  as permissive
  for update
  to public
using (public.is_admin());



  create policy "Admins view all requests."
  on "public"."withdrawal_requests"
  as permissive
  for select
  to public
using (public.is_admin());



  create policy "Affiliates can create requests."
  on "public"."withdrawal_requests"
  as permissive
  for insert
  to public
with check ((auth.uid() = affiliate_id));



  create policy "Affiliates view own requests."
  on "public"."withdrawal_requests"
  as permissive
  for select
  to public
using ((auth.uid() = affiliate_id));


CREATE TRIGGER trg_update_wallet_conversion AFTER INSERT OR UPDATE ON public.conversions FOR EACH ROW EXECUTE FUNCTION public.update_wallet_on_conversion();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


