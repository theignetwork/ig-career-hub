import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // NOTE: The documents table doesn't have an is_primary column
    // This endpoint is not functional until the column is added
    return NextResponse.json({ error: 'Set primary functionality not yet implemented' }, { status: 501 })
  } catch (error) {
    console.error('[POST /api/documents/[id]/set-primary] Error:', error)
    return NextResponse.json({ error: 'Failed to set primary document' }, { status: 500 })
  }
}
