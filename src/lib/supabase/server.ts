import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdminInstance: SupabaseClient | null = null

/**
 * Server-side Supabase client with service role key
 * Use this in API routes and server components
 * Has admin privileges - bypasses RLS
 * Lazily initialized to avoid build-time errors
 */
export const getSupabaseAdmin = (): SupabaseClient => {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      // IMPORTANT: We're NOT using Supabase Auth
      // This app uses WordPress authentication
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseAdminInstance
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getSupabaseAdmin() instead for safer initialization
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient]
  }
})
