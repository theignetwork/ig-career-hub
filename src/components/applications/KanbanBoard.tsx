'use client'

import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ApplicationCard } from './ApplicationCard'
import type { Application } from '@/lib/api/applications'

interface KanbanBoardProps {
  applications: Application[]
  onEdit: (id: string) => void
  onView?: (id: string) => void
  onStatusChange: (applicationId: string, newStatus: string) => Promise<void>
}

type Status = 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected'

const COLUMNS: { id: Status; label: string; color: string; icon: string }[] = [
  { id: 'applied', label: 'Applied', color: '#6B7280', icon: '📝' },
  { id: 'phone_screen', label: 'Phone Screen', color: '#3B82F6', icon: '📞' },
  { id: 'interview', label: 'Interview', color: '#8B5CF6', icon: '💼' },
  { id: 'offer', label: 'Offer', color: '#10B981', icon: '🎉' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444', icon: '❌' },
]

// Droppable Column Component
const DroppableColumn: React.FC<{
  id: string
  children: React.ReactNode
  isDragging: boolean
}> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="flex-1 h-full">
      {children}
    </div>
  )
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onEdit,
  onView,
  onStatusChange,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  )

  // Group applications by status
  const applicationsByStatus = COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = applications.filter((app) => app.status === column.id)
      return acc
    },
    {} as Record<Status, Application[]>
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setIsDragging(true)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setIsDragging(false)

    if (!over) return

    const applicationId = active.id as string

    // Determine the new status based on what was dropped on
    let newStatus: Status | null = null

    console.log('Drag ended:', {
      applicationId,
      overId: over.id,
      isColumnId: COLUMNS.some((col) => col.id === over.id)
    })

    // Check if dropped directly on a column (droppable area)
    if (COLUMNS.some((col) => col.id === over.id)) {
      newStatus = over.id as Status
      console.log('Dropped on column:', newStatus)
    } else {
      // Dropped on another card - find which column that card is in
      // Make sure we're not dropping on the card itself
      if (over.id !== applicationId) {
        const targetApp = applications.find((app) => app.id === over.id)
        if (targetApp) {
          newStatus = targetApp.status as Status
          console.log('Dropped on card, using its status:', newStatus)
        }
      } else {
        console.log('Dropped on self, ignoring')
      }
    }

    if (!newStatus) {
      console.log('No valid status determined')
      return
    }

    // Find the application being dragged
    const application = applications.find((app) => app.id === applicationId)
    if (!application) return

    // If status hasn't changed, do nothing
    if (application.status === newStatus) {
      console.log('Status unchanged, skipping')
      return
    }

    console.log('Updating status:', { applicationId, from: application.status, to: newStatus })

    // Update the status
    try {
      await onStatusChange(applicationId, newStatus)
    } catch (error) {
      console.error('Failed to update application status:', error)
    }
  }

  const activeApplication = activeId
    ? applications.find((app) => app.id === activeId)
    : null

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <div className="grid grid-cols-5 gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnApps = applicationsByStatus[column.id]

          return (
            <div key={column.id} className="flex flex-col min-w-[280px]">
              {/* Column Header */}
              <div className="mb-4 sticky top-0 bg-black z-10 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{column.icon}</span>
                    <h3 className="text-white font-semibold text-sm">{column.label}</h3>
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: column.color }}
                  >
                    {columnApps.length}
                  </div>
                </div>
                <div className="h-1 rounded-full" style={{ backgroundColor: column.color }} />
              </div>

              {/* Droppable Column */}
              <DroppableColumn id={column.id} isDragging={isDragging}>
                <div
                  className={`h-full min-h-[500px] p-3 rounded-xl border-2 border-dashed transition-colors ${
                    isDragging ? 'border-[#0D9488] bg-[#0D9488]/5' : 'border-[#1E293B]'
                  }`}
                >
                  <SortableContext
                    id={column.id}
                    items={columnApps.map((app) => app.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {columnApps.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                          No applications
                        </div>
                      ) : (
                        columnApps.map((application) => (
                          <ApplicationCard
                            key={application.id}
                            application={application}
                            onEdit={onEdit}
                            onView={onView}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </div>
              </DroppableColumn>
            </div>
          )
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeApplication ? (
          <div className="rotate-3 scale-105">
            <ApplicationCard application={activeApplication} onEdit={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

KanbanBoard.displayName = 'KanbanBoard'
