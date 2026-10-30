import React, { useState, useEffect } from 'react'
import { Application, AppStatus } from '../api/applications'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Application>) => void
  application: Application | null
}

export default function AddEditModal({ isOpen, onClose, onSave, application }: Props) {
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<AppStatus>('APPLIED')
  const [appliedDate, setAppliedDate] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeSnapshot, setResumeSnapshot] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (application) {
      setCompanyName(application.companyName || '')
      setRole(application.role || '')
      setStatus(application.status || 'APPLIED')
      setAppliedDate(application.appliedDate || '')
      setJobDescription(application.jobDescription || '')
      setResumeSnapshot(application.resumeSnapshot || '')
      setNotes(application.notes || '')
    } else {
      setCompanyName('')
      setRole('')
      setStatus('APPLIED')
      setAppliedDate(new Date().toISOString().split('T')[0])
      setJobDescription('')
      setResumeSnapshot('')
      setNotes('')
    }
  }, [application, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      companyName,
      role,
      status,
      appliedDate: appliedDate || undefined,
      jobDescription,
      resumeSnapshot,
      notes,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">
            {application ? 'Edit Application' : 'New Job Application'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
              <input
                required
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Google, Stripe, Amdocs..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Role Title *</label>
              <input
                required
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Senior Java Backend Engineer"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as AppStatus)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="OFFER_RECEIVED">Offer Received</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date Applied</label>
              <input
                type="date"
                value={appliedDate}
                onChange={e => setAppliedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Job Description (for AI Match)
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste required skills & job description..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Resume Snapshot (paste resume text / key skills)
            </label>
            <textarea
              rows={3}
              value={resumeSnapshot}
              onChange={e => setResumeSnapshot(e.target.value)}
              placeholder="Paste your skills, experience summary..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Referral name, salary range, recruiter contact..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            >
              {application ? 'Update' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
