import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Browser-side Supabase client
 * Use this in client components and browser-side code
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // IMPORTANT: We're NOT using Supabase Auth
    // This app uses WordPress authentication
    persistSession: false,
    autoRefreshToken: false,
  },
})
