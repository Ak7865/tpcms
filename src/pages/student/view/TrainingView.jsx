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
  Building2,
  SlidersHorizontal,
  X,
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
  const [sectors, setSectors] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  // Advanced Filtering States
  const [showFilters, setShowFilters] = useState(false);
  const [filterSector, setFilterSector] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterCgpa, setFilterCgpa] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const [trainingRes, appRes, sectorsRes, semestersRes, deptsRes] = await Promise.all([
          api.get("/trainings"),
          api.get("/training-applications"),
          api.get("/masters/sectors").catch(() => null),
          api.get("/semesters").catch(() => null),
          api.get("/departments").catch(() => null),
        ]);
        if (!cancelled) {
          setTrainings(getRows(trainingRes));
          setApplications(getRows(appRes));
          setSectors(sectorsRes?.data?.data ?? sectorsRes?.data ?? []);
          setSemesters(semestersRes?.data || []);
          setDepartments(deptsRes?.data || []);
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
    return trainings.filter((training) => {
      // 1. Text Search
      const title = (training.title || "").toLowerCase();
      const desc = (training.description || "").toLowerCase();
      const orgName = (training.user_table?.name || "Training Provider").toLowerCase();
      const sectorName = (training.user_table?.organization_table?.sector_table?.sector_name || "").toLowerCase();
      const sectorShort = (training.user_table?.organization_table?.sector_table?.sector_shorthand || "").toLowerCase();
      
      const textMatches = 
        title.includes(term) ||
        desc.includes(term) ||
        orgName.includes(term) ||
        sectorName.includes(term) ||
        sectorShort.includes(term);

      if (!textMatches) return false;

      // 2. Sector Filter
      if (filterSector) {
        const trainingSectorId = training.user_table?.organization_table?.sector_table?.sector_id;
        if (Number(trainingSectorId) !== Number(filterSector)) return false;
      }

      // 3. Semester Filter
      if (filterSemester) {
        const allowedSems = training.training_semester_table || [];
        if (allowedSems.length > 0) {
          const semIds = allowedSems.map(s => s.semester_id);
          if (!semIds.includes(Number(filterSemester))) return false;
        }
      }

      // 4. Department Filter
      if (filterDept) {
        const allowedDepts = training.training_department_table || [];
        if (allowedDepts.length > 0) {
          const deptIds = allowedDepts.map(d => d.department_id);
          if (!deptIds.includes(Number(filterDept))) return false;
        }
      }

      // 5. CGPA Filter
      if (filterCgpa) {
        const minCgpa = Number(training.min_cgpa || 0);
        if (minCgpa > Number(filterCgpa)) return false;
      }

      // 6. Status Filter
      if (filterStatus !== "all") {
        const hasApplied = appliedIds.has(training.training_id);
        if (filterStatus === "applied" && !hasApplied) return false;
        if (filterStatus === "unapplied" && hasApplied) return false;
      }

      return true;
    });
  }, [trainings, query, filterSector, filterSemester, filterDept, filterCgpa, filterStatus, appliedIds]);

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

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-orbit-surface2 border border-orbit-border rounded-lg px-3 py-2">
          <Search className="w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trainings by title, provider, description, or sector..."
            className="bg-transparent text-sm text-slate-200 outline-none w-full"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
            showFilters || filterSector || filterSemester || filterDept || filterCgpa || filterStatus !== 'all'
              ? 'border-orbit-primary/45 bg-orbit-primary/10 text-orbit-primary-light'
              : 'border-orbit-border bg-orbit-surface2 hover:bg-white/3 text-slate-400'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {(filterSector || filterSemester || filterDept || filterCgpa || filterStatus !== 'all') && (
            <span className="w-2 h-2 rounded-full bg-orbit-accent animate-pulse" />
          )}
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl border border-orbit-border bg-orbit-surface2/50 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-orbit-border pb-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Advanced Filters</h3>
            <button
              type="button"
              onClick={() => {
                setFilterSector("");
                setFilterSemester("");
                setFilterDept("");
                setFilterCgpa("");
                setFilterStatus("all");
              }}
              className="text-[11px] text-orbit-primary-light hover:text-orbit-accent transition-colors font-medium"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Sector */}
            <div>
              <label className="mb-1 block text-[10px] uppercase font-bold tracking-wider text-slate-500">Sector</label>
              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2 text-xs text-slate-300 outline-none"
              >
                <option value="">All Sectors</option>
                {sectors.map((sec) => (
                  <option key={sec.sector_id} value={sec.sector_id}>{sec.sector_name}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="mb-1 block text-[10px] uppercase font-bold tracking-wider text-slate-500">Semester</label>
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2 text-xs text-slate-300 outline-none"
              >
                <option value="">All Semesters</option>
                {semesters.map((sem) => (
                  <option key={sem.semester_id} value={sem.semester_id}>Semester {sem.semester}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="mb-1 block text-[10px] uppercase font-bold tracking-wider text-slate-500">Department</label>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2 text-xs text-slate-300 outline-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-[10px] uppercase font-bold tracking-wider text-slate-500">Application Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2 text-xs text-slate-300 outline-none"
              >
                <option value="all">All</option>
                <option value="applied">Applied Only</option>
                <option value="unapplied">Not Applied Only</option>
              </select>
            </div>

            {/* Max Min CGPA */}
            <div>
              <label className="mb-1 block text-[10px] uppercase font-bold tracking-wider text-slate-500">Your CGPA (Show programs up to)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={filterCgpa}
                onChange={(e) => setFilterCgpa(e.target.value)}
                placeholder="e.g. 8.50"
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2 text-xs text-slate-300 outline-none"
              />
            </div>
          </div>
        </motion.div>
      )}

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
                {training.image_url ? (
                  <img
                    src={training.image_url}
                    alt=""
                    className="w-full h-32 rounded-lg object-cover mb-3 border border-orbit-border bg-orbit-surface2"
                  />
                ) : (
                  <BookOpenCheck className="w-5 h-5 text-orbit-primary-light mb-3" />
                )}
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  {training.title || "Training Program"}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2">
                  <Building2 size={13} className="text-orbit-primary-light" />
                  <span className="font-medium">
                    {training.user_table?.name || "Training Provider"}
                    {training.user_table?.organization_table?.sector_table?.sector_name && (
                      <span className="text-slate-500 font-normal inline-flex items-center gap-1.5 ml-1.5">
                        <span>•</span>
                        <span>{training.user_table.organization_table.sector_table.sector_name}</span>
                        {training.user_table.organization_table.sector_table.sector_shorthand && (
                          <span className="text-[10px] bg-orbit-primary/20 text-orbit-primary-light px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            {training.user_table.organization_table.sector_table.sector_shorthand}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </div>
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
                    Apply by: {fmtDate(training.last_date_of_submission)}
                  </span>
                  {(training.start_date || training.end_date) && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <CalendarClock size={12} className="text-orbit-primary-light" />
                      Program: {training.start_date ? new Date(training.start_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : 'N/A'} to {training.end_date ? new Date(training.end_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : 'N/A'}
                    </span>
                  )}
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
