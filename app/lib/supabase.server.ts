import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL
// Using the service role key is strictly required for backend endpoints (like webhooks)
// so they can bypass RLS without needing an authenticated user session.
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Webhooks require this to bypass RLS.',
  )
}

export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
)
