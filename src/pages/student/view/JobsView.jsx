import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../services/api";
import {
  Search,
  Building2,
  Clock,
  ExternalLink,
  GraduationCap,
  Loader2,
} from "lucide-react";

function getRows(res) {
  const data = res?.data?.data ?? res?.data ?? [];
  return Array.isArray(data) ? data : [];
}

function fmtDate(value) {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function JobsView() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const [placementRes, appRes] = await Promise.all([
          api.get("/placements"),
          api.get("/placement-applications"),
        ]);
        if (!cancelled) {
          setJobs(getRows(placementRes));
          setApplications(getRows(appRes));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load placements.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const appliedIds = useMemo(
    () => new Set(applications.map((app) => app.placement_id)),
    [applications]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const title = job.title || "";
      const org = job.organization_table?.name || job.organization?.name || "";
      return (
        title.toLowerCase().includes(term) ||
        org.toLowerCase().includes(term)
      );
    });
  }, [jobs, query]);

  async function applyToPlacement(placementId) {
    try {
      setApplyingId(placementId);
      setMessage("");
      setError("");
      const res = await api.post("/placement-applications", {
        placement_id: placementId,
      });
      const created = res?.data?.data ?? res?.data;
      setApplications((prev) => [...prev, created]);
      setMessage("Placement application submitted.");
    } catch (err) {
      setError(err.message || "Failed to apply for placement.");
    } finally {
      setApplyingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" />
        Loading placements...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Browse Placements</h1>
        <p className="text-sm text-slate-500 mt-1">
          Eligible active placements are filtered by the backend.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 bg-orbit-surface2 border border-orbit-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search placements..."
          className="bg-transparent text-sm text-slate-200 outline-none w-full"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No eligible placements found.</p>
        ) : (
          filtered.map((job, index) => {
            const placementId = job.placement_id;
            const hasApplied = appliedIds.has(placementId);
            return (
              <motion.div
                key={placementId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="p-4 rounded-lg border border-orbit-border hover:border-orbit-border2 transition-all bg-orbit-surface"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">
                      {job.title || "Untitled Placement"}
                    </h3>
                    {job.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {job.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {job.organization_table?.name || "Placement"}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Min CGPA {job.min_cgpa ?? "N/A"}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {fmtDate(job.last_date_of_submission)}
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={hasApplied || applyingId === placementId}
                    onClick={() => applyToPlacement(placementId)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-orbit-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-orbit-primary/90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    {applyingId === placementId ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <ExternalLink className="w-3 h-3" />
                    )}
                    {hasApplied ? "Applied" : "Apply Now"}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
