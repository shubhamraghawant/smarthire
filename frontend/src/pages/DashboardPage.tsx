import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import StatsCards from '../components/StatsCards'
import ApplicationTable from '../components/ApplicationTable'
import KanbanBoard from '../components/KanbanBoard'
import AddEditModal from '../components/AddEditModal'
import {
  Application,
  AppStatus,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  analyzeMatch,
  getDashboardStats,
  AnalyzeResponse
} from '../api/applications'

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<'table' | 'kanban'>('table')
  const [filterStatus, setFilterStatus] = useState<AppStatus | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [analysisResult, setAnalysisResult] = useState<{ id: string; data: AnalyzeResponse } | null>(null)

  const { data: statsData } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  })

  const { data: appsData, isLoading } = useQuery({
    queryKey: ['applications', filterStatus],
    queryFn: () => getApplications(filterStatus),
  })

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      setModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) => updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      setModalOpen(false)
      setSelectedApp(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppStatus }) => updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })

  const analyzeMutation = useMutation({
    mutationFn: (id: string) => analyzeMatch(id),
    onSuccess: (data, id) => {
      setAnalysisResult({ id, data })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })

  const handleSave = (formData: Partial<Application>) => {
    if (selectedApp) {
      updateMutation.mutate({ id: selectedApp.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (app: Application) => {
    setSelectedApp(app)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleStatusChange = (id: string, newStatus: AppStatus) => {
    statusMutation.mutate({ id, status: newStatus })
  }

  const handleAnalyze = (id: string) => {
    analyzeMutation.mutate(id)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {statsData && <StatsCards stats={statsData} />}

        {analysisResult && (
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h4 className="font-bold text-gray-900">AI Match Score: {analysisResult.data.matchScore}%</h4>
              </div>
              <p className="text-xs text-gray-600 mt-1">{analysisResult.data.suggestion}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {analysisResult.data.matchedSkills.map(s => (
                  <span key={s} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ {s}
                  </span>
                ))}
                {analysisResult.data.missingSkills.map(s => (
                  <span key={s} className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setAnalysisResult(null)}
              className="text-xs text-gray-500 hover:text-gray-800 underline self-end md:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                view === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-gray-600 border'
              }`}
            >
              📄 Table View
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                view === 'kanban' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-gray-600 border'
              }`}
            >
              📋 Kanban Board
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterStatus || ''}
              onChange={e => setFilterStatus((e.target.value as AppStatus) || undefined)}
              className="px-3 py-1.5 border rounded-lg text-xs font-semibold text-gray-700 bg-white outline-none"
            >
              <option value="">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="SCREENING">Screening</option>
              <option value="INTERVIEW_SCHEDULED">Interview</option>
              <option value="OFFER_RECEIVED">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <button
              onClick={() => {
                setSelectedApp(null)
                setModalOpen(true)
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition whitespace-nowrap"
            >
              + New Application
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading applications...</div>
        ) : view === 'table' ? (
          <ApplicationTable
            applications={appsData?.content || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAnalyze={handleAnalyze}
          />
        ) : (
          <KanbanBoard
            applications={appsData?.content || []}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
          />
        )}
      </main>

      <AddEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        application={selectedApp}
      />
    </div>
  )
}
