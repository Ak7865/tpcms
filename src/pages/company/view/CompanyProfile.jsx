import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { Loader2, AlertCircle, Save } from 'lucide-react'
import { api } from '@/services/api'

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile_no: '',
    address: '',
    website: '',
    description: '',
    industry: '',
  })

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setSuccess('')
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const result = await api.get('/company/profile')
        const data = result?.data || result
        setProfile(data)
        setForm({
          name: data.name || data.company_name || '',
          email: data.email || '',
          mobile_no: data.mobile_no || data.contact_number || '',
          address: data.address || '',
          website: data.website || '',
          description: data.description || '',
          industry: data.industry || data.company_type || '',
        })
      } catch (err) {
        setError(err.message || 'Failed to load company profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      const payload = {
        name: form.name,
        email: form.email,
        mobile_no: form.mobile_no,
        address: form.address,
        website: form.website,
        description: form.description,
        industry: form.industry,
      }
      await api.put('/company/profile', payload)
      setSuccess('Profile updated successfully')
      setEditing(false)
      setProfile({ ...profile, ...payload })
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell title="Company Profile" subtitle="View and edit your company details">
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-2 text-slate-400 py-12">
              <Loader2 size={18} className="animate-spin" /> Loading profile...
            </div>
          </CardBody>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Company Profile" subtitle="View and edit your company details">
      <Card>
        <CardHeader
          title="Company Information"
          subtitle={editing ? 'Update your details' : 'Your registered company details'}
          actions={
            !editing ? (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            ) : null
          }
        />
        <CardBody>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 mb-4">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 mb-4">
              <Save size={14} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  required
                  disabled={!editing}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Industry</label>
                <input
                  type="text"
                  value={form.industry}
                  onChange={update('industry')}
                  disabled={!editing}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50"
                  placeholder="e.g. IT Services"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                  disabled={!editing}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50"
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  value={form.mobile_no}
                  onChange={update('mobile_no')}
                  disabled={!editing}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50"
                  placeholder="10-digit number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={update('address')}
                  disabled={!editing}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50"
                  placeholder="Company address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={update('website')}
                  disabled={!editing}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50"
                  placeholder="https://company.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={update('description')}
                  disabled={!editing}
                  rows={3}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50 resize-none"
                  placeholder="Brief description about the company"
                />
              </div>
            </div>

            {editing && (
              <div className="flex items-center gap-3">
                <Button type="submit" loading={saving} icon={<Save size={14} />}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false)
                    setSuccess('')
                    setError('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
