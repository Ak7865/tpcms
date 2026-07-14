import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody, Button } from '@/components/ui'
import { Search, Loader2, AlertCircle, UserX } from 'lucide-react'
import { fetchStudentsForRole, filterStudents, disableStudent } from '@/services/students'

export default function DisableStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [disabling, setDisabling] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStudentsForRole()
      .then(setStudents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filterStudents(students, { search })

  const handleDisable = async (userId) => {
    if (!confirm('Mark this student as graduated/disabled?')) return
    setDisabling(userId)
    setMessage('')
    try {
      await disableStudent(userId)
      setStudents((prev) =>
        prev.map((s) => (s.user_id === userId ? { ...s, is_active: false } : s))
      )
      setMessage('Student disabled successfully')
    } catch (err) {
      setError(err.message || 'Failed to disable student')
    } finally {
      setDisabling(null)
    }
  }

  return (
    <DashboardShell title="Disable Students" subtitle="Search students and disable placement access">
      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by roll no or name..."
          className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 py-2.5 pl-10 pr-4 text-slate-200"
        />
      </div>

      <Card>
        <CardHeader title="Student List" subtitle="Disable students from placement activities" />
        <CardBody>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              {message}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((s) => (
                <div
                  key={s.user_id}
                  className="flex items-center justify-between rounded-lg border border-orbit-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.roll_no} • {s.department_name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!s.is_active || disabling === s.user_id}
                    loading={disabling === s.user_id}
                    icon={<UserX size={14} />}
                    onClick={() => handleDisable(s.user_id)}
                  >
                    Disable
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
