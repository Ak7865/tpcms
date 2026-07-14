import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { AlertCircle, Briefcase, Plus } from 'lucide-react'
import { api } from '@/services/api'
import MediaUpload from '@/components/ui/MediaUpload'

export default function PostJob() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    min_cgpa: '',
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
      const payload = {
        title: form.title,
        description: form.description || undefined,
        min_cgpa: form.min_cgpa ? parseFloat(form.min_cgpa) : undefined,
        last_date_of_submission: form.last_date_of_submission
          ? new Date(form.last_date_of_submission).toISOString()
          : undefined,
        image_url: form.image_url || undefined,
        is_active: form.is_active,
      }
      await api.post('/placements', payload)
      setSuccess('Job posted successfully')
      setForm({
        title: '',
        description: '',
        min_cgpa: '',
        last_date_of_submission: '',
        image_url: '',
        is_active: true,
      })
    } catch (err) {
      setError(err.message || 'Failed to post job')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardShell title="Post New Job" subtitle="Create a placement with optional banner image">
      <Card>
        <CardHeader title="Job Details" subtitle="Fill in the job information" />
        <CardBody>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <Briefcase size={14} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Job Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={update('title')}
                  required
                  className="auth-input w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-4 py-2.5 text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={form.min_cgpa}
                  onChange={update('min_cgpa')}
                  className="auth-input w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-4 py-2.5 text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Last Date of Submission</label>
                <input
                  type="date"
                  value={form.last_date_of_submission}
                  onChange={update('last_date_of_submission')}
                  className="auth-input w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-4 py-2.5 text-sm text-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Description</label>
                <textarea
                  value={form.description}
                  onChange={update('description')}
                  rows={4}
                  className="auth-input w-full resize-none rounded-lg border border-orbit-border bg-orbit-surface2 px-4 py-2.5 text-sm text-slate-200"
                />
              </div>
              <div className="md:col-span-2">
                <MediaUpload
                  label="Job Banner / Notification Image"
                  value={form.image_url}
                  onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
                  accept="image/*"
                />
              </div>
            </div>
            <Button type="submit" loading={saving} icon={<Plus size={14} />}>
              Post Job
            </Button>
          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
