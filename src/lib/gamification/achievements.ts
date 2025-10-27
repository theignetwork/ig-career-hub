// Achievements & Badges System

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  condition: string
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_application: {
    id: 'first_application',
    name: 'First Step',
    description: 'Submit your first job application',
    icon: '🎯',
    xpReward: 25,
    rarity: 'common',
    condition: 'applications_count >= 1',
  },
  hot_streak: {
    id: 'hot_streak',
    name: 'Hot Streak',
    description: 'Apply to 5 jobs in one day',
    icon: '🔥',
    xpReward: 50,
    rarity: 'rare',
    condition: 'applications_in_one_day >= 5',
  },
  sharpshooter: {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Achieve 50%+ response rate',
    icon: '🎯',
    xpReward: 75,
    rarity: 'epic',
    condition: 'response_rate >= 50',
  },
  century_club: {
    id: 'century_club',
    name: 'Century Club',
    description: 'Submit 100 job applications',
    icon: '💯',
    xpReward: 100,
    rarity: 'epic',
    condition: 'total_applications >= 100',
  },
  interview_master: {
    id: 'interview_master',
    name: 'Interview Master',
    description: 'Complete 10 interviews',
    icon: '🎤',
    xpReward: 100,
    rarity: 'epic',
    condition: 'interviews_completed >= 10',
  },
  prepared_pro: {
    id: 'prepared_pro',
    name: 'Prepared Pro',
    description: 'Mark 5 interviews as prepared',
    icon: '📚',
    xpReward: 50,
    rarity: 'rare',
    condition: 'interviews_prepared >= 5',
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Apply within 24 hours of job posting 10 times',
    icon: '⚡',
    xpReward: 75,
    rarity: 'rare',
    condition: 'quick_applications >= 10',
  },
  offer_champion: {
    id: 'offer_champion',
    name: 'Offer Champion',
    description: 'Receive 3 job offers',
    icon: '🏆',
    xpReward: 150,
    rarity: 'legendary',
    condition: 'offers_received >= 3',
  },
  first_interview: {
    id: 'first_interview',
    name: 'Breaking Through',
    description: 'Schedule your first interview',
    icon: '🚀',
    xpReward: 30,
    rarity: 'common',
    condition: 'interviews_count >= 1',
  },
  goal_crusher: {
    id: 'goal_crusher',
    name: 'Goal Crusher',
    description: 'Complete 10 weekly goals',
    icon: '💪',
    xpReward: 100,
    rarity: 'epic',
    condition: 'goals_completed >= 10',
  },
  consistency_king: {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Maintain a 7-day application streak',
    icon: '👑',
    xpReward: 75,
    rarity: 'rare',
    condition: 'application_streak >= 7',
  },
  document_master: {
    id: 'document_master',
    name: 'Document Master',
    description: 'Upload 5 career documents',
    icon: '📄',
    xpReward: 40,
    rarity: 'common',
    condition: 'documents_uploaded >= 5',
  },
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return '#94A3B8' // Gray
    case 'rare':
      return '#3B82F6' // Blue
    case 'epic':
      return '#A855F7' // Purple
    case 'legendary':
      return '#F59E0B' // Gold
  }
}

export function getRarityGlow(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return '0 0 10px rgba(148, 163, 184, 0.3)'
    case 'rare':
      return '0 0 15px rgba(59, 130, 246, 0.5)'
    case 'epic':
      return '0 0 20px rgba(168, 85, 247, 0.6)'
    case 'legendary':
      return '0 0 25px rgba(245, 158, 11, 0.8)'
  }
}
