import { supabaseAdmin } from '@/lib/supabase/server'
import type { Application } from './applications'

// ===========================
// TypeScript Types
// ===========================

export interface DashboardStats {
  applicationsCount: number
  interviewsCount: number
  offersCount: number
  responseRate: number
  responseRateTrend: number
}

export interface UpcomingInterview {
  id: string
  company: string
  position: string
  date: string
  time: string
  type: 'phone' | 'video' | 'onsite' | 'technical'
  isPrepared: boolean
}

export interface RecentApplication {
  id: string
  company: string
  position: string
  status: 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected'
  dateApplied: string
}

export interface PipelineApplication {
  id: string
  company: string
  position: string
  stage: string
  date?: string
}

// ===========================
// API Functions
// ===========================

/**
 * Get dashboard statistics for a user
 * Fetches applications count, interviews, offers, and response rate
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    // Get applications count
    const { count: applicationsCount, error: appsError } = await supabaseAdmin
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (appsError) throw appsError

    // Get interviews count
    const { count: interviewsCount, error: interviewsError } = await supabaseAdmin
      .from('interviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (interviewsError) throw interviewsError

    // Get offers count
    const { count: offersCount, error: offersError } = await supabaseAdmin
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'offer')

    if (offersError) throw offersError

    // Calculate response rate
    const { responseRate, responseRateTrend } = await calculateResponseRate(userId)

    return {
      applicationsCount: applicationsCount || 0,
      interviewsCount: interviewsCount || 0,
      offersCount: offersCount || 0,
      responseRate,
      responseRateTrend,
    }
  } catch (error) {
    console.error('[getDashboardStats] Error:', error)
    return {
      applicationsCount: 0,
      interviewsCount: 0,
      offersCount: 0,
      responseRate: 0,
      responseRateTrend: 0,
    }
  }
}

/**
 * Calculate response rate and trend vs industry average
 * Uses the application_stats view if available
 */
export async function calculateResponseRate(userId: string): Promise<{
  responseRate: number
  responseRateTrend: number
}> {
  try {
    // Try to use application_stats view first
    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('application_stats')
      .select('total_applications, responded_applications')
      .eq('user_id', userId)
      .single()

    if (!statsError && statsData) {
      const responseRate =
        statsData.total_applications > 0
          ? Math.round((statsData.responded_applications / statsData.total_applications) * 100)
          : 0

      // Industry average is typically 15-20%, using 15% as baseline
      const industryAvg = 15
      const trend = responseRate - industryAvg

      return { responseRate, responseRateTrend: trend }
    }

    // Fallback: Calculate manually
    const { data: applications, error: appsError } = await supabaseAdmin
      .from('applications')
      .select('id, status')
      .eq('user_id', userId)

    if (appsError) throw appsError

    const total = applications?.length || 0
    const responded =
      applications?.filter(
        (app) =>
          app.status !== 'applied' && app.status !== 'rejected' && app.status !== 'withdrawn'
      ).length || 0

    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0
    const industryAvg = 15
    const trend = responseRate - industryAvg

    return { responseRate, responseRateTrend: trend }
  } catch (error) {
    console.error('[calculateResponseRate] Error:', error)
    return { responseRate: 0, responseRateTrend: 0 }
  }
}

/**
 * Get upcoming interviews for a user
 * Returns interviews ordered by date/time
 */
export async function getUpcomingInterviews(userId: string): Promise<UpcomingInterview[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('interviews')
      .select(
        `
        id,
        interview_date,
        interview_type,
        prepared,
        application_id,
        applications (
          company_name,
          position_title
        )
      `
      )
      .eq('user_id', userId)
      .gte('interview_date', new Date().toISOString()) // Only future interviews
      .order('interview_date', { ascending: true })
      .limit(10)

    if (error) throw error

    return (
      data?.map((interview: any) => {
        const interviewDate = new Date(interview.interview_date)
        const dateStr = interviewDate.toISOString().split('T')[0]
        const timeStr = interviewDate.toTimeString().slice(0, 5) // HH:MM format

        return {
          id: interview.id,
          company: interview.applications?.company_name || 'Unknown Company',
          position: interview.applications?.position_title || 'Unknown Position',
          date: dateStr,
          time: timeStr,
          type: interview.interview_type || 'video',
          isPrepared: interview.prepared || false,
        }
      }) || []
    )
  } catch (error) {
    console.error('[getUpcomingInterviews] Error:', error)
    return []
  }
}

/**
 * Get recent applications for a user
 * Returns applications ordered by date (most recent first)
 */
export async function getRecentApplications(
  userId: string,
  limit: number = 10
): Promise<RecentApplication[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('id, company_name, position_title, status, date_applied')
      .eq('user_id', userId)
      .order('date_applied', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (
      data?.map((app) => ({
        id: app.id,
        company: app.company_name,
        position: app.position_title,
        status: app.status as RecentApplication['status'],
        dateApplied: app.date_applied,
      })) || []
    )
  } catch (error) {
    console.error('[getRecentApplications] Error:', error)
    return []
  }
}

/**
 * Get application pipeline for dashboard visualization
 * Returns applications grouped by stage
 */
export async function getApplicationPipeline(userId: string): Promise<PipelineApplication[]> {
  try {
    // Get one application from each major stage
    const stages = ['applied', 'phone_screen', 'interview', 'offer']
    const pipeline: PipelineApplication[] = []

    for (const stage of stages) {
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('id, company_name, position_title, status, date_applied')
        .eq('user_id', userId)
        .eq('status', stage)
        .order('date_applied', { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        pipeline.push({
          id: data.id,
          company: data.company_name,
          position: data.position_title,
          stage: data.status,
          date: data.date_applied,
        })
      }
    }

    return pipeline
  } catch (error) {
    console.error('[getApplicationPipeline] Error:', error)
    return []
  }
}

/**
 * Get companies that need follow-up
 * Returns applications that haven't been updated in 7+ days
 */
export async function getFollowUpCompanies(userId: string): Promise<string[]> {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('company_name')
      .eq('user_id', userId)
      .in('status', ['applied', 'phone_screen', 'interview'])
      .lt('updated_at', sevenDaysAgo.toISOString())
      .order('updated_at', { ascending: true })
      .limit(5)

    if (error) throw error

    return data?.map((app) => app.company_name) || []
  } catch (error) {
    console.error('[getFollowUpCompanies] Error:', error)
    return []
  }
}

/**
 * Get all applications for Smart Suggestions
 * Returns full application data sorted by date (most recent first)
 */
export async function getApplicationsForSuggestions(userId: string): Promise<Application[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('date_applied', { ascending: false })
      .limit(20)

    if (error) throw error

    return (data as Application[]) || []
  } catch (error) {
    console.error('[getApplicationsForSuggestions] Error:', error)
    return []
  }
}

/**
 * Get a single application by ID
 * Returns complete application data for editing
 */
export async function getApplicationById(applicationId: string): Promise<Application | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (error) throw error

    return data as Application
  } catch (error) {
    console.error('[getApplicationById] Error:', error)
    return null
  }
}
