import { getSupabaseAdmin } from '@/lib/supabase/server'

// ===========================
// TypeScript Types
// ===========================

export interface Interview {
  id: string
  user_id: string
  application_id: string
  interview_date: string
  interview_type: 'phone' | 'video' | 'onsite' | 'technical'
  notes?: string
  prepared: boolean
  outcome?: string
  created_at: string
  updated_at: string
  // Joined data from applications table
  application?: {
    company_name: string
    position_title: string
  }
}

export interface CreateInterviewInput {
  application_id: string
  interview_date: string
  interview_type: 'phone' | 'video' | 'onsite' | 'technical'
  notes?: string
  prepared?: boolean
}

export interface UpdateInterviewInput {
  interview_date?: string
  interview_type?: 'phone' | 'video' | 'onsite' | 'technical'
  notes?: string
  prepared?: boolean
  outcome?: string
}

export interface InterviewFilters {
  upcoming?: boolean
  type?: string
  sortBy?: 'interview_date' | 'created_at'
  sortOrder?: 'asc' | 'desc'
  limit?: number
}

// ===========================
// API Functions
// ===========================

/**
 * Get all interviews for a user with optional filtering
 */
export async function getInterviews(
  userId: string,
  filters: InterviewFilters = {}
): Promise<Interview[]> {
  try {
    const {
      upcoming,
      type,
      sortBy = 'interview_date',
      sortOrder = 'asc',
      limit = 50,
    } = filters

    // Build query with application join
    let query = getSupabaseAdmin()
      .from('interviews')
      .select(
        `
        *,
        application:applications (
          company_name,
          position_title
        )
      `
      )
      .eq('user_id', userId)

    // Filter by upcoming/past
    if (upcoming !== undefined) {
      const now = new Date().toISOString()
      if (upcoming) {
        query = query.gte('interview_date', now)
      } else {
        query = query.lt('interview_date', now)
      }
    }

    // Filter by type
    if (type && type !== 'all') {
      query = query.eq('interview_type', type)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).limit(limit)

    const { data, error } = await query

    if (error) throw error

    return (data as Interview[]) || []
  } catch (error) {
    console.error('[getInterviews] Error:', error)
    return []
  }
}

/**
 * Get a single interview by ID
 */
export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('interviews')
      .select(
        `
        *,
        application:applications (
          company_name,
          position_title
        )
      `
      )
      .eq('id', interviewId)
      .single()

    if (error) throw error

    return data as Interview
  } catch (error) {
    console.error('[getInterviewById] Error:', error)
    return null
  }
}

/**
 * Create a new interview
 */
export async function createInterview(
  userId: string,
  input: CreateInterviewInput
): Promise<Interview | null> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('interviews')
      .insert({
        user_id: userId,
        application_id: input.application_id,
        interview_date: input.interview_date,
        interview_type: input.interview_type,
        notes: input.notes,
        prepared: input.prepared || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        application:applications (
          company_name,
          position_title
        )
      `
      )
      .single()

    if (error) throw error

    return data as Interview
  } catch (error) {
    console.error('[createInterview] Error:', error)
    return null
  }
}

/**
 * Update an interview
 */
export async function updateInterview(
  interviewId: string,
  input: UpdateInterviewInput
): Promise<Interview | null> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (input.interview_date !== undefined) updateData.interview_date = input.interview_date
    if (input.interview_type !== undefined) updateData.interview_type = input.interview_type
    if (input.notes !== undefined) updateData.notes = input.notes
    if (input.prepared !== undefined) updateData.prepared = input.prepared
    if (input.outcome !== undefined) updateData.outcome = input.outcome

    const { data, error } = await getSupabaseAdmin()
      .from('interviews')
      .update(updateData)
      .eq('id', interviewId)
      .select(
        `
        *,
        application:applications (
          company_name,
          position_title
        )
      `
      )
      .single()

    if (error) throw error

    return data as Interview
  } catch (error) {
    console.error('[updateInterview] Error:', error)
    return null
  }
}

/**
 * Delete an interview
 */
export async function deleteInterview(interviewId: string): Promise<boolean> {
  try {
    const { error } = await getSupabaseAdmin().from('interviews').delete().eq('id', interviewId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('[deleteInterview] Error:', error)
    return false
  }
}

/**
 * Toggle interview prepared status
 */
export async function toggleInterviewPrepared(
  interviewId: string,
  prepared: boolean
): Promise<boolean> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('interviews')
      .update({
        prepared,
        updated_at: new Date().toISOString(),
      })
      .eq('id', interviewId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('[toggleInterviewPrepared] Error:', error)
    return false
  }
}

/**
 * Get upcoming interviews count
 */
export async function getUpcomingInterviewsCount(userId: string): Promise<number> {
  try {
    const now = new Date().toISOString()

    const { count, error } = await getSupabaseAdmin()
      .from('interviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('interview_date', now)

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('[getUpcomingInterviewsCount] Error:', error)
    return 0
  }
}
