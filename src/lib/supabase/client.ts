import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

/**
 * Browser-side Supabase client
 * Use this in client components and browser-side code
 * Lazily initialized to avoid build-time errors
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // IMPORTANT: We're NOT using Supabase Auth
      // This app uses WordPress authentication
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseInstance
}

