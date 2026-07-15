import { useEffect, useState, useMemo } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button, Badge } from '@/components/ui'
import { Users, Loader2, AlertCircle, UserCheck, Calendar, XCircle } from 'lucide-react'
import { api } from '@/services/api'

export default function Recruitment() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState({})
  const [selectedJob, setSelectedJob] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await api.get('/placement-applications')
        const data = result?.data || result || []
        
        const mapped = data.map((app) => {
          const studentName = app.student_table?.user_table?.name || 'Student'
          const deptName = app.student_table?.department_table?.department_name || 'N/A'
          const cgpaVal = app.student_table?.cgpa || 'N/A'
          const title = app.placement_table?.title || 'Placement Job'
          
          let statusStr = 'Applied'
          if (app.status_id === 2) statusStr = 'Shortlisted'
          if (app.status_id === 3) statusStr = 'Rejected'

          return {
            application_id: `${app.placement_id}-${app.student_id}`,
            placement_id: app.placement_id,
            student_id: app.student_id,
            student_name: studentName,
            placement_title: title,
            job_title: title,
            department_name: deptName,
            branch: deptName,
            cgpa: cgpaVal,
            status: statusStr,
          }
        })
        setApplications(mapped)
      } catch (err) {
        setError(err.message || 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const filteredApplications = useMemo(() => {
    if (!selectedJob) return applications
    return applications.filter((app) => String(app.placement_id) === String(selectedJob))
  }, [applications, selectedJob])

  const updateStatus = async (applicationId, status) => {
    const [placementId, studentId] = applicationId.split('-')
    try {
      setActionLoading({ ...actionLoading, [applicationId]: status })
      await api.patch(`/placement-applications/${placementId}/students/${studentId}/status`, { status })
      setApplications(applications.map((app) =>
        app.application_id === applicationId ? { ...app, status } : app
      ))
    } catch (err) {
      setError(err.message || `Failed to update status to ${status}`)
    } finally {
      setActionLoading({ ...actionLoading, [applicationId]: null })
    }
  }

  return (
    <DashboardShell title="Recruitment" subtitle="Review and manage student applications">
      <Card>
        <CardHeader
          title="Applications"
          subtitle={`${applications.length} applications`}
          actions={
            <div className="relative">
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="appearance-none w-48 px-3 py-1.5 pr-8 rounded-lg bg-orbit-surface2 border border-orbit-border text-xs text-slate-200 cursor-pointer"
              >
                <option value="">All Jobs</option>
                {applications
                  .filter((app, i, arr) => arr.findIndex((a) => (a.placement_id || a.job_id) === (app.placement_id || app.job_id)) === i)
                  .map((app) => (
                    <option key={app.placement_id || app.job_id} value={app.placement_id || app.job_id}>
                      {app.job_title || app.placement_title || `Job ${app.placement_id || app.job_id}`}
                    </option>
                  ))}
              </select>
            </div>
          }
        />
        <CardBody>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 mb-4">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 text-slate-400 py-8">
              <Loader2 size={18} className="animate-spin" /> Loading applications...
            </div>
          )}

          {!loading && filteredApplications.length === 0 && !error && (
            <div className="text-sm text-slate-500 text-center py-8">
              No applications received yet.
            </div>
          )}

          {!loading && filteredApplications.length > 0 && (
            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <div
                  key={app.application_id || app.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-orbit-border hover:border-orbit-border2 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Users size={14} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{app.student_name || 'Student'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {app.job_title || app.placement_title || 'Position'} • {app.department_name || ''}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        CGPA: {app.cgpa || 'N/A'} {app.branch ? `• ${app.branch}` : ''}
                      </p>
                      <div className="mt-1.5">
                        <Badge variant={app.status === 'Shortlisted' ? 'success' : app.status === 'Interview' ? 'warning' : app.status === 'Rejected' ? 'danger' : 'info'}>
                          {app.status || 'Applied'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => updateStatus(app.application_id || app.id, 'Shortlisted')}
                      loading={actionLoading[app.application_id || app.id] === 'Shortlisted'}
                      icon={<UserCheck size={12} />}
                    >
                      Shortlist
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => updateStatus(app.application_id || app.id, 'Interview')}
                      loading={actionLoading[app.application_id || app.id] === 'Interview'}
                      icon={<Calendar size={12} />}
                    >
                      Interview
                    </Button>
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() => updateStatus(app.application_id || app.id, 'Rejected')}
                      loading={actionLoading[app.application_id || app.id] === 'Rejected'}
                      icon={<XCircle size={12} />}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
