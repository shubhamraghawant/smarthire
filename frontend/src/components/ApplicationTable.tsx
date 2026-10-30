import { Application } from '../api/applications'
import StatusBadge from './StatusBadge'

interface Props {
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
  onAnalyze: (id: string) => void
}

export default function ApplicationTable({ applications, onEdit, onDelete, onAnalyze }: Props) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
        <div className="text-4xl mb-3">📭</div>
        <h3 className="text-lg font-semibold text-gray-700">No applications found</h3>
        <p className="text-sm text-gray-500 mt-1">Start by adding your first job application above.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-5 py-3">Company & Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Applied Date</th>
              <th className="px-5 py-3">AI Match Score</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map(app => (
              <tr key={app.id} className="hover:bg-blue-50/40 transition">
                <td className="px-5 py-4">
                  <div className="font-bold text-gray-900">{app.companyName}</div>
                  <div className="text-xs text-gray-500">{app.role}</div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-5 py-4 text-gray-600 text-xs">
                  {app.appliedDate || 'N/A'}
                </td>
                <td className="px-5 py-4">
                  {app.matchScore != null ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            app.matchScore >= 70 ? 'bg-emerald-500' : app.matchScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(app.matchScore, 100)}%` }}
                        />
                      </div>
                      <span className="font-semibold text-xs text-gray-700">{app.matchScore}%</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAnalyze(app.id)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                    >
                      ⚡ Run AI Match
                    </button>
                  )}
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  <button
                    onClick={() => onAnalyze(app.id)}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => onEdit(app)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
