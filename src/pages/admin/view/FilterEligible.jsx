import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Filter, Loader2, AlertCircle, Search } from 'lucide-react'
import api from '@/services/api'
import { fetchStudentsForRole, filterStudents } from '@/services/students'

export default function FilterEligible() {
  const [placements, setPlacements] = useState([])
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedPlacement, setSelectedPlacement] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [placementRes, studentList, deptRes] = await Promise.all([
          api.get('/placements'),
          fetchStudentsForRole(),
          api.get('/departments/').catch(() => ({ data: [] })),
        ])
        setPlacements(Array.isArray(placementRes?.data) ? placementRes.data : [])
        setStudents(studentList)
        setDepartments(deptRes?.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const placement = placements.find(
    (p) => String(p.placement_id || p.id) === String(selectedPlacement)
  )
  const minCgpa = placement?.min_cgpa ? parseFloat(placement.min_cgpa) : 0

  const eligible = filterStudents(students, { search, departmentId }).filter((s) => {
    if (!selectedPlacement) return true
    const cgpa = parseFloat(s.cgpa)
    if (Number.isNaN(cgpa)) return false
    return cgpa >= minCgpa && s.is_active !== false
  })

  return (
    <DashboardShell title="Filter Eligible Students" subtitle="Filter by department, search by roll no or name, match placement CGPA">
      <Card>
        <CardHeader title="Filters" subtitle="Select placement and apply department/search filters" />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">Placement / Job</label>
              <select
                value={selectedPlacement}
                onChange={(e) => setSelectedPlacement(e.target.value)}
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200"
              >
                <option value="">All (no CGPA filter)</option>
                {placements.map((p) => (
                  <option key={p.placement_id || p.id} value={p.placement_id || p.id}>
                    {p.title} {p.min_cgpa ? `(min ${p.min_cgpa})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 px-3 py-2.5 text-sm text-slate-200"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>{d.dept_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Roll no or name..."
                  className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 py-2.5 pl-9 pr-3 text-sm text-slate-200"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {loading ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Filter size={14} /> Eligible Students ({eligible.length})
                {placement && minCgpa > 0 && (
                  <span className="font-normal normal-case text-slate-600">• min CGPA {minCgpa}</span>
                )}
              </h3>
              {eligible.length === 0 ? (
                <p className="text-sm text-slate-500">No eligible students found.</p>
              ) : (
                eligible.map((student) => (
                  <div
                    key={student.user_id}
                    className="flex items-center justify-between rounded-lg border border-orbit-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.roll_no} • {student.department_name}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                      CGPA: {student.cgpa ?? 'N/A'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
