import React from 'react'
import { UpcomingInterview } from '@/lib/api/dashboard'

interface PriorityWidgetProps {
  nextInterview: UpcomingInterview | null
  followUpCompanies: string[]
}

export const PriorityWidget: React.FC<PriorityWidgetProps> = ({
  nextInterview,
  followUpCompanies,
}) => {
  // Format date to friendly string (e.g., "Tomorrow 2PM", "Mon 10AM")
  const formatInterviewDateTime = (date: string, time: string) => {
    const interviewDate = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check if same day
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()

    let dateStr = ''
    if (isSameDay(interviewDate, today)) {
      dateStr = 'Today'
    } else if (isSameDay(interviewDate, tomorrow)) {
      dateStr = 'Tomorrow'
    } else {
      // Show day of week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      dateStr = days[interviewDate.getDay()]
    }

    // Format time (assuming time is in HH:MM format)
    const timeStr = time || 'TBD'

    return `${dateStr} ${timeStr}`
  }

  return (
    <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-4">
      {/* Header */}
      <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
        <span>🔥</span>
        PRIORITY
      </h3>

      {/* Next Interview */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="text-sm text-gray-400 mb-1">Next Interview</div>
        {nextInterview ? (
          <>
            <div className="text-white font-semibold mb-1">
              Interview - {nextInterview.company}
            </div>
            <div className="text-sm text-gray-400 mb-2">
              {formatInterviewDateTime(nextInterview.date, nextInterview.time)}
            </div>
            {!nextInterview.isPrepared && (
              <span className="inline-block px-3 py-1.5 text-sm bg-red-900/40 text-red-300 border border-red-700 rounded font-medium">
                Not Prepared
              </span>
            )}
            {nextInterview.isPrepared && (
              <span className="inline-block px-3 py-1.5 text-sm bg-green-900/40 text-green-300 border border-green-700 rounded font-medium">
                Prepared
              </span>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-500 italic">No upcoming interviews</div>
        )}
      </div>

      {/* Follow Up */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Follow Up</div>
        {followUpCompanies.length > 0 ? (
          <ul className="space-y-1.5">
            {followUpCompanies.map((company, index) => (
              <li key={index} className="text-sm text-white flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                {company}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500 italic">No pending follow-ups</div>
        )}
      </div>
    </div>
  )
}

PriorityWidget.displayName = 'PriorityWidget'
