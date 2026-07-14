import { useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { Bell, Plus, AlertCircle } from 'lucide-react'
import MediaUpload from '@/components/ui/MediaUpload'
import { getNotices, saveNotice } from '@/utils/noticesStore'

const NOTICE_TYPES = ['General', 'Off Campus', 'Government']

export default function Notices({ defaultType = 'General' }) {
  const [notices, setNotices] = useState(getNotices())
  const [showForm, setShowForm] = useState(defaultType === 'General')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    notice_type: defaultType,
    media_url: '',
  })

  const filtered = defaultType === 'General'
    ? notices
    : notices.filter((n) => n.notice_type === defaultType)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    const entry = saveNotice(form)
    setNotices(getNotices())
    setForm({ title: '', description: '', notice_type: defaultType, media_url: '' })
    setShowForm(false)
    return entry
  }

  const titleMap = {
    General: 'Post Notice',
    'Off Campus': 'Off Campus Jobs',
    Government: 'Government Jobs',
  }

  return (
    <DashboardShell
      title={titleMap[defaultType] || 'Notices'}
      subtitle="Post notices with image or PDF attachments"
    >
      <Card>
        <CardHeader
          title={titleMap[defaultType]}
          subtitle={`${filtered.length} notices`}
          actions={
            defaultType === 'General' ? (
              <Button size="sm" icon={<Plus size={14} />} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'New Notice'}
              </Button>
            ) : (
              <Button size="sm" icon={<Plus size={14} />} onClick={() => setShowForm(true)}>
                Post New
              </Button>
            )
          }
        />
        <CardBody>
          {(showForm || defaultType !== 'General') && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border border-orbit-border bg-orbit-surface2 p-4">
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2.5 text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2.5 text-sm text-slate-200"
                />
              </div>
              {defaultType === 'General' && (
                <div>
                  <label className="mb-1.5 block text-xs text-slate-400">Notice Type</label>
                  <select
                    value={form.notice_type}
                    onChange={(e) => setForm((p) => ({ ...p, notice_type: e.target.value }))}
                    className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2.5 text-sm text-slate-200"
                  >
                    {NOTICE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
              <MediaUpload
                label="Attachment (Image or PDF)"
                value={form.media_url}
                onChange={(url) => setForm((p) => ({ ...p, media_url: url }))}
              />
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <Button type="submit" icon={<Bell size={14} />}>Publish Notice</Button>
            </form>
          )}

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No notices posted yet.</p>
            ) : (
              filtered.map((notice) => (
                <div key={notice.notice_id} className="rounded-lg border border-orbit-border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{notice.title}</p>
                      {notice.description && (
                        <p className="mt-1 text-xs text-slate-500">{notice.description}</p>
                      )}
                      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        notice.notice_type === 'Government'
                          ? 'bg-amber-500/15 text-amber-400'
                          : notice.notice_type === 'Off Campus'
                            ? 'bg-cyan-500/15 text-cyan-400'
                            : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {notice.notice_type}
                      </span>
                    </div>
                    {notice.media_url && notice.media_url.startsWith('data:image') && (
                      <img src={notice.media_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    )}
                  </div>
                  <p className="mt-2 text-[10px] text-slate-600">
                    {new Date(notice.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
