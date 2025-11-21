/**
 * Public API endpoint for context fetching
 * Allows tools to fetch full application data using JWT token
 */

import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { verifyContextToken } from '@/lib/context/token-server'
import type { ApplicationContextData } from '@/lib/context/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params

    // Extract and verify JWT token
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = await verifyContextToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Verify token matches requested application
    if (payload.applicationId !== applicationId) {
      return NextResponse.json(
        { error: 'Token does not grant access to this application' },
        { status: 403 }
      )
    }

    // Fetch application data
    const { data: application, error: appError } = await getSupabaseAdmin()
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .eq('user_id', payload.userId) // Ensure user owns this application
      .single()

    if (appError || !application) {
      console.error('[GET /api/public/context/[id]] Application error:', appError)
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Fetch related documents
    const { data: documents } = await getSupabaseAdmin()
      .from('documents')
      .select('id, title, document_type, file_url, created_at')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })

    // Fetch activities
    const { data: activities } = await getSupabaseAdmin()
      .from('application_activities')
      .select('*')
      .eq('application_id', applicationId)
      .order('activity_date', { ascending: false })
      .limit(10)

    // Build response
    const contextData: ApplicationContextData = {
      id: application.id,
      company_name: application.company_name,
      position_title: application.position_title,
      status: application.status,
      date_applied: application.date_applied,
      job_url: application.job_url,
      job_description: application.job_description,
      location: application.location,
      salary_range: application.salary_range,
      remote_type: application.remote_type,
      notes: application.notes,
      source: application.source,
      documents: documents?.map((doc) => ({
        id: doc.id,
        title: doc.title,
        document_type: doc.document_type,
        file_url: doc.file_url,
        created_at: doc.created_at,
      })) || [],
      activities: activities || [],
    }

    return NextResponse.json(contextData, {
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_TOOLS_DOMAIN || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    })
  } catch (error) {
    console.error('[GET /api/public/context/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch context data' },
      { status: 500 }
    )
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_TOOLS_DOMAIN || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    }
  )
}
