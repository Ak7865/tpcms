import { useEffect, useMemo, useState } from "react"
import DashboardShell from "../../../components/DashboardShell"
import { Card, CardBody, Badge, Input } from "../../../components/ui"
import {
  Loader2,
  Briefcase,
  CalendarClock,
  GraduationCap,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react"
import { api } from "../../../services/api"


function getStatus(p) {
  if (!p.is_active) return "Closed"
  if (p.last_date_of_submission && new Date(p.last_date_of_submission) < new Date())
    return "Expired"
  return "Active"
}

const statusConfig = {
  Active: {
    variant: "success",
    icon: <CheckCircle2 size={13} className="inline mr-1" />,
    glow: "border-emerald-500/20 shadow-emerald-500/5",
  },
  Expired: {
    variant: "warning",
    icon: <CalendarClock size={13} className="inline mr-1" />,
    glow: "border-amber-500/20 shadow-amber-500/5",
  },
  Closed: {
    variant: "neutral",
    icon: <XCircle size={13} className="inline mr-1" />,
    glow: "border-slate-500/10 shadow-none",
  },
}

function fmtDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function PlacementActivity() {
  const [loading, setLoading] = useState(true)
  const [placements, setPlacements] = useState([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    api.get("/placements")
      .then((res) => {
        const data = res?.data?.data || res?.data || []
        setPlacements(Array.isArray(data) ? data : [])
      })
      .catch((err) => setError(err.message || "Failed to load placements."))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const kw = search.toLowerCase()
    return placements.filter(
      (p) =>
        p.title?.toLowerCase().includes(kw) ||
        p.description?.toLowerCase().includes(kw)
    )
  }, [placements, search])

  const active = placements.filter((p) => getStatus(p) === "Active").length
  const closed = placements.filter((p) => getStatus(p) !== "Active").length

  return (
    <DashboardShell
      title="Placement Activity"
      subtitle="Track all placement drives and job notifications"
    >
      <div className="space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Drives",
              value: placements.length,
              icon: <Briefcase size={22} className="text-orbit-primary" />,
              bg: "bg-orbit-primary/10",
            },
            {
              label: "Active",
              value: active,
              icon: <CheckCircle2 size={22} className="text-emerald-400" />,
              bg: "bg-emerald-500/10",
            },
            {
              label: "Closed / Expired",
              value: closed,
              icon: <XCircle size={22} className="text-slate-500" />,
              bg: "bg-slate-500/10",
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardBody className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-bold text-white mt-0.5">{s.value}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* ── Search ── */}
        <Card>
          <CardBody>
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <Input
                className="pl-10"
                placeholder="Search placements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        {/* ── Content ── */}
        {loading ? (
          <Card>
            <CardBody>
              <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
                <Loader2 size={18} className="animate-spin" />
                Loading placement drives...
              </div>
            </CardBody>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
                <Briefcase size={40} className="opacity-30" />
                <p className="text-sm">No placement drives found.</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => {
              const status = getStatus(p)
              const cfg = statusConfig[status]
              return (
                <div
                  key={p.placement_id}
                  className={`relative rounded-2xl border bg-orbit-surface p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${cfg.glow}`}
                >
                  {/* header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orbit-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-orbit-primary" />
                    </div>
                    <Badge variant={cfg.variant}>
                      {cfg.icon}
                      {status}
                    </Badge>
                  </div>

                  {/* title */}
                  <h3 className="text-base font-semibold text-slate-100 leading-snug mb-1">
                    {p.title}
                  </h3>

                  {/* description */}
                  {p.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {p.description}
                    </p>
                  )}

                  {/* meta */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-orbit-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <GraduationCap size={12} />
                        Min CGPA
                      </span>
                      <span className="font-semibold text-orbit-primary">
                        {p.min_cgpa ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <CalendarClock size={12} />
                        Last Date
                      </span>
                      <span className="font-medium text-slate-300">
                        {fmtDate(p.last_date_of_submission)}
                      </span>
                    </div>
                    {p.start_date && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Sparkles size={12} />
                          Drive Period
                        </span>
                        <span className="font-medium text-slate-300">
                          {fmtDate(p.start_date)} → {fmtDate(p.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </DashboardShell>
  )
}
