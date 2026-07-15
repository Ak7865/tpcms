import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { Loader2, AlertCircle, Save } from 'lucide-react'
import { api } from '@/services/api'
import MediaUpload from '@/components/ui/MediaUpload'

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sectors, setSectors] = useState([])
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
        const sectorsRes = await api.get('/masters/sectors').catch(() => null)
        const sectorsData = sectorsRes?.data?.data ?? sectorsRes?.data ?? []
        setSectors(sectorsData)

        const auth = JSON.parse(localStorage.getItem('auth_user') || '{}')
        const user = auth?.user || {}
        
        const extrasKey = `company_extras_${user.user_id}`
        const extras = JSON.parse(localStorage.getItem(extrasKey) || '{}')

        const mergedData = {
          name: user.name || '',
          email: user.email || '',
          mobile_no: user.mobile_no || extras.mobile_no || '',
          address: user.address || extras.address || '',
          website: extras.website || '',
          description: extras.description || '',
          industry: extras.industry || '',
          logo_url: extras.logo_url || '',
          banner_url: extras.banner_url || '',
        }

        setProfile(mergedData)
        setForm(mergedData)
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

      const auth = JSON.parse(localStorage.getItem('auth_user') || '{}')
      const user = auth?.user || {}

      const extrasKey = `company_extras_${user.user_id}`
      const extras = JSON.parse(localStorage.getItem(extrasKey) || '{}')

      const updatedExtras = {
        ...extras,
        website: form.website,
        description: form.description,
        industry: form.industry,
        mobile_no: form.mobile_no,
        address: form.address,
        logo_url: form.logo_url || extras.logo_url || '',
        banner_url: form.banner_url || extras.banner_url || '',
      }

      // Save extras to localStorage
      localStorage.setItem(extrasKey, JSON.stringify(updatedExtras))

      // Save user modifications to session
      const nextUser = {
        ...user,
        name: form.name,
        email: form.email,
        mobile_no: form.mobile_no,
        address: form.address,
      }

      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          ...auth,
          user: nextUser,
        })
      )

      // Find sector_id matching form.industry
      const selectedSector = sectors.find((s) => s.sector_name === form.industry)
      const sectorId = selectedSector ? selectedSector.sector_id : null

      // Update backend database user_table & organization_table values via specific organization route
      await api.put(`/organizations/${user.user_id}`, {
        name: form.name,
        email: form.email,
        mobile_no: form.mobile_no,
        sector_id: sectorId,
      })

      setProfile(form)
      setSuccess('Profile updated successfully')
      setEditing(false)
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
            {(form.logo_url || form.banner_url) && (
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-orbit-surface2 border border-orbit-border mb-6">
                {form.banner_url ? (
                  <img src={form.banner_url} alt="Company Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-orbit-surface/30 flex items-center justify-center text-slate-500 text-xs font-medium">No Banner Image Configured</div>
                )}
                {form.logo_url && (
                  <div className="absolute bottom-3 left-3 h-16 w-16 rounded-xl bg-orbit-surface border border-orbit-border overflow-hidden shadow-lg p-1.5 flex items-center justify-center">
                    <img src={form.logo_url} alt="Company Logo" className="max-h-full max-w-full object-contain rounded-lg" />
                  </div>
                )}
              </div>
            )}
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
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Industry / Sector</label>
                <select
                  value={form.industry}
                  onChange={update('industry')}
                  disabled={!editing}
                  className="auth-input w-full px-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50 outline-none appearance-none"
                >
                  <option value="" className="bg-orbit-surface">Select an Industry / Sector</option>
                  {sectors.map((sec) => (
                    <option key={sec.sector_id} value={sec.sector_name} className="bg-orbit-surface">
                      {sec.sector_name}
                    </option>
                  ))}
                </select>
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
              {editing && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-orbit-border pt-4 mt-2">
                  <MediaUpload
                    label="Company Logo"
                    accept="image/*"
                    value={form.logo_url}
                    uploadPath="/uploads/profile"
                    onChange={(url) => setForm((p) => ({ ...p, logo_url: url }))}
                  />
                  <MediaUpload
                    label="Company Banner"
                    accept="image/*"
                    value={form.banner_url}
                    uploadPath="/uploads/banner"
                    onChange={(url) => setForm((p) => ({ ...p, banner_url: url }))}
                  />
                </div>
              )}
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
