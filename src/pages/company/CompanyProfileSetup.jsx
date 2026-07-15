import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Save } from 'lucide-react'
import api from '@/services/api'
import MediaUpload from '@/components/ui/MediaUpload'
import { Button } from '@/components/ui'
import {
  getAuthUser,
  markCompanyProfileComplete,
  saveAuthUser,
  DASHBOARD_PATHS,
} from '@/utils/auth'

export default function CompanyProfileSetup() {
  const navigate = useNavigate()
  const user = getAuthUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [sectors, setSectors] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    banner_url: '',
    website: '',
    industry: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const orgId = user.user_id
        const [orgRes, sectorsRes] = await Promise.all([
          api.get(`/organizations/${orgId}`).catch(() => null),
          api.get(`/masters/sectors`).catch(() => null),
        ])
        
        const data = orgRes?.data?.data ?? orgRes?.data ?? user
        const sectorsData = sectorsRes?.data?.data ?? sectorsRes?.data ?? []
        setSectors(sectorsData)

        setForm({
          name: data.name || user.name || '',
          description: data.description || '',
          logo_url: data.logo_url || data.image_url || '',
          banner_url: data.banner_url || '',
          website: data.website || '',
          industry: data.industry || '',
        })
      } catch {
        setForm({
          name: user.name || '',
          description: '',
          logo_url: '',
          banner_url: '',
          website: '',
          industry: '',
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.user_id, user.name])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const extras = {
        description: form.description,
        logo_url: form.logo_url,
        banner_url: form.banner_url,
        website: form.website,
        industry: form.industry,
      }
      localStorage.setItem(`company_extras_${user.user_id}`, JSON.stringify(extras))
      markCompanyProfileComplete(user.user_id)
      saveAuthUser({ name: form.name, ...extras })
      navigate(`${DASHBOARD_PATHS.Company}?view=dashboard`)
    } catch (err) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (user.approval_id === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orbit-bg px-6">
        <div className="max-w-md rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
          <Building2 className="mx-auto mb-4 h-10 w-10 text-amber-400" />
          <h1 className="text-xl font-bold text-slate-100">Awaiting Approval</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your organization registration is pending Super Admin approval. You will be able to complete your profile after approval.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orbit-bg text-slate-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orbit-bg px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <Building2 className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-100">Set Up Company Profile</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add your company branding and details before posting jobs and trainings.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-orbit-border bg-orbit-surface p-6">
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Company Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Industry / Sector</label>
            <select
              value={form.industry}
              onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
              className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200 outline-none appearance-none"
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
            <label className="mb-1.5 block text-xs text-slate-400">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200"
              placeholder="https://company.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">About Company</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200"
            />
          </div>
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
            hint="Used on job posts and recruitment pages"
          />
          <Button type="submit" loading={saving} className="w-full" icon={<Save className="h-4 w-4" />}>
            Save & Go to Dashboard
          </Button>
        </form>
      </div>
    </div>
  )
}
