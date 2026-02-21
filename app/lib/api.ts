import { supabase } from "./supabase";
import type {
  AffiliateWallet,
  Product,
  Profile,
  WithdrawalRequest,
} from "../types";

// --- Admin / General Product Functions ---

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// --- Admin Withdrawal Functions ---

export async function getAllWithdrawalRequests() {
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .select("*, profile:profiles(full_name, email)")
    .order("requested_at", { ascending: false });

  if (error) throw error;
  return data as (WithdrawalRequest & {
    profile: { full_name: string; email: string };
  })[];
}

export async function updateWithdrawalStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .update({ status, processed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- Admin Affiliate Functions ---

export async function getAffiliates(page: number = 1, limit: number = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("role", "affiliate")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return {
    data: data as Profile[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function updateAffiliateStatus(
  id: string,
  status: Profile["status"],
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// --- Affiliate Functions ---

export async function getAffiliateProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_affiliate_enabled", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getAffiliateLink(productId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("affiliate_links")
    .select("*")
    .eq("product_id", productId)
    .eq("affiliate_id", user.id)
    .single();

  // It's okay if no link exists yet, returning null/error is handled by caller
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function generateAffiliateLink(productId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Simple unique code generation
  const uniqueCode = Math.random().toString(36).substring(2, 10);

  const { data, error } = await supabase
    .from("affiliate_links")
    .insert([
      {
        affiliate_id: user.id,
        product_id: productId,
        unique_code: uniqueCode,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWallet() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("affiliate_wallets")
    .select("*")
    .eq("affiliate_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as AffiliateWallet | null;
}

export async function getStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Get links first
  const { data: links } = await supabase
    .from("affiliate_links")
    .select("id")
    .eq("affiliate_id", user.id);

  const linkIds = links?.map((l) => l.id) || [];

  if (linkIds.length === 0) {
    return { clicks: 0, conversions: 0 };
  }

  const { count: clicks } = await supabase
    .from("affiliate_clicks")
    .select("*", { count: "exact", head: true })
    .in("affiliate_link_id", linkIds);

  const { count: conversions } = await supabase
    .from("conversions")
    .select("*", { count: "exact", head: true })
    .in("affiliate_link_id", linkIds);

  return {
    clicks: clicks || 0,
    conversions: conversions || 0,
  };
}

export async function getWithdrawalRequests() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("affiliate_id", user.id)
    .order("requested_at", { ascending: false });

  if (error) throw error;
  return data as WithdrawalRequest[];
}

export async function requestWithdrawal(
  amount: number,
  method: string,
  details: any,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("withdrawal_requests")
    .insert([
      {
        affiliate_id: user.id,
        amount,
        payment_method: method,
        payment_details: details,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- Tracking Functions ---

export async function trackClick(code: string) {
  // 1. Get the link
  const { data: link, error: linkError } = await supabase
    .from("affiliate_links")
    .select("*, product:products(url)")
    .eq("unique_code", code)
    .single();

  if (linkError || !link) throw new Error("Invalid affiliate link");

  // 2. Record the click
  // For client-side, we just insert.
  await supabase.from("affiliate_clicks").insert([
    {
      affiliate_link_id: link.id,
      referer: document.referrer,
      user_agent: navigator.userAgent,
    },
  ]);

  return link;
}

export async function recordConversion(
  affiliateLinkId: string,
  amount: number,
) {
  // In a real app, this would be a secure server-side call.
  // We are exposing it here for simulation purposes ONLY.

  // We need to fetch the product associated with the link to know the correct payout amount if we want to be strict,
  // but the schema says 'payout_amount' on conversions table.
  // Ideally we fetch the product payload.

  const { data: link } = await supabase
    .from("affiliate_links")
    .select("*, product:products(payout_per_conversion, id)")
    .eq("id", affiliateLinkId)
    .single();

  if (!link || !link.product) throw new Error("Invalid link");

  const { data, error } = await supabase
    .from("conversions")
    .insert([
      {
        affiliate_link_id: affiliateLinkId,
        product_id: link.product_id, // Explicitly set if needed, or derived
        payout_amount: link.product.payout_per_conversion,
        status: "approved", // Auto-approve for simulation
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
