import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { AlertCircle, BookOpenCheck, Plus } from 'lucide-react'
import { api } from '@/services/api'
import MediaUpload from '@/components/ui/MediaUpload'

export default function PostTraining() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    min_cgpa: '',
    start_date: '',
    end_date: '',
    last_date_of_submission: '',
    image_url: '',
    is_active: true,
  })

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      await api.post('/trainings', {
        title: form.title,
        description: form.description || undefined,
        min_cgpa: form.min_cgpa ? parseFloat(form.min_cgpa) : undefined,
        start_date: form.start_date ? new Date(form.start_date).toISOString() : undefined,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : undefined,
        last_date_of_submission: form.last_date_of_submission
          ? new Date(form.last_date_of_submission).toISOString()
          : undefined,
        image_url: form.image_url || undefined,
        is_active: form.is_active,
      })
      setSuccess('Training posted successfully')
      setForm({
        title: '',
        description: '',
        min_cgpa: '',
        start_date: '',
        end_date: '',
        last_date_of_submission: '',
        image_url: '',
        is_active: true,
      })
    } catch (err) {
      setError(err.message || 'Failed to post training')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardShell title="Post New Training" subtitle="Create a training program with banner image">
      <Card>
        <CardHeader title="Training Details" />
        <CardBody>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <BookOpenCheck size={14} /> {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs text-slate-400">Title *</label>
                <input required value={form.title} onChange={update('title')} className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Min CGPA</label>
                <input type="number" step="0.01" value={form.min_cgpa} onChange={update('min_cgpa')} className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Submission Deadline</label>
                <input type="date" value={form.last_date_of_submission} onChange={update('last_date_of_submission')} className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Start Date</label>
                <input type="date" value={form.start_date} onChange={update('start_date')} className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">End Date</label>
                <input type="date" value={form.end_date} onChange={update('end_date')} className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs text-slate-400">Description</label>
                <textarea rows={3} value={form.description} onChange={update('description')} className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200" />
              </div>
              <div className="md:col-span-2">
                <MediaUpload label="Training Banner" value={form.image_url} uploadPath="/uploads/banner" onChange={(url) => setForm((p) => ({ ...p, image_url: url }))} accept="image/*" />
              </div>
            </div>
            <Button type="submit" loading={saving} icon={<Plus size={14} />}>Post Training</Button>
          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
