import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { api } from '@/services/api'

export default function ManageJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const result = await api.get('/placements')
        const data = result?.data || []
        if (!cancelled) setJobs(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load jobs')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <DashboardShell title="Manage Jobs" subtitle="View your posted placements">
      <Card>
        <CardHeader title="Your Placements" subtitle={`${jobs.length} posted jobs`} />
        <CardBody>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No jobs posted yet.</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.placement_id || job.id}
                  className="flex items-start justify-between rounded-lg border border-orbit-border p-4"
                >
                  <div className="flex gap-4">
                    {job.image_url && (
                      <img src={job.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-200">{job.title || 'Untitled Job'}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Min CGPA: {job.min_cgpa ?? 'N/A'} •{' '}
                        {job.is_active ? 'Active' : 'Inactive'}
                      </p>
                      {job.last_date_of_submission && (
                        <p className="text-xs text-slate-600">
                          Deadline: {new Date(job.last_date_of_submission).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={`?view=recruitment&job=${job.placement_id || job.id}`}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
                    title="View Applications"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
