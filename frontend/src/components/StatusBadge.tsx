import { AppStatus } from '../api/applications'

const BADGE_STYLES: Record<AppStatus, { bg: string; text: string; label: string }> = {
  APPLIED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Applied' },
  SCREENING: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Screening' },
  INTERVIEW_SCHEDULED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview' },
  OFFER_RECEIVED: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Offer Received' },
  REJECTED: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Rejected' },
}

export default function StatusBadge({ status }: { status: AppStatus }) {
  const cfg = BADGE_STYLES[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}
