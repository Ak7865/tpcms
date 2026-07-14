import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import api from '@/services/api'

const STATUS_MAP = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
}

const statusColors = {
  Pending: 'bg-blue-500/15 text-blue-400',
  Approved: 'bg-emerald-500/15 text-emerald-400',
  Rejected: 'bg-red-500/15 text-red-400',
}

export default function DepartmentApplications() {
  const [applications, setApplications] = useState([])
  const [students, setStudents] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [placementApps, trainingApps] = await Promise.all([
          api.get('/placement-applications').catch(() => ({ data: [] })),
          api.get('/training-applications').catch(() => ({ data: [] })),
        ])
        const combined = [
          ...(placementApps?.data || []).map((a) => ({ ...a, type: 'Placement' })),
          ...(trainingApps?.data || []).map((a) => ({ ...a, type: 'Training' })),
        ]
        setApplications(combined)

        const ids = [...new Set(combined.map((a) => a.student_id).filter(Boolean))]
        const profiles = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await api.get(`/students/${id}`)
              return res?.data
            } catch {
              return null
            }
          })
        )
        const map = {}
        profiles.filter(Boolean).forEach((p) => { map[p.user_id] = p })
        setStudents(map)
      } catch (err) {
        setError(err.message || 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const approveApplication = async (app) => {
    const key = `${app.type}-${app.placement_id || app.training_id}-${app.student_id}`
    setActionLoading(key)
    try {
      if (app.type === 'Placement') {
        await api.patch(
          `/placement-applications/${app.placement_id}/students/${app.student_id}/status`
        )
      } else {
        await api.post(
          `/training-applications/${app.training_id}/students/${app.student_id}/status`
        )
      }
      setApplications((prev) =>
        prev.map((a) =>
          a === app || (a.placement_id === app.placement_id && a.training_id === app.training_id && a.student_id === app.student_id)
            ? { ...a, status_id: 1 }
            : a
        )
      )
    } catch (err) {
      setError(err.message || 'Failed to approve')
    } finally {
      setActionLoading('')
    }
  }

  return (
    <DashboardShell title="Department Applications" subtitle="Placement and training applications for your department">
      <Card>
        <CardHeader title="Applications" subtitle={`${applications.length} total`} />
        <CardBody>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : applications.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No applications found.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-6 gap-3 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                <span className="col-span-2">Student</span>
                <span>Type</span>
                <span>Program</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {applications.map((app, i) => {
                const student = students[app.student_id] || {}
                const status = STATUS_MAP[app.status_id] || 'Pending'
                const title =
                  app.placement_table?.title ||
                  app.training_table?.title ||
                  app.title ||
                  '—'
                const key = `${app.type}-${app.placement_id || app.training_id}-${app.student_id}-${i}`
                return (
                  <div
                    key={key}
                    className="grid grid-cols-6 items-center gap-3 rounded-lg border border-orbit-border px-3 py-2.5"
                  >
                    <div className="col-span-2">
                      <p className="truncate text-sm text-slate-200">{student.name || `Student #${app.student_id}`}</p>
                      <p className="text-[10px] text-slate-600">{student.roll_no || ''}</p>
                    </div>
                    <span className="text-sm text-slate-400">{app.type}</span>
                    <span className="truncate text-sm text-slate-400">{title}</span>
                    <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[status]}`}>
                      {status}
                    </span>
                    <div>
                      {app.status_id === 0 && (
                        <Button
                          size="xs"
                          variant="outline"
                          loading={actionLoading === `${app.type}-${app.placement_id || app.training_id}-${app.student_id}`}
                          icon={<CheckCircle size={12} />}
                          onClick={() => approveApplication(app)}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
