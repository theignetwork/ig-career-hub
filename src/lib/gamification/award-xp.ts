// Helper function to award XP from client-side

export async function awardXP(xp: number, activityType: string, description?: string) {
  try {
    const response = await fetch('/api/gamification/award-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp, activityType, description }),
    })

    if (!response.ok) {
      throw new Error('Failed to award XP')
    }

    const result = await response.json()

    // Trigger celebration if leveled up
    if (result.leveledUp) {
      triggerLevelUpCelebration(result.newLevel)
    }

    return result
  } catch (error) {
    console.error('Error awarding XP:', error)
    return null
  }
}

function triggerLevelUpCelebration(newLevel: number) {
  // Dispatch custom event for level up
  window.dispatchEvent(
    new CustomEvent('levelup', {
      detail: { level: newLevel },
    })
  )
}

export function triggerAchievementUnlocked(achievementName: string, xp: number) {
  window.dispatchEvent(
    new CustomEvent('achievement', {
      detail: { name: achievementName, xp },
    })
  )
}
