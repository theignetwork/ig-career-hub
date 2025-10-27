import React from 'react'
import { UpcomingInterview } from '@/lib/api/dashboard'

interface ThisWeekWidgetProps {
  interviews: UpcomingInterview[]
}

export const ThisWeekWidget: React.FC<ThisWeekWidgetProps> = ({ interviews }) => {
  // Format interview to day abbreviation and time
  const formatInterview = (interview: UpcomingInterview) => {
    const date = new Date(interview.date)
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const dayAbbr = days[date.getDay()]
    const time = interview.time || 'TBD'

    return {
      day: dayAbbr,
      time,
      company: interview.company,
    }
  }

  return (
    <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-4">
      {/* Header */}
      <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
        <span>📅</span>
        THIS WEEK
      </h3>

      {/* Calendar List */}
      {interviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((interview, index) => {
            const formatted = formatInterview(interview)
            return (
              <div key={index} className="border-l-4 border-[#0D9488] pl-3 py-1">
                <div className="text-sm text-white font-medium mb-0.5">
                  {formatted.day} {formatted.time}
                </div>
                <div className="text-sm text-gray-400">{formatted.company}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">No interviews this week</div>
      )}
    </div>
  )
}

ThisWeekWidget.displayName = 'ThisWeekWidget'
