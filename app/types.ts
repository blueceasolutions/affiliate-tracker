export interface Profile {
  id: string;
  role: "admin" | "affiliate";
  full_name: string | null;
  email: string;
  status: "active" | "suspended" | "pending";
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  url: string;
  payout_per_conversion: number;
  is_affiliate_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AffiliateLink {
  id: string;
  affiliate_id: string;
  product_id: string;
  unique_code: string;
  created_at: string;
  product?: Product; // for joined queries
}

export interface AffiliateClick {
  id: string;
  affiliate_link_id: string;
  ip_address: string | null;
  user_agent: string | null;
  referer: string | null;
  created_at: string;
}

export interface Conversion {
  id: string;
  affiliate_link_id: string | null;
  product_id: string | null;
  end_user_identifier: string | null;
  payout_amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface AffiliateWallet {
  affiliate_id: string;
  total_earned: number;
  total_withdrawn: number;
  available_balance: number;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  affiliate_id: string;
  amount: number;
  payment_method: string;
  payment_details: any;
  status: "pending" | "approved" | "paid" | "rejected";
  requested_at: string;
  processed_at: string | null;
  profile?: Profile; // for joined queries
}

export interface PaymentMethod {
  id: string;
  affiliate_id: string;
  currency: "USD" | "NGN";
  type: "bank" | "paypal" | "crypto";
  details: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AffiliateNotification {
  id: string;
  affiliate_id: string;
  title: string;
  message: string;
  is_read: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}
