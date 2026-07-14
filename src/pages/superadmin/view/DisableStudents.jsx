import { useEffect, useState } from "react"
import DashboardShell from "../../../components/DashboardShell"
import { Card, CardBody, Button, Badge } from "../../../components/ui"
import { Loader2, GraduationCap } from "lucide-react"
import { api } from "../../../services/api"

export default function DisableStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const load = async () => {
    try {
      const res = await api.get("/students/")
      setStudents(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleGraduate = async (student) => {
    setUpdating(student.user_id)
    try {
      await api.put(`/students/${student.user_id}`, { is_graduate: !student.is_graduate })
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <DashboardShell title="Disable Students" subtitle="Manage student active/graduate status">
      {loading ? (
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
              <Loader2 size={18} className="animate-spin" />
              Loading students...
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orbit-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll No</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.user_id} className="border-b border-orbit-border/50 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{s.roll_no || "—"}</td>
                    <td className="px-5 py-3 text-slate-200 font-medium">{s.user_table.name || "Unknown"}</td>
                    <td className="px-5 py-3">
                      <Badge variant={s.is_active === false ? "neutral" : "primary"}>
                        {s.is_active === false ? "Inactive" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Button
                        size="sm"
                        variant={s.is_graduate ? "outline" : "destructive"}
                        onClick={() => toggleGraduate(s)}
                        loading={updating === s.user_id}
                      >
                        {s.is_graduate ? "Enable" : "Disable"}
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
