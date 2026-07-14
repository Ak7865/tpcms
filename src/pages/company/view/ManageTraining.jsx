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
                <div key={t.training_id || t.id} className="flex gap-4 rounded-lg border border-orbit-border p-4">
                  {t.image_url?.startsWith('data:image') && (
                    <img src={t.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-200">{t.title}</p>
                    <p className="text-xs text-slate-500">Min CGPA: {t.min_cgpa ?? 'N/A'} • {t.is_active ? 'Active' : 'Inactive'}</p>
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
