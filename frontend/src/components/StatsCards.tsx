import { DashboardStats } from '../api/applications'

interface Props {
  stats: DashboardStats
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    { label: 'Total Apps', value: stats.total, icon: '💼', color: 'border-l-blue-500' },
    { label: 'Applied', value: stats.applied, icon: '📤', color: 'border-l-sky-500' },
    { label: 'Screening', value: stats.screening, icon: '🔍', color: 'border-l-amber-500' },
    { label: 'Interviews', value: stats.interviewScheduled, icon: '🎤', color: 'border-l-purple-500' },
    { label: 'Offers', value: stats.offerReceived, icon: '🎉', color: 'border-l-emerald-500' },
    { label: 'Rejected', value: stats.rejected, icon: '🚫', color: 'border-l-rose-500' },
    { label: 'Avg Match', value: `${stats.avgMatchScore}%`, icon: '🤖', color: 'border-l-indigo-500' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {cards.map(c => (
        <div key={c.label} className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 ${c.color}`}>
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>{c.label}</span>
            <span>{c.icon}</span>
          </div>
          <div className="text-xl font-bold text-gray-800">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
