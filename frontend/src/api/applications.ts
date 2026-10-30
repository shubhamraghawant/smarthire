import client from './client'

export type AppStatus = 'APPLIED' | 'SCREENING' | 'INTERVIEW_SCHEDULED' | 'OFFER_RECEIVED' | 'REJECTED'

export interface Application {
  id: string
  userId: string
  userName: string
  companyName: string
  role: string
  jobDescription: string
  resumeSnapshot: string
  status: AppStatus
  appliedDate: string
  notes: string
  matchScore: number | null
  matchedSkills: string[]
  missingSkills: string[]
  createdAt: string
  updatedAt: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface DashboardStats {
  total: number
  applied: number
  screening: number
  interviewScheduled: number
  offerReceived: number
  rejected: number
  avgMatchScore: number
  appliedThisWeek: number
}

export interface AnalyzeResponse {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  suggestion: string
}

export const getApplications = (status?: AppStatus, page = 0, size = 20) =>
  client.get<PagedResponse<Application>>('/v1/applications', { params: { status, page, size } }).then(r => r.data)

export const getApplicationById = (id: string) =>
  client.get<Application>(`/v1/applications/${id}`).then(r => r.data)

export const createApplication = (data: Partial<Application>) =>
  client.post<Application>('/v1/applications', data).then(r => r.data)

export const updateApplication = (id: string, data: Partial<Application>) =>
  client.put<Application>(`/v1/applications/${id}`, data).then(r => r.data)

export const deleteApplication = (id: string) =>
  client.delete(`/v1/applications/${id}`)

export const updateStatus = (id: string, status: AppStatus) =>
  client.patch<Application>(`/v1/applications/${id}/status`, { status }).then(r => r.data)

export const analyzeMatch = (id: string) =>
  client.post<AnalyzeResponse>(`/v1/applications/${id}/analyze`).then(r => r.data)

export const getDashboardStats = () =>
  client.get<DashboardStats>('/v1/dashboard/stats').then(r => r.data)
