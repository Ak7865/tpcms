import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardShell from "../../../components/DashboardShell"
import { Card, CardBody, Badge, Button } from "../../../components/ui"
import { Loader2, GraduationCap, Pencil } from "lucide-react"
import { fetchDepartments } from "./departmentApi"

export default function ViewDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDepartments()
        setDepartments(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleEdit = (departmentId) => {
    navigate(
      `/super-admin/dashboard?view=edit-department&id=${departmentId}`
    )
  }

  return (
    <DashboardShell title="View Departments" subtitle="All departments">
      {loading ? (
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
              <Loader2 size={18} className="animate-spin" />
              Loading departments...
            </div>
          </CardBody>
        </Card>
      ) : departments.length === 0 ? (
        <Card>
          <CardBody>
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <GraduationCap size={40} className="opacity-40" />
              <p className="text-sm">No departments found.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orbit-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Coordinator Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr
                    key={d.department_id}
                    className="border-b border-orbit-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">
                      {d.department_id}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-200">
                      {d.department_name}
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {d.user_table?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">
                      {d.user_table?.email || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={d.is_active ? "success" : "neutral"}>
                        {d.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Button
                        size="sm"
                        icon={<Pencil size={13} />}
                        onClick={() => handleEdit(d.department_id)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardShell>
  )
}
