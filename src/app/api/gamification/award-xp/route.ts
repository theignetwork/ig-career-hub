import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getServerUserId } from '@/lib/utils/getServerUserId'

export async function POST(request: Request) {
  try {
    const userId = await getServerUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { xp, activityType, description } = body

    if (!xp || xp <= 0) {
      return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 })
    }

    // Get current user XP
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single()

    const oldXP = profile?.total_xp || 0
    const oldLevel = profile?.current_level || 1
    const newXP = oldXP + xp

    // Update user XP
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ total_xp: newXP })
      .eq('id', userId)
      .select('total_xp, current_level')
      .single()

    if (updateError) {
      console.error('[POST /api/gamification/award-xp] Error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log the XP activity
    await supabaseAdmin.from('xp_activities').insert({
      user_id: userId,
      activity_type: activityType || 'unknown',
      xp_earned: xp,
      description: description || '',
    })

    const leveledUp = updatedProfile.current_level > oldLevel

    return NextResponse.json({
      oldXP,
      newXP: updatedProfile.total_xp,
      xpGained: xp,
      oldLevel,
      newLevel: updatedProfile.current_level,
      leveledUp,
    })
  } catch (error) {
    console.error('[POST /api/gamification/award-xp] Error:', error)
    return NextResponse.json({ error: 'Failed to award XP' }, { status: 500 })
  }
}
