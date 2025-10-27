import { createClient } from '@supabase/supabase-js'

// Get environment variables (loaded by Next.js automatically)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDemoUser() {
  console.log('Creating demo user profile...')

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: 'demo-user-123',
      email: 'demo@example.com',
      full_name: 'Demo User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error('Error creating demo user:', error)
    process.exit(1)
  }

  console.log('✅ Demo user created successfully!')
  console.log('User ID: demo-user-123')
  console.log('Email: demo@example.com')
}

setupDemoUser()
