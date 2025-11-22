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

    // Get WordPress user data and application ID from request
    const { applicationId, wpUserData } = await request.json()

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    if (!wpUserData || !wpUserData.user_id || !wpUserData.email || !wpUserData.name || !wpUserData.membership_level) {
      return NextResponse.json(
        { error: 'WordPress user data is required' },
        { status: 400 }
      )
    }

    // Verify the user ID matches
    if (wpUserData.user_id.toString() !== userId) {
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 403 }
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
    const token = await generateContextToken(wpUserData, application.id, applicationData, 15)

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
