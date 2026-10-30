import React, { useState } from 'react'
import { Application, AppStatus } from '../api/applications'

interface Props {
  applications: Application[]
  onStatusChange: (id: string, newStatus: AppStatus) => void
  onEdit: (app: Application) => void
}

const COLUMNS: { status: AppStatus; title: string; color: string }[] = [
  { status: 'APPLIED', title: 'Applied', color: 'border-blue-400 bg-blue-50/40' },
  { status: 'SCREENING', title: 'Screening', color: 'border-amber-400 bg-amber-50/40' },
  { status: 'INTERVIEW_SCHEDULED', title: 'Interview', color: 'border-purple-400 bg-purple-50/40' },
  { status: 'OFFER_RECEIVED', title: 'Offer', color: 'border-emerald-400 bg-emerald-50/40' },
  { status: 'REJECTED', title: 'Rejected', color: 'border-rose-400 bg-rose-50/40' },
]

export default function KanbanBoard({ applications, onStatusChange, onEdit }: Props) {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null)

  const handleDragStart = (id: string) => {
    setDraggedAppId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: AppStatus) => {
    if (draggedAppId) {
      onStatusChange(draggedAppId, status)
      setDraggedAppId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {COLUMNS.map(col => {
        const items = applications.filter(a => a.status === col.status)
        return (
          <div
            key={col.status}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.status)}
            className={`rounded-xl p-3 border-t-4 shadow-sm bg-white border border-gray-200 min-h-[500px] flex flex-col ${col.color}`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-sm text-gray-800">{col.title}</h3>
              <span className="text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              {items.map(app => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={() => handleDragStart(app.id)}
                  onClick={() => onEdit(app)}
                  className="bg-white p-3 rounded-lg shadow-xs border border-gray-200 cursor-grab hover:shadow-md transition active:cursor-grabbing"
                >
                  <div className="font-bold text-sm text-gray-900">{app.companyName}</div>
                  <div className="text-xs text-gray-600 mb-2">{app.role}</div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{app.appliedDate || 'No date'}</span>
                    {app.matchScore != null && (
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {app.matchScore}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                  Drop here
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
