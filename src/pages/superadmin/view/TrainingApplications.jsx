import { useEffect, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Badge, Button } from "../../../components/ui";
import {
  Loader2,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Users,
  XCircle,
  Ban,
} from "lucide-react";
import { api } from "../../../services/api";

const STATUS = { 1: "Pending", 2: "Approved", 3: "Rejected" };
const STATUS_VARIANT = { 1: "warning", 2: "success", 3: "destructive" };

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TrainingApplications() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    loadApps();
  }, []);

  async function loadApps() {
    try {
      setLoading(true);
      const res = await api.get("/training-applications");
      const data = res?.data?.data || res?.data || [];
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(trainingId, studentId) {
    const key = `${Number(trainingId)}-${studentId}`;

    try {
      setProcessing(key);
await api.patch(
  `/training-applications/${trainingId}/students/${studentId}?status=approve`,
  {}
);

      loadApps();
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  }
  async function handleReject() {
    if (!selectedApplication) return;

    try {
      const key = `${selectedApplication.training_id}-${selectedApplication.student_id}`;

      setProcessing(key);

      await api.patch(
        `/training-applications/${selectedApplication.training_id}/students/${selectedApplication.student_id}?status=reject`,
        {
          remarks: remarks,
        },
      );

      setShowRejectModal(false);

      setRemarks("");

      setSelectedApplication(null);

      loadApps();
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  }
  const total = apps.length;
  const pending = apps.filter((a) => a.status_id === 1).length;
  const approved = apps.filter((a) => a.status_id === 2).length;
  const rejected = apps.filter((a) => a.status_id === 3).length;

  return (
    <DashboardShell
      title="Training Applications"
      subtitle="Student applications for training programs"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total",
              value: total,
              icon: <Users size={22} className="text-orbit-primary" />,
              bg: "bg-orbit-primary/10",
            },
            {
              label: "Pending",
              value: pending,
              icon: <Clock size={22} className="text-amber-400" />,
              bg: "bg-amber-500/10",
            },
            {
              label: "Approved",
              value: approved,
              icon: <CheckCircle2 size={22} className="text-emerald-400" />,
              bg: "bg-emerald-500/10",
            },
            {
              label: "Rejected",
              value: rejected,
              icon: <XCircle size={22} className="text-rose-400" />,
              bg: "bg-rose-500/10",
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardBody className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}
                >
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-0.5">
                    {s.value}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <Card>
            <CardBody>
              <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
                <Loader2 size={18} className="animate-spin" /> Loading
                applications...
              </div>
            </CardBody>
          </Card>
        ) : apps.length === 0 ? (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
                <BookOpenCheck size={40} className="opacity-30" />
                <p className="text-sm">No training applications yet.</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-orbit-border">
                    {[
                      "Training",
                      "Student ID",
                      "Date Submitted",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => {
                    const key = `${a.training_id}-${a.student_id}`;
                    const isProcessing = processing === key;
                    return (
                      <tr
                        key={key}
                        className="border-b border-orbit-border/50 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-3 text-slate-200 font-medium">
                          <span className="flex items-center gap-2">
                            <BookOpenCheck
                              size={14}
                              className="text-orbit-primary flex-shrink-0"
                            />
                            {a.training_table?.title ||
                              `Training #${a.training_id}`}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400 font-mono text-xs">
                          #{a.student_id}
                        </td>
                        <td className="px-5 py-3 text-slate-400 text-xs">
                          {fmtDate(a.date_of_submission)}
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            variant={STATUS_VARIANT[a.status_id] || "neutral"}
                          >
                            {STATUS[a.status_id] ?? "Unknown"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          {a.status_id === 1 ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                loading={isProcessing}
                                icon={<CheckCircle2 size={13} />}
                                onClick={() =>
                                  handleApprove(a.training_id, a.student_id)
                                }
                              >
                                Approve
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                icon={<Ban size={13} />}
                                onClick={() => {
                                  setSelectedApplication(a);

                                  setShowRejectModal(true);
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : a.status_id === 2 ? (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 size={13} />
                              Approved
                            </span>
                          ) : (
                            <span className="text-red-400 font-medium flex items-center gap-1">
                              <XCircle size={13} />
                              Rejected
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
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-orbit-surface border border-orbit-border rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white">
              Reject Training Application
            </h2>

            <p className="text-slate-400 mt-2">
              Please provide a rejection remark.
            </p>

            <textarea
              rows={5}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter rejection remark..."
              className="w-full mt-5 rounded-xl border border-orbit-border bg-orbit-surface2 p-3"
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setRemarks("");
                }}
              >
                Cancel
              </Button>

              <Button variant="destructive" onClick={handleReject}>
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
