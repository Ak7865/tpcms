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
  SlidersHorizontal,
  X,
  IndianRupee,
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
  const [divisions, setDivisions] = useState([]);
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
  const [filterSalary, setFilterSalary] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const [placementRes, appRes, divisionsRes, sectorsRes, semestersRes, deptsRes] = await Promise.all([
          api.get("/placements"),
          api.get("/placement-applications"),
          api.get("/masters/divisions").catch(() => null),
          api.get("/masters/sectors").catch(() => null),
          api.get("/semesters").catch(() => null),
          api.get("/departments").catch(() => null),
        ]);
        if (!cancelled) {
          setJobs(getRows(placementRes));
          setApplications(getRows(appRes));
          setDivisions(divisionsRes?.data?.data ?? divisionsRes?.data ?? divisionsRes ?? []);
          setSectors(sectorsRes?.data?.data ?? sectorsRes?.data ?? []);
          setSemesters(semestersRes?.data || []);
          setDepartments(deptsRes?.data || []);
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
      // 1. Text Search
      const title = (job.title || "").toLowerCase();
      const desc = (job.description || "").toLowerCase();
      const orgName = (job.user_table?.name || job.organization_table?.name || "").toLowerCase();
      const sectorName = (job.user_table?.organization_table?.sector_table?.sector_name || "").toLowerCase();
      const sectorShort = (job.user_table?.organization_table?.sector_table?.sector_shorthand || "").toLowerCase();
      
      const textMatches = 
        title.includes(term) ||
        desc.includes(term) ||
        orgName.includes(term) ||
        sectorName.includes(term) ||
        sectorShort.includes(term);

      if (!textMatches) return false;

      // 2. Sector Filter
      if (filterSector) {
        const jobSectorId = job.user_table?.organization_table?.sector_table?.sector_id;
        if (Number(jobSectorId) !== Number(filterSector)) return false;
      }

      // 3. Semester Filter
      if (filterSemester) {
        const allowedSems = job.placement_semester_table || [];
        if (allowedSems.length > 0) {
          const semIds = allowedSems.map(s => s.semester_id);
          if (!semIds.includes(Number(filterSemester))) return false;
        }
      }

      // 4. Department Filter
      if (filterDept) {
        const allowedDepts = job.placement_department_table || [];
        if (allowedDepts.length > 0) {
          const deptIds = allowedDepts.map(d => d.department_id);
          if (!deptIds.includes(Number(filterDept))) return false;
        }
      }

      // 5. CGPA Filter
      if (filterCgpa) {
        const minCgpa = Number(job.min_cgpa || 0);
        if (minCgpa > Number(filterCgpa)) return false;
      }

      // 6. Salary Filter
      if (filterSalary) {
        const maxSalary = Number(job.salary_upper || job.salary_lower || 0);
        if (maxSalary > 0 && maxSalary < Number(filterSalary)) return false;
      }

      // 7. Status Filter
      if (filterStatus !== "all") {
        const hasApplied = appliedIds.has(job.placement_id);
        if (filterStatus === "applied" && !hasApplied) return false;
        if (filterStatus === "unapplied" && hasApplied) return false;
      }

      return true;
    });
  }, [jobs, query, filterSector, filterSemester, filterDept, filterCgpa, filterSalary, filterStatus, appliedIds]);

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

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-orbit-surface2 border border-orbit-border rounded-lg px-3 py-2">
          <Search className="w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search placements by title, company, description, or sector..."
            className="bg-transparent text-sm text-slate-200 outline-none w-full"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
            showFilters || filterSector || filterSemester || filterDept || filterCgpa || filterSalary || filterStatus !== 'all'
              ? 'border-orbit-primary/45 bg-orbit-primary/10 text-orbit-primary-light'
              : 'border-orbit-border bg-orbit-surface2 hover:bg-white/3 text-slate-400'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {(filterSector || filterSemester || filterDept || filterCgpa || filterSalary || filterStatus !== 'all') && (
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
                setFilterSalary("");
                setFilterStatus("all");
              }}
              className="text-[11px] text-orbit-primary-light hover:text-orbit-accent transition-colors font-medium"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <label className="mb-1 block text-[10px] uppercase font-bold tracking-wider text-slate-500">Your CGPA (Show drives up to)</label>
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

            {/* Min Salary */}
            <div>
              <label className="mb-1 block text-[10px] uppercase font-bold tracking-wider text-slate-500">Min Package (LPA)</label>
              <input
                type="number"
                min="0"
                value={filterSalary}
                onChange={(e) => setFilterSalary(e.target.value)}
                placeholder="e.g. 6"
                className="w-full rounded-lg border border-orbit-border bg-orbit-surface px-3 py-2 text-xs text-slate-300 outline-none"
              />
            </div>
          </div>
        </motion.div>
      )}

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
                <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {job.image_url && (
                      <img
                        src={job.image_url}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border border-orbit-border bg-orbit-surface2"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-200 truncate">
                        {job.title || "Untitled Placement"}
                      </h3>
                      {job.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {job.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-orbit-primary-light" />
                          {job.user_table?.name || job.organization_table?.name || "Placement"}
                          {job.user_table?.organization_table?.sector_table?.sector_name && (
                            <span className="text-slate-500 font-normal flex items-center gap-1.5">
                              <span>•</span>
                              <span>{job.user_table.organization_table.sector_table.sector_name}</span>
                              {job.user_table.organization_table.sector_table.sector_shorthand && (
                                <span className="text-[10px] bg-orbit-primary/20 text-orbit-primary-light px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                  {job.user_table.organization_table.sector_table.sector_shorthand}
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          Min CGPA {job.min_cgpa ?? "N/A"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Apply by: {fmtDate(job.last_date_of_submission)}
                        </span>
                        {(job.start_date || job.end_date) && (
                          <span className="text-xs text-slate-600">
                            Drive: {job.start_date ? new Date(job.start_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : 'N/A'} to {job.end_date ? new Date(job.end_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : 'N/A'}
                          </span>
                        )}
                      </div>

                      {/* Criteria Badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        {(job.salary_lower || job.salary_upper) && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                            LPA: {job.salary_lower ? `₹${(job.salary_lower/100000).toFixed(1)}` : 'N/A'} - {job.salary_upper ? `₹${(job.salary_upper/100000).toFixed(1)}` : 'N/A'}
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          job.has_backlog 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {job.has_backlog ? 'Backlogs Allowed' : 'No Active Backlogs'}
                        </span>
                        {job.min_tenth_division_id && (
                          <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20">
                            10th: {divisions.find(d => String(d.division_id) === String(job.min_tenth_division_id))?.division || `Div ${job.min_tenth_division_id}`}
                          </span>
                        )}
                        {job.min_twelfth_division_id && (
                          <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20">
                            12th: {divisions.find(d => String(d.division_id) === String(job.min_twelfth_division_id))?.division || `Div ${job.min_twelfth_division_id}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={hasApplied || applyingId === placementId}
                    onClick={() => applyToPlacement(placementId)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-orbit-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-orbit-primary/90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 self-end md:self-center flex-shrink-0"
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
