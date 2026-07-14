import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../services/api";
import {
  BookOpenCheck,
  CalendarClock,
  ExternalLink,
  GraduationCap,
  Loader2,
  Search,
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

export default function TrainingView() {
  const [trainings, setTrainings] = useState([]);
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
        const [trainingRes, appRes] = await Promise.all([
          api.get("/trainings"),
          api.get("/training-applications"),
        ]);
        if (!cancelled) {
          setTrainings(getRows(trainingRes));
          setApplications(getRows(appRes));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load trainings.");
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
    () => new Set(applications.map((app) => app.training_id)),
    [applications]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return trainings.filter((training) =>
      `${training.title || ""} ${training.description || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [trainings, query]);

  async function applyToTraining(trainingId) {
    try {
      setApplyingId(trainingId);
      setMessage("");
      setError("");
      const res = await api.post("/training-applications", {
        training_id: trainingId,
      });
      const created = res?.data?.data ?? res?.data;
      setApplications((prev) => [...prev, created]);
      setMessage("Training application submitted.");
    } catch (err) {
      setError(err.message || "Failed to apply for training.");
    } finally {
      setApplyingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" />
        Loading training programs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Training Programs</h1>
        <p className="text-sm text-slate-500 mt-1">
          Eligible active trainings are filtered by the backend.
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
          placeholder="Search trainings..."
          className="bg-transparent text-sm text-slate-200 outline-none w-full"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No eligible training programs found.</p>
        ) : (
          filtered.map((training, index) => {
            const trainingId = training.training_id;
            const hasApplied = appliedIds.has(trainingId);
            return (
              <motion.div
                key={trainingId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-orbit-surface rounded-xl border border-orbit-border hover:border-orbit-border2 transition-colors p-5"
              >
                <BookOpenCheck className="w-5 h-5 text-orbit-primary-light mb-3" />
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  {training.title || "Training Program"}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {training.description || "No description provided."}
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={12} />
                    Min CGPA {training.min_cgpa ?? "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarClock size={12} />
                    {fmtDate(training.last_date_of_submission)}
                  </span>
                </div>
                <button
                  disabled={hasApplied || applyingId === trainingId}
                  onClick={() => applyToTraining(trainingId)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-orbit-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-orbit-primary/90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {applyingId === trainingId ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3 h-3" />
                  )}
                  {hasApplied ? "Applied" : "Apply Now"}
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
