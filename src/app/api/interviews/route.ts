import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // TODO: Get user ID from session/auth
    const userId = 'demo-user-123'

    const body = await request.json()
    const { application_id, interview_date, interview_type, notes, prepared } = body

    const { data, error } = await supabaseAdmin
      .from('interviews')
      .insert({
        user_id: userId,
        application_id,
        interview_date,
        interview_type,
        notes,
        prepared: prepared || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        application:applications (
          company_name,
          position_title
        )
      `
      )
      .single()

    if (error) {
      console.error('[POST /api/interviews] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[POST /api/interviews] Error:', error)
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // TODO: Get user ID from session/auth
    const userId = 'demo-user-123'

    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('interviews')
      .select(
        `
        *,
        application:applications (
          company_name,
          position_title
        )
      `
      )
      .eq('user_id', userId)

    // Filter by upcoming/past
    if (upcoming !== null) {
      const now = new Date().toISOString()
      if (upcoming === 'true') {
        query = query.gte('interview_date', now)
      } else {
        query = query.lt('interview_date', now)
      }
    }

    // Filter by type
    if (type && type !== 'all') {
      query = query.eq('interview_type', type)
    }

    query = query.order('interview_date', { ascending: true }).limit(limit)

    const { data, error } = await query

    if (error) {
      console.error('[GET /api/interviews] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ interviews: data || [] })
  } catch (error) {
    console.error('[GET /api/interviews] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // TODO: Get user ID from session/auth
    const userId = 'demo-user-123'

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 })
    }

    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('interviews')
      .update(updatedData)
      .eq('id', id)
      .eq('user_id', userId)
      .select(
        `
        *,
        application:applications (
          company_name,
          position_title
        )
      `
      )
      .single()

    if (error) {
      console.error('[PATCH /api/interviews] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[PATCH /api/interviews] Error:', error)
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // TODO: Get user ID from session/auth
    const userId = 'demo-user-123'

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('interviews')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[DELETE /api/interviews] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/interviews] Error:', error)
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 })
  }
}
