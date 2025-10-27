'use client'

import React from 'react'

interface ApplicationFiltersProps {
  onSearchChange: (search: string) => void
  onStatusChange: (status: string) => void
  onRemoteTypeChange: (remoteType: string) => void
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  currentSearch: string
  currentStatus: string
  currentRemoteType: string
  currentSort: string
  currentSortOrder: 'asc' | 'desc'
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  onSearchChange,
  onStatusChange,
  onRemoteTypeChange,
  onSortChange,
  currentSearch,
  currentStatus,
  currentRemoteType,
  currentSort,
  currentSortOrder,
}) => {
  return (
    <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-6 space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by company or position..."
            value={currentSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0F1629] text-white pl-12 pr-4 py-3 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-4 gap-3">
        {/* Status Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Status</label>
          <select
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-[#0F1629] text-white px-4 py-2.5 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="phone_screen">Phone Screen</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Remote Type Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Work Type</label>
          <select
            value={currentRemoteType}
            onChange={(e) => onRemoteTypeChange(e.target.value)}
            className="w-full bg-[#0F1629] text-white px-4 py-2.5 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sort By</label>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value, currentSortOrder)}
            className="w-full bg-[#0F1629] text-white px-4 py-2.5 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors cursor-pointer"
          >
            <option value="date_applied">Date Applied</option>
            <option value="company_name">Company Name</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Order</label>
          <button
            onClick={() => onSortChange(currentSort, currentSortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full bg-[#0F1629] text-white px-4 py-2.5 rounded-lg border-2 border-[#1E293B] hover:border-[#0D9488] focus:outline-none transition-colors flex items-center justify-center gap-2"
          >
            {currentSortOrder === 'asc' ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
                Ascending
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
                Descending
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

ApplicationFilters.displayName = 'ApplicationFilters'
