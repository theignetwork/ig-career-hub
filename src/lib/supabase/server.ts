import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Server-side Supabase client with service role key
 * Use this in API routes and server components
 * Has admin privileges - bypasses RLS
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // IMPORTANT: We're NOT using Supabase Auth
    // This app uses WordPress authentication
    persistSession: false,
    autoRefreshToken: false,
  },
})
