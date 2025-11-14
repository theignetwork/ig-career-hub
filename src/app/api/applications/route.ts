import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'

export async function GET(request: Request) {
  try {
    // Get user ID from request headers
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const remoteType = searchParams.get('remoteType')
    const sortBy = searchParams.get('sortBy') || 'date_applied'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    let query = getSupabaseAdmin()
      .from('applications')
      .select('*')
      .eq('user_id', userId)

    // Apply filters
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,position_title.ilike.%${search}%`)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (remoteType && remoteType !== 'all') {
      query = query.eq('remote_type', remoteType)
    }

    // Apply sorting and limit
    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).limit(limit)

    const { data, error } = await query

    if (error) {
      console.error('[GET /api/applications] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications: data || [], total: data?.length || 0 })
  } catch (error) {
    console.error('[GET /api/applications] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('[POST /api/applications] Request received')
    const body = await request.json()
    console.log('[POST /api/applications] Body parsed:', Object.keys(body))

    // Get user ID from request headers
    const userId = await getServerUserId()
    console.log('[POST /api/applications] User ID:', userId ? 'present' : 'MISSING')

    if (!userId) {
      console.error('[POST /api/applications] Unauthorized - no user ID')
      return NextResponse.json({ error: 'Unauthorized - no user ID provided' }, { status: 401 })
    }

    // Ensure user profile exists (auto-create for anonymous users)
    const supabase = getSupabaseAdmin()
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      console.log('[POST /api/applications] Creating profile for new user:', userId)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: null, // Anonymous user - no email yet
          full_name: 'Anonymous User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error('[POST /api/applications] Failed to create profile:', profileError)
        // Continue anyway - the profile might have been created by another request
      } else {
        console.log('[POST /api/applications] Profile created successfully')
      }
    }

    console.log('[POST /api/applications] Inserting application for user:', userId)
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        company_name: body.company_name,
        position_title: body.position_title,
        job_url: body.job_url,
        job_description: body.job_description, // Store full job description
        location: body.location,
        salary_range: body.salary_range,
        remote_type: body.remote_type,
        status: body.status || 'applied',
        date_applied: new Date().toISOString().split('T')[0], // Today's date
        notes: body.notes,
      })
      .select()
      .single()

    if (error) {
      console.error('[POST /api/applications] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[POST /api/applications] Application created successfully:', data.id)

    // Revalidate dashboard and applications pages
    revalidatePath('/dashboard')
    revalidatePath('/applications')

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[POST /api/applications] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create application', details: errorMessage },
      { status: 500 }
    )
  }
}
