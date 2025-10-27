'use client'

import React, { useState, useEffect } from 'react'
import { getLevelInfo } from '@/lib/gamification/xp-system'

interface ToastData {
  type: 'levelup' | 'achievement' | 'xp'
  title: string
  message: string
  icon: string
  color: string
}

export const CelebrationToast: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleLevelUp = (e: any) => {
      const { level } = e.detail
      const levelInfo = getLevelInfo(level * 100) // Approximate XP

      setToast({
        type: 'levelup',
        title: `Level Up! 🎉`,
        message: `You're now Level ${level} - ${levelInfo.currentLevel.name}!`,
        icon: levelInfo.currentLevel.icon,
        color: levelInfo.currentLevel.color,
      })
      showToast()
    }

    const handleAchievement = (e: any) => {
      const { name, xp } = e.detail

      setToast({
        type: 'achievement',
        title: 'Achievement Unlocked! 🏆',
        message: `${name} (+${xp} XP)`,
        icon: '🏆',
        color: '#F59E0B',
      })
      showToast()
    }

    window.addEventListener('levelup', handleLevelUp)
    window.addEventListener('achievement', handleAchievement)

    return () => {
      window.removeEventListener('levelup', handleLevelUp)
      window.removeEventListener('achievement', handleAchievement)
    }
  }, [])

  const showToast = () => {
    setVisible(true)
    setTimeout(() => {
      setVisible(false)
      setTimeout(() => setToast(null), 300)
    }, 5000)
  }

  if (!toast) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className="bg-[#0A0E1A] border-2 rounded-xl p-4 shadow-2xl min-w-[320px] animate-bounce-in"
        style={{
          borderColor: toast.color,
          boxShadow: `0 0 30px ${toast.color}`,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="text-4xl">{toast.icon}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{toast.title}</h3>
            <p className="text-sm text-gray-300">{toast.message}</p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-white/50 hover:text-white/90"
          >
            ✕
          </button>
        </div>

        {/* Confetti effect */}
        {toast.type === 'levelup' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xs animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              >
                {['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti forwards;
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
