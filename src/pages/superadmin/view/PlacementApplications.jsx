import { useEffect, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Badge, Button } from "../../../components/ui";
import {
  Loader2,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { api } from "../../../services/api";

const STATUS = { 0: "Pending", 1: "Approved" };
const STATUS_VARIANT = { 0: "warning", 1: "success" };

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PlacementApplications() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(null);

  useEffect(() => { loadApps(); }, []);

  async function loadApps() {
    try {
      setLoading(true);
      const res = await api.get("/placement-applications");
      const data = res?.data?.data || res?.data || [];
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(placementId, studentId) {
    const key = `${placementId}-${studentId}`;
    try {
      setProcessing(key);
      await api.patch(`/placement-applications/${placementId}/students/${studentId}/status`);
      setApps((prev) =>
        prev.map((a) =>
          a.placement_id === placementId && a.student_id === studentId
            ? { ...a, status_id: 1 }
            : a
        )
      );
    } catch (err) {
      alert("Approve failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setProcessing(null);
    }
  }

  const total = apps.length;
  const pending = apps.filter((a) => a.status_id === 0).length;
  const approved = apps.filter((a) => a.status_id === 1).length;

  return (
    <DashboardShell title="Placement Applications" subtitle="Student applications for placement drives">
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total", value: total, icon: <Users size={22} className="text-orbit-primary" />, bg: "bg-orbit-primary/10" },
            { label: "Pending", value: pending, icon: <Clock size={22} className="text-amber-400" />, bg: "bg-amber-500/10" },
            { label: "Approved", value: approved, icon: <CheckCircle2 size={22} className="text-emerald-400" />, bg: "bg-emerald-500/10" },
          ].map((s) => (
            <Card key={s.label}>
              <CardBody className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>{s.icon}</div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-bold text-white mt-0.5">{s.value}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {loading ? (
          <Card><CardBody>
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading applications...
            </div>
          </CardBody></Card>
        ) : apps.length === 0 ? (
          <Card><CardBody>
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <BriefcaseBusiness size={40} className="opacity-30" />
              <p className="text-sm">No placement applications yet.</p>
            </div>
          </CardBody></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-orbit-border">
                    {["Placement", "Student ID", "Date Submitted", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => {
                    const key = `${a.placement_id}-${a.student_id}`;
                    const isProcessing = processing === key;
                    return (
                      <tr key={key} className="border-b border-orbit-border/50 hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 text-slate-200 font-medium">
                          <span className="flex items-center gap-2">
                            <BriefcaseBusiness size={14} className="text-orbit-primary flex-shrink-0" />
                            {a.placement_table?.title || `Placement #${a.placement_id}`}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400 font-mono text-xs">#{a.student_id}</td>
                        <td className="px-5 py-3 text-slate-400 text-xs">{fmtDate(a.date_of_submission)}</td>
                        <td className="px-5 py-3">
                          <Badge variant={STATUS_VARIANT[a.status_id] || "neutral"}>
                            {STATUS[a.status_id] ?? "Unknown"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          {a.status_id === 0 ? (
                            <Button
                              size="sm"
                              loading={isProcessing}
                              icon={<CheckCircle2 size={13} />}
                              onClick={() => handleApprove(a.placement_id, a.student_id)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 size={13} /> Approved
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
