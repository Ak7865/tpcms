import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import { Briefcase, BookOpenCheck, Loader2, Search } from "lucide-react";

function getRows(res) {
  const data = res?.data?.data ?? res?.data ?? [];
  return Array.isArray(data) ? data : [];
}

function statusLabel(statusId) {
  if (statusId === 1) return "Approved";
  if (statusId === 0) return "Pending";
  return "Unknown";
}

function fmtDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ApplicationsView() {
  const [trainingApps, setTrainingApps] = useState([]);
  const [placementApps, setPlacementApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const [trainingRes, placementRes] = await Promise.all([
          api.get("/training-applications"),
          api.get("/placement-applications"),
        ]);
        if (!cancelled) {
          setTrainingApps(getRows(trainingRes));
          setPlacementApps(getRows(placementRes));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load applications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const trainings = trainingApps.map((app) => ({
      id: `training-${app.training_id}-${app.student_id}`,
      type: "Training",
      title: app.training_table?.title || `Training #${app.training_id}`,
      status_id: app.status_id,
      date: app.date_of_submission,
      icon: BookOpenCheck,
    }));
    const placements = placementApps.map((app) => ({
      id: `placement-${app.placement_id}-${app.student_id}`,
      type: "Placement",
      title: app.placement_table?.title || `Placement #${app.placement_id}`,
      status_id: app.status_id,
      date: app.date_of_submission,
      icon: Briefcase,
    }));
    const term = query.trim().toLowerCase();
    return [...trainings, ...placements].filter((row) =>
      `${row.type} ${row.title} ${statusLabel(row.status_id)}`
        .toLowerCase()
        .includes(term)
    );
  }, [trainingApps, placementApps, query]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" />
        Loading applications...
      </div>
    );
  }

  if (error) return <div className="text-sm text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">My Applications</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your training and placement submissions.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-orbit-surface2 border border-orbit-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search applications..."
          className="bg-transparent text-sm text-slate-200 outline-none w-full"
        />
      </div>

      <div className="bg-orbit-surface rounded-xl border border-orbit-border overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500 p-5">
            You have not submitted any applications yet.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-orbit-bg/50 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Role / Program</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orbit-border">
              {rows.map((row) => {
                const Icon = row.icon;
                const approved = row.status_id === 1;
                return (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-slate-300">
                      <span className="flex items-center gap-2">
                        <Icon size={14} className="text-orbit-primary" />
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-200 font-medium">
                      {row.title}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {fmtDate(row.date)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          approved
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {statusLabel(row.status_id)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
