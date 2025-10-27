import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // TODO: Get user ID from session/auth
    const userId = 'demo-user-123'

    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string
    const title = formData.get('title') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create a unique file path
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${documentType}/${timestamp}.${fileExt}`

    // Convert File to ArrayBuffer then to Buffer for Supabase
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[POST /api/documents/upload] Storage Error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('documents').getPublicUrl(fileName)

    // Create document record in database
    const { data: document, error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: userId,
        file_type: documentType,
        title: title || file.name,
        file_name: file.name,
        file_size: file.size,
        content: publicUrl, // Store the public URL in content field
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('[POST /api/documents/upload] DB Error:', dbError)
      // Try to clean up uploaded file
      await supabaseAdmin.storage.from('documents').remove([fileName])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('[POST /api/documents/upload] Error:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}
