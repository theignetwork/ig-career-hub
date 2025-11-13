import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'

export async function GET(request: Request) {
  try {
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // Filter by document type
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Filter by type if specified
    if (type && type !== 'all') {
      query = query.eq('file_type', type)
    }

    query = query.limit(limit)

    const { data, error } = await query

    if (error) {
      console.error('[GET /api/documents] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ documents: data || [], total: data?.length || 0 })
  } catch (error) {
    console.error('[GET /api/documents] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: userId,
        file_type: body.file_type,
        title: body.title,
        file_name: body.file_name,
        file_size: body.file_size,
        content: body.content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[POST /api/documents] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[POST /api/documents] Error:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[DELETE /api/documents] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // TODO: Delete from Supabase Storage if needed
    // Extract storage path from content field and delete

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/documents] Error:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
