import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Loader2, AlertCircle } from 'lucide-react'
import { api } from '@/services/api'

export default function ManageTraining() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/trainings/')
      .then((res) => setTrainings(Array.isArray(res?.data) ? res.data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardShell title="Manage Trainings" subtitle="Your posted training programs">
      <Card>
        <CardHeader title="Trainings" subtitle={`${trainings.length} programs`} />
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
          ) : trainings.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No trainings posted.</p>
          ) : (
            <div className="space-y-3">
              {trainings.map((t) => (
                <div key={t.training_id || t.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border border-orbit-border p-4 bg-orbit-surface">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {t.image_url && (
                      <img src={t.image_url} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border border-orbit-border bg-orbit-surface2" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{t.title}</p>
                      {t.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{t.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Min CGPA: {t.min_cgpa ?? 'N/A'}</span>
                        {t.last_date_of_submission && (
                          <span>• Apply by: {new Date(t.last_date_of_submission).toLocaleDateString()}</span>
                        )}
                        {(t.start_date || t.end_date) && (
                          <span>
                            • Program: {t.start_date ? new Date(t.start_date).toLocaleDateString() : 'N/A'} to {t.end_date ? new Date(t.end_date).toLocaleDateString() : 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border flex-shrink-0 ${
                    t.is_active 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-slate-700 text-slate-400 border-orbit-border'
                  }`}>
                    {t.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
