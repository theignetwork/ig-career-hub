import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'

export async function GET(request: Request) {
  try {
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile with XP and level
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single()

    // Get achievements
    const { data: achievements } = await supabaseAdmin
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    // Get streaks
    const { data: streaks } = await supabaseAdmin
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get recent XP activities
    const { data: recentXP } = await supabaseAdmin
      .from('xp_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      xp: profile?.total_xp || 0,
      level: profile?.current_level || 1,
      achievements: achievements || [],
      streaks: streaks || {
        application_streak: 0,
        longest_application_streak: 0,
        goal_completion_streak: 0,
        longest_goal_streak: 0,
      },
      recentXP: recentXP || [],
    })
  } catch (error) {
    console.error('[GET /api/gamification/stats] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch gamification stats' }, { status: 500 })
  }
}
