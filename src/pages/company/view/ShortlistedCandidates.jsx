import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { UserCheck, Loader2, AlertCircle } from 'lucide-react'
import { api } from '@/services/api'

export default function ShortlistedCandidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await api.get('/placement-applications')
        const data = result?.data || result || []
        const filtered = data
          .filter((app) => app.status_id === 2)
          .map((app) => {
            const studentName = app.student_table?.user_table?.name || 'Student'
            const deptName = app.student_table?.department_table?.department_name || 'N/A'
            const cgpaVal = app.student_table?.cgpa || 'N/A'
            const title = app.placement_table?.title || 'Placement Job'

            return {
              application_id: `${app.placement_id}-${app.student_id}`,
              student_name: studentName,
              job_title: title,
              placement_title: title,
              department_name: deptName,
              branch: deptName,
              cgpa: cgpaVal,
              shortlisted_on: app.date_of_submission || null,
            }
          })
        setCandidates(filtered)
      } catch (err) {
        setError(err.message || 'Failed to load shortlisted candidates')
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [])

  return (
    <DashboardShell title="Shortlisted Candidates" subtitle="Students shortlisted for your job postings">
      <Card>
        <CardHeader title="Shortlisted" subtitle={`${candidates.length} candidates`} />
        <CardBody>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 mb-4">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 text-slate-400 py-8">
              <Loader2 size={18} className="animate-spin" /> Loading candidates...
            </div>
          )}

          {!loading && candidates.length === 0 && !error && (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
              <UserCheck size={18} /> No shortlisted candidates yet.
            </div>
          )}

          {!loading && candidates.length > 0 && (
            <div className="space-y-3">
              {candidates.map((candidate, i) => (
                <div
                  key={candidate.application_id || candidate.id || i}
                  className="flex items-center justify-between p-4 rounded-lg border border-orbit-border hover:border-orbit-border2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <UserCheck size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{candidate.student_name || 'Student'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {candidate.job_title || candidate.placement_title || 'Position'} • {candidate.department_name || ''}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        CGPA: {candidate.cgpa || 'N/A'} {candidate.branch ? `• ${candidate.branch}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                      Shortlisted
                    </span>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {candidate.shortlisted_on ? new Date(candidate.shortlisted_on).toLocaleDateString() : 'N/A'}
                    </p>
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
