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
    const body = await request.json()

    // Get user ID from request headers
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await getSupabaseAdmin()
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
      console.error('[POST /api/applications] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate dashboard and applications pages
    revalidatePath('/dashboard')
    revalidatePath('/applications')

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[POST /api/applications] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
