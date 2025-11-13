import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'

// GET - Fetch single application
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId) // Verify user owns this application
      .single()

    if (error) {
      console.error('[GET /api/applications/[id]] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/applications/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

// PATCH - Update specific fields (used for status changes in kanban)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update(body)
      .eq('id', id)
      .eq('user_id', userId) // Verify user owns this application
      .select()
      .single()

    if (error) {
      console.error('[PATCH /api/applications/[id]] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate dashboard to reflect status changes
    revalidatePath('/dashboard')
    revalidatePath('/applications')

    return NextResponse.json(data)
  } catch (error) {
    console.error('[PATCH /api/applications/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// PUT - Full update (used for editing applications)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({
        company_name: body.company_name,
        position_title: body.position_title,
        job_url: body.job_url,
        job_description: body.job_description,
        location: body.location,
        salary_range: body.salary_range,
        remote_type: body.remote_type,
        status: body.status,
        notes: body.notes,
      })
      .eq('id', id)
      .eq('user_id', userId) // Verify user owns this application
      .select()
      .single()

    if (error) {
      console.error('[PUT /api/applications/[id]] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate dashboard and applications pages
    revalidatePath('/dashboard')
    revalidatePath('/applications')

    return NextResponse.json(data)
  } catch (error) {
    console.error('[PUT /api/applications/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE - Remove application
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Verify user owns this application

    if (error) {
      console.error('[DELETE /api/applications/[id]] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate dashboard and applications pages to clear cache
    revalidatePath('/dashboard')
    revalidatePath('/applications')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/applications/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}
