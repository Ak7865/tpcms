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
  BookOpenCheck,
  Eye,
  RefreshCw,
  Calendar,
  Users,
} from "lucide-react";
import { api } from "../../../services/api";

export default function ViewTrainings() {
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrainings();
  }, []);

  async function loadTrainings() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/trainings");

      setTrainings(
        res?.data?.data ||
        res?.data ||
        []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to fetch trainings."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredTrainings = useMemo(() => {
    const keyword = search.toLowerCase();

    return trainings.filter((training) => {
      return (
        training.title
          ?.toLowerCase()
          .includes(keyword) ||
        training.description
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [trainings, search]);
    return (
    <DashboardShell
      title="Training Programs"
      subtitle="View and manage all training opportunities"
    >
      <div className="space-y-6">

        {/* ===============================
                Statistics
        ================================ */}

        <div className="grid gap-5 md:grid-cols-3">

          <Card>
            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-violet-500/10 p-3">
                <BookOpenCheck
                  size={24}
                  className="text-violet-400"
                />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total Trainings
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {trainings.length}
                </h2>

              </div>

            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-green-500/10 p-3">
                <Calendar
                  size={24}
                  className="text-green-400"
                />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Active
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {
                    trainings.filter((t) => t.is_active)
                      .length
                  }
                </h2>

              </div>

            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-cyan-500/10 p-3">
                <Users
                  size={24}
                  className="text-cyan-400"
                />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Showing
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {filteredTrainings.length}
                </h2>

              </div>

            </CardBody>
          </Card>

        </div>

        {/* ===============================
                Search
        ================================ */}

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
                  placeholder="Search training..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <Button
                variant="outline"
                icon={<RefreshCw size={16} />}
                onClick={loadTrainings}
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

                Loading trainings...

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
                        Title
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Min CGPA
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

                    {filteredTrainings.length === 0 ? (

                      <tr>

                        <td
                          colSpan={5}
                          className="py-20 text-center text-slate-500"
                        >

                          <BookOpenCheck
                            size={42}
                            className="mx-auto mb-3 opacity-30"
                          />

                          No trainings found.

                        </td>

                      </tr>

                    ) : (

                      filteredTrainings.map((training) => (
                                              <tr
                        key={training.training_id}
                        className="border-b border-orbit-border hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Title */}

                        <td className="px-5 py-4">

                          <div>

                            <h3 className="font-medium text-white">

                              {training.title}

                            </h3>

                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">

                              {training.description}

                            </p>

                          </div>

                        </td>

                        {/* Minimum CGPA */}

                        <td className="px-5 py-4">

                          <Badge variant="secondary">

                            {training.min_cgpa}

                          </Badge>

                        </td>

                        {/* Last Date */}

                        <td className="px-5 py-4 text-slate-300">

                          {training.last_date_of_submission
                            ? new Date(
                                training.last_date_of_submission
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
                              training.is_active
                                ? "success"
                                : "destructive"
                            }
                          >
                            {training.is_active
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
                                  `/coordinator/dashboard?view=training-details&id=${training.training_id}`
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
                    Training Summary
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Active Trainings */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Active Trainings
              </h2>

              {trainings.filter((t) => t.is_active).length === 0 ? (

                <div className="flex h-40 items-center justify-center text-slate-500">
                  No active trainings.
                </div>

              ) : (

                <div className="space-y-4">

                  {trainings
                    .filter((t) => t.is_active)
                    .slice(0, 5)
                    .map((training) => (

                      <div
                        key={training.training_id}
                        className="rounded-xl border border-orbit-border bg-orbit-surface2/30 p-4"
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <h3 className="font-medium text-white">
                              {training.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              Min CGPA : {training.min_cgpa}
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
                Training Statistics
              </h2>

              <div className="space-y-5">

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/30 p-4">

                  <span className="text-slate-400">
                    Total Trainings
                  </span>

                  <span className="text-xl font-bold text-white">
                    {trainings.length}
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/30 p-4">

                  <span className="text-slate-400">
                    Active Trainings
                  </span>

                  <span className="text-xl font-bold text-emerald-400">
                    {
                      trainings.filter((t) => t.is_active)
                        .length
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/30 p-4">

                  <span className="text-slate-400">
                    Inactive Trainings
                  </span>

                  <span className="text-xl font-bold text-red-400">
                    {
                      trainings.filter((t) => !t.is_active)
                        .length
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/30 p-4">

                  <span className="text-slate-400">
                    Search Results
                  </span>

                  <span className="text-xl font-bold text-orbit-primary">
                    {filteredTrainings.length}
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