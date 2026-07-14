import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Search, Filter, ChevronDown, Loader2, AlertCircle } from 'lucide-react'
import api from '@/services/api'
import { fetchStudentsForRole, filterStudents } from '@/services/students'

export default function ViewStudents() {
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [studentList, deptRes] = await Promise.all([
          fetchStudentsForRole(),
          api.get('/departments/').catch(() => ({ data: [] })),
        ])
        setStudents(studentList)
        setDepartments(deptRes?.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load students')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = filterStudents(students, { search, departmentId })

  return (
    <DashboardShell title="View Students" subtitle="Search by roll number or name, filter by department">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or roll number..."
            className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 py-2.5 pl-10 pr-4 text-slate-200"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="appearance-none rounded-lg border border-orbit-border bg-orbit-surface2 py-2.5 pl-9 pr-8 text-slate-200"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>{d.dept_name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <Card>
        <CardHeader title="Students" subtitle={`${filtered.length} of ${students.length} students`} />
        <CardBody>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading students...
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No students match your filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-orbit-border text-left text-[10px] uppercase tracking-wider text-slate-600">
                    <th className="px-3 py-2">Roll No</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Department</th>
                    <th className="px-3 py-2">CGPA</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orbit-border">
                  {filtered.map((s) => (
                    <tr key={s.user_id} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-2.5 font-mono text-slate-300">{s.roll_no}</td>
                      <td className="px-3 py-2.5 text-slate-200">{s.name}</td>
                      <td className="px-3 py-2.5 text-slate-400">{s.department_name}</td>
                      <td className="px-3 py-2.5 text-emerald-400">{s.cgpa ?? '—'}</td>
                      <td className="px-3 py-2.5 text-slate-500">{s.email}</td>
                      <td className="px-3 py-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                          {s.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
