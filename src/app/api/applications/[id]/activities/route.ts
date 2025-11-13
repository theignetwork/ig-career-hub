import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'

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

    // First verify the user owns this application
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!application || application.user_id !== userId) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const { data: activities, error } = await supabaseAdmin
      .from('application_activities')
      .select('*')
      .eq('application_id', id)
      .order('activity_date', { ascending: false })

    if (error) {
      console.error('[GET /api/applications/[id]/activities] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ activities: activities || [] })
  } catch (error) {
    console.error('[GET /api/applications/[id]/activities] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
