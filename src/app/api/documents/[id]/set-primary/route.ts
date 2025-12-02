import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = getSupabaseAdmin()

    // First, verify the document exists and belongs to this user
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('id, file_type, user_id')
      .eq('id', id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (document.user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Clear is_primary from all other documents of the same type for this user
    const { error: clearError } = await supabase
      .from('documents')
      .update({ is_primary: false })
      .eq('user_id', userId)
      .eq('file_type', document.file_type)

    if (clearError) {
      console.error('[POST /api/documents/[id]/set-primary] Clear error:', clearError)
      return NextResponse.json({ error: 'Failed to update documents' }, { status: 500 })
    }

    // Set this document as primary
    const { error: updateError } = await supabase
      .from('documents')
      .update({ is_primary: true })
      .eq('id', id)

    if (updateError) {
      console.error('[POST /api/documents/[id]/set-primary] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to set primary document' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Document set as primary' })
  } catch (error) {
    console.error('[POST /api/documents/[id]/set-primary] Error:', error)
    return NextResponse.json({ error: 'Failed to set primary document' }, { status: 500 })
  }
}
