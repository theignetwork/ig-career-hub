// XP System - Points and Leveling

export const XP_REWARDS = {
  // Application Actions
  APPLICATION_SUBMITTED: 10,
  APPLICATION_VIEWED: 5,
  APPLICATION_PHONE_SCREEN: 25,
  APPLICATION_INTERVIEW: 50,
  APPLICATION_OFFER: 100,

  // Interview Actions
  INTERVIEW_SCHEDULED: 15,
  INTERVIEW_PREPARED: 15,
  INTERVIEW_COMPLETED: 30,

  // Document Actions
  DOCUMENT_UPLOADED: 5,
  DOCUMENT_UPDATED: 3,

  // Goal Actions
  GOAL_CREATED: 5,
  GOAL_COMPLETED: 20,
  WEEKLY_GOAL_MET: 30,

  // Follow-up Actions
  NOTE_ADDED: 2,
  FOLLOW_UP_SENT: 10,
} as const

export const LEVELS = [
  { level: 1, name: 'Job Seeker', minXP: 0, maxXP: 99, icon: '🌱', color: '#94A3B8' },
  { level: 2, name: 'Go-Getter', minXP: 100, maxXP: 299, icon: '🚀', color: '#60A5FA' },
  { level: 3, name: 'Interview Pro', minXP: 300, maxXP: 599, icon: '🎤', color: '#8B5CF6' },
  { level: 4, name: 'Offer Hunter', minXP: 600, maxXP: 999, icon: '🎯', color: '#F59E0B' },
  { level: 5, name: 'Career Champion', minXP: 1000, maxXP: 1499, icon: '👑', color: '#10B981' },
  { level: 6, name: 'Networking Ninja', minXP: 1500, maxXP: 2099, icon: '🥷', color: '#EC4899' },
  { level: 7, name: 'Application Ace', minXP: 2100, maxXP: 2799, icon: '⭐', color: '#14B8A6' },
  { level: 8, name: 'Interview Legend', minXP: 2800, maxXP: 3599, icon: '🏆', color: '#F97316' },
  { level: 9, name: 'Opportunity Master', minXP: 3600, maxXP: 4499, icon: '💎', color: '#6366F1' },
  { level: 10, name: 'Career Titan', minXP: 4500, maxXP: Infinity, icon: '🔥', color: '#EF4444' },
]

export function getLevelInfo(xp: number) {
  const level = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP) || LEVELS[LEVELS.length - 1]
  const nextLevel = LEVELS.find(l => l.level === level.level + 1)

  const currentLevelXP = xp - level.minXP
  const xpForNextLevel = nextLevel ? nextLevel.minXP - level.minXP : 0
  const progress = nextLevel ? (currentLevelXP / xpForNextLevel) * 100 : 100

  return {
    currentLevel: level,
    nextLevel,
    currentLevelXP,
    xpForNextLevel,
    progress: Math.min(progress, 100),
    xpToNextLevel: nextLevel ? nextLevel.minXP - xp : 0,
  }
}

export function calculateLevel(xp: number): number {
  const level = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP)
  return level?.level || 1
}
