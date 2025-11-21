/**
 * API endpoint to generate context tokens
 * This keeps the JWT secret on the server only
 */

import { NextResponse } from 'next/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { generateContextToken } from '@/lib/context/token-server'

export async function POST(request: Request) {
  try {
    // Authenticate user
    const userId = await getServerUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get application ID from request
    const { applicationId } = await request.json()

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    // Fetch application data (verify ownership)
    const { data: application, error: appError } = await getSupabaseAdmin()
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .eq('user_id', userId) // Ensure user owns this application
      .single()

    if (appError || !application) {
      console.error('[POST /api/context/generate] Application error:', appError)
      return NextResponse.json(
        { error: 'Application not found or access denied' },
        { status: 404 }
      )
    }

    // Prepare application data for JWT
    const applicationData = {
      companyName: application.company_name,
      positionTitle: application.position_title,
      jobDescription: application.job_description,
      location: application.location,
      salaryRange: application.salary_range,
      remoteType: application.remote_type,
      source: application.source,
      dateApplied: application.date_applied,
    }

    // Generate JWT token server-side (secret never exposed to client!)
    const token = await generateContextToken(userId, application.id, applicationData, 15)

    console.log(`[POST /api/context/generate] Token generated for user ${userId}, app ${applicationId}`)

    return NextResponse.json({
      token,
      expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
    })

  } catch (error) {
    console.error('[POST /api/context/generate] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate context token' },
      { status: 500 }
    )
  }
}
