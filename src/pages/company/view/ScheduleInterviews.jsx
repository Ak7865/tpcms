import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { Calendar, Loader2, AlertCircle, Clock } from 'lucide-react'
import { api } from '@/services/api'

export default function ScheduleInterviews() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    application_id: '',
    date: '',
    time: '',
    mode: 'Online',
    meeting_link: '',
    notes: '',
  })

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await api.get('/interviews/company')
        const data = result?.data || []
        setInterviews(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Failed to load interviews')
      } finally {
        setLoading(false)
      }
    }
    fetchInterviews()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.post('/interviews', {
        application_id: Number(form.application_id),
        date: form.date,
        time: form.time,
        mode: form.mode,
        meeting_link: form.meeting_link,
        notes: form.notes,
      })
      setShowForm(false)
      setForm({
        application_id: '',
        date: '',
        time: '',
        mode: 'Online',
        meeting_link: '',
        notes: '',
      })
      const result = await api.get('/interviews/company')
      setInterviews(result?.data || [])
    } catch (err) {
      setError(err.message || 'Failed to schedule interview')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardShell title="Schedule Interviews" subtitle="Manage interview schedules for candidates">
      <Card>
        <CardHeader
          title="Interview Schedule"
          subtitle={`${interviews.length} scheduled interviews`}
          actions={
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Schedule Interview'}
            </Button>
          }
        />
        <CardBody>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 mb-4">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg border border-orbit-border bg-orbit-surface2 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200">New Interview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Application ID *</label>
                  <input
                    type="number"
                    value={form.application_id}
                    onChange={update('application_id')}
                    required
                    className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600"
                    placeholder="Application ID"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={update('date')}
                    required
                    className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Time *</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={update('time')}
                    required
                    className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Mode</label>
                  <div className="relative">
                    <select
                      value={form.mode}
                      onChange={update('mode')}
                      className="appearance-none w-full px-4 py-2.5 pr-8 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 cursor-pointer"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Meeting Link</label>
                  <input
                    type="url"
                    value={form.meeting_link}
                    onChange={update('meeting_link')}
                    className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600"
                    placeholder="https://meet.example.com/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={update('notes')}
                    rows={2}
                    className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 resize-none"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <Button type="submit" loading={saving}>
                Schedule Interview
              </Button>
            </form>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 text-slate-400 py-8">
              <Loader2 size={18} className="animate-spin" /> Loading interviews...
            </div>
          )}

          {!loading && interviews.length === 0 && !error && !showForm && (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
              <Clock size={18} /> No interviews scheduled yet.
            </div>
          )}

          {!loading && interviews.length > 0 && (
            <div className="space-y-3">
              {interviews.map((interview, i) => (
                <div
                  key={interview.interview_id || interview.id || i}
                  className="flex items-center justify-between p-4 rounded-lg border border-orbit-border hover:border-orbit-border2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                      <Calendar size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {interview.student_name || `Application ${interview.application_id}`}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {interview.job_title || interview.position || 'Position'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-200">
                      {interview.date ? new Date(interview.date).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {interview.time || ''} {interview.mode ? `• ${interview.mode}` : ''}
                    </p>
                    {interview.meeting_link && (
                      <a
                        href={interview.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-orbit-primary-light hover:text-orbit-accent mt-1 inline-block"
                      >
                        Join Link
                      </a>
                    )}
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
