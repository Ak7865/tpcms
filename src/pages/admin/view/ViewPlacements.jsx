import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Input,
} from "../../../components/ui";
import {
  Search,
  Loader2,
  Briefcase,
  Eye,
  RefreshCw,
  Calendar,
  Building2,
} from "lucide-react";
import { api } from "../../../services/api";

export default function ViewPlacements() {
  const navigate = useNavigate();

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlacements();
  }, []);

  async function loadPlacements() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/placements");

      setPlacements(
        res?.data?.data ||
        res?.data ||
        []
      );

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to fetch placements."
      );

    } finally {

      setLoading(false);

    }
  }

  const filteredPlacements = useMemo(() => {

    const keyword = search.toLowerCase();

    return placements.filter((placement) => {

      return (
        placement.title
          ?.toLowerCase()
          .includes(keyword) ||

        placement.organization_table?.user_table?.name
          ?.toLowerCase()
          .includes(keyword) ||

        placement.description
          ?.toLowerCase()
          .includes(keyword)
      );

    });

  }, [placements, search]);
    return (
    <DashboardShell
      title="Placement Opportunities"
      subtitle="View and manage placement drives"
    >
      <div className="space-y-6">

        {/* ===========================================
                    Statistics
        =========================================== */}

        <div className="grid gap-5 md:grid-cols-3">

          <Card>

            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-violet-500/10 p-3">

                <Briefcase
                  size={24}
                  className="text-violet-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total Placements
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {placements.length}
                </h2>

              </div>

            </CardBody>

          </Card>

          <Card>

            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-emerald-500/10 p-3">

                <Calendar
                  size={24}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Active
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {
                    placements.filter(
                      (p) => p.is_active
                    ).length
                  }
                </h2>

              </div>

            </CardBody>

          </Card>

          <Card>

            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-blue-500/10 p-3">

                <Building2
                  size={24}
                  className="text-blue-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Showing
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {filteredPlacements.length}
                </h2>

              </div>

            </CardBody>

          </Card>

        </div>

        {/* ===========================================
                    Search
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="relative w-full md:max-w-sm">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <Input
                  className="pl-10"
                  placeholder="Search placements..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <Button
                variant="outline"
                icon={<RefreshCw size={16} />}
                onClick={loadPlacements}
              >
                Refresh
              </Button>

            </div>

          </CardBody>

        </Card>

        {/* Error */}

        {error && (

          <Card>

            <CardBody>

              <p className="text-red-400">

                {error}

              </p>

            </CardBody>

          </Card>

        )}

        {/* Loading */}

        {loading ? (

          <Card>

            <CardBody>

              <div className="flex items-center justify-center gap-3 py-24">

                <Loader2
                  size={22}
                  className="animate-spin"
                />

                Loading placements...

              </div>

            </CardBody>

          </Card>

        ) : (

          <Card>

            <CardBody className="p-0">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="border-b border-orbit-border bg-orbit-surface2">

                    <tr>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Placement
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Company
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Last Date
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredPlacements.length === 0 ? (

                      <tr>

                        <td
                          colSpan={5}
                          className="py-20 text-center text-slate-500"
                        >

                          <Briefcase
                            size={40}
                            className="mx-auto mb-3 opacity-30"
                          />

                          No placements found.

                        </td>

                      </tr>

                    ) : (

                      filteredPlacements.map((placement) => (
                                              <tr
                        key={placement.placement_id}
                        className="border-b border-orbit-border hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Placement */}

                        <td className="px-5 py-4">

                          <div>

                            <h3 className="font-medium text-white">

                              {placement.title}

                            </h3>

                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">

                              {placement.description}

                            </p>

                          </div>

                        </td>

                        {/* Company */}

                        <td className="px-5 py-4">

                          <div>

                            <h3 className="font-medium text-white">

                              {placement.organization_table?.user_table?.name ||
                                "Unknown Company"}

                            </h3>

                            <p className="mt-1 text-xs text-slate-500">

                              {placement.organization_table?.user_table?.email ||
                                "-"}

                            </p>

                          </div>

                        </td>

                        {/* Last Date */}

                        <td className="px-5 py-4 text-slate-300">

                          {placement.last_date_of_submission
                            ? new Date(
                                placement.last_date_of_submission
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}

                        </td>

                        {/* Status */}

                        <td className="px-5 py-4 text-center">

                          <Badge
                            variant={
                              placement.is_active
                                ? "success"
                                : "destructive"
                            }
                          >
                            {placement.is_active
                              ? "Active"
                              : "Inactive"}
                          </Badge>

                        </td>

                        {/* Action */}

                        <td className="px-5 py-4">

                          <div className="flex justify-center">

                            <Button
                              size="sm"
                              icon={<Eye size={14} />}
                              onClick={() =>
                                navigate(
                                  `/coordinator/dashboard?view=placement-details&id=${placement.placement_id}`
                                )
                              }
                            >
                              View
                            </Button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                  </tbody>

                </table>

              </div>

            </CardBody>

          </Card>

        )}
                {/* ===========================================
                    Placement Summary
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Active Placements */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Active Placement Drives
              </h2>

              {placements.filter((p) => p.is_active).length === 0 ? (

                <div className="flex h-40 items-center justify-center text-slate-500">
                  No active placement drives.
                </div>

              ) : (

                <div className="space-y-4">

                  {placements
                    .filter((p) => p.is_active)
                    .slice(0, 5)
                    .map((placement) => (

                      <div
                        key={placement.placement_id}
                        className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4"
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <h3 className="font-medium text-white">
                              {placement.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {placement.organization_table?.user_table?.name ||
                                "Unknown Company"}
                            </p>

                          </div>

                          <Badge variant="success">
                            Active
                          </Badge>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </CardBody>

          </Card>

          {/* Statistics */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Placement Statistics
              </h2>

              <div className="space-y-4">

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Total Placements
                  </span>

                  <span className="text-xl font-bold text-white">
                    {placements.length}
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Active Drives
                  </span>

                  <span className="text-xl font-bold text-emerald-400">
                    {
                      placements.filter(
                        (p) => p.is_active
                      ).length
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Closed Drives
                  </span>

                  <span className="text-xl font-bold text-red-400">
                    {
                      placements.filter(
                        (p) => !p.is_active
                      ).length
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Search Results
                  </span>

                  <span className="text-xl font-bold text-orbit-primary">
                    {filteredPlacements.length}
                  </span>

                </div>

              </div>

            </CardBody>

          </Card>

        </div>

      </div>

    </DashboardShell>

  );

}