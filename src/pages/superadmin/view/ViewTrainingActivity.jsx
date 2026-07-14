import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Badge, Input } from "../../../components/ui";
import {
  Loader2,
  BookOpenCheck,
  CalendarClock,
  GraduationCap,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { api } from "../../../services/api";

function getStatus(t) {
  if (!t.is_active) return "Closed";
  if (t.last_date_of_submission && new Date(t.last_date_of_submission) < new Date())
    return "Expired";
  return "Active";
}

const statusConfig = {
  Active: { variant: "success", icon: <CheckCircle2 size={13} className="inline mr-1" />, border: "border-emerald-500/20" },
  Expired: { variant: "warning", icon: <CalendarClock size={13} className="inline mr-1" />, border: "border-amber-500/20" },
  Closed: { variant: "neutral", icon: <XCircle size={13} className="inline mr-1" />, border: "border-slate-600/20" },
};

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ViewTrainingActivity() {
  const [loading, setLoading] = useState(true);
  const [trainings, setTrainings] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/trainings")
      .then((res) => {
        const data = res?.data?.data || res?.data || [];
        setTrainings(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message || "Failed to load trainings."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return trainings.filter(
      (t) =>
        t.title?.toLowerCase().includes(kw) ||
        t.description?.toLowerCase().includes(kw)
    );
  }, [trainings, search]);

  const active = trainings.filter((t) => getStatus(t) === "Active").length;
  const closed = trainings.filter((t) => getStatus(t) !== "Active").length;

  return (
    <DashboardShell title="Training Activity" subtitle="All training programs">
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Programs", value: trainings.length, icon: <BookOpenCheck size={22} className="text-orbit-primary" />, bg: "bg-orbit-primary/10" },
            { label: "Active", value: active, icon: <CheckCircle2 size={22} className="text-emerald-400" />, bg: "bg-emerald-500/10" },
            { label: "Closed / Expired", value: closed, icon: <XCircle size={22} className="text-slate-500" />, bg: "bg-slate-500/10" },
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

        {/* Search */}
        <Card>
          <CardBody>
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <Input className="pl-10" placeholder="Search trainings..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </CardBody>
        </Card>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        )}

        {/* Content */}
        {loading ? (
          <Card><CardBody>
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <Loader2 size={18} className="animate-spin" /> Loading training programs...
            </div>
          </CardBody></Card>
        ) : filtered.length === 0 ? (
          <Card><CardBody>
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <BookOpenCheck size={40} className="opacity-30" />
              <p className="text-sm">No training programs found.</p>
            </div>
          </CardBody></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((t) => {
              const status = getStatus(t);
              const cfg = statusConfig[status];
              return (
                <div key={t.training_id} className={`rounded-2xl border bg-orbit-surface p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${cfg.border}`}>
                  {/* Banner */}
                  {t.image_url ? (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-orbit-surface2">
                      <img src={t.image_url} alt={t.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-xl mb-4 bg-orbit-surface2 flex items-center justify-center">
                      <ImageIcon size={28} className="text-slate-600" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-orbit-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpenCheck size={17} className="text-orbit-primary" />
                    </div>
                    <Badge variant={cfg.variant}>{cfg.icon}{status}</Badge>
                  </div>

                  <h3 className="text-base font-semibold text-slate-100 leading-snug mb-1">{t.title}</h3>
                  {t.description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{t.description}</p>}

                  <div className="space-y-1.5 mt-3 pt-3 border-t border-orbit-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500"><GraduationCap size={12} />Min CGPA</span>
                      <span className="font-semibold text-orbit-primary">{t.min_cgpa ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500"><CalendarClock size={12} />Last Date</span>
                      <span className="font-medium text-slate-300">{fmtDate(t.last_date_of_submission)}</span>
                    </div>
                    {t.start_date && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500"><Sparkles size={12} />Period</span>
                        <span className="font-medium text-slate-300">{fmtDate(t.start_date)} → {fmtDate(t.end_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
