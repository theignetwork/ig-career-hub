import { supabaseAdmin } from '@/lib/supabase/server'

// ===========================
// TypeScript Types
// ===========================

export interface Application {
  id: string
  user_id: string
  company_name: string
  position_title: string
  job_url?: string
  job_description?: string
  location?: string
  salary_range?: string
  remote_type?: string
  status: 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected'
  date_applied: string
  source?: string
  resume_id?: string
  cover_letter_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApplicationFilters {
  search?: string
  status?: string
  remoteType?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'date_applied' | 'company_name' | 'status'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface ApplicationsResponse {
  applications: Application[]
  total: number
  hasMore: boolean
}

// ===========================
// API Functions
// ===========================

/**
 * Get all applications for a user with optional filtering and sorting
 */
export async function getApplications(
  userId: string,
  filters: ApplicationFilters = {}
): Promise<ApplicationsResponse> {
  try {
    const {
      search,
      status,
      remoteType,
      dateFrom,
      dateTo,
      sortBy = 'date_applied',
      sortOrder = 'desc',
      limit = 50,
      offset = 0,
    } = filters

    // Build query
    let query = supabaseAdmin
      .from('applications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)

    // Apply search filter (company name or position title)
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,position_title.ilike.%${search}%`)
    }

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply remote type filter
    if (remoteType && remoteType !== 'all') {
      query = query.eq('remote_type', remoteType)
    }

    // Apply date range filters
    if (dateFrom) {
      query = query.gte('date_applied', dateFrom)
    }
    if (dateTo) {
      query = query.lte('date_applied', dateTo)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    const total = count || 0
    const hasMore = offset + limit < total

    return {
      applications: (data as Application[]) || [],
      total,
      hasMore,
    }
  } catch (error) {
    console.error('[getApplications] Error:', error)
    return {
      applications: [],
      total: 0,
      hasMore: false,
    }
  }
}

/**
 * Get a single application by ID
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

/**
 * Delete an application
 */
export async function deleteApplication(applicationId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', applicationId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('[deleteApplication] Error:', error)
    return false
  }
}

/**
 * Update application status
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: Application['status']
): Promise<Application | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) throw error

    return data as Application
  } catch (error) {
    console.error('[updateApplicationStatus] Error:', error)
    return null
  }
}

/**
 * Get application statistics
 */
export async function getApplicationStats(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('status')
      .eq('user_id', userId)

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      applied: data?.filter((app) => app.status === 'applied').length || 0,
      phoneScreen: data?.filter((app) => app.status === 'phone_screen').length || 0,
      interview: data?.filter((app) => app.status === 'interview').length || 0,
      offer: data?.filter((app) => app.status === 'offer').length || 0,
      rejected: data?.filter((app) => app.status === 'rejected').length || 0,
    }

    return stats
  } catch (error) {
    console.error('[getApplicationStats] Error:', error)
    return {
      total: 0,
      applied: 0,
      phoneScreen: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    }
  }
}
