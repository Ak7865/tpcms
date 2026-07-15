import { useEffect, useMemo, useState } from "react";
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
  CheckCircle2,
  XCircle,
  BookOpenCheck,
  RefreshCw,
  Clock,
} from "lucide-react";
import { api } from "../../../services/api";

const STATUS = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
};

const STATUS_VARIANT = {
  1: "warning",
  2: "success",
  3: "destructive",
};

export default function TrainingApplications() {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState("");

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");


  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        "/training-applications"
      );

      setApplications(
        res?.data?.data ||
          res?.data ||
          []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to fetch applications."
      );
    } finally {
      setLoading(false);
    }
  }

  async function approveApplication(application) {
    try {
      setProcessing(
        `${application.training_id}-${application.student_id}`
      );

      await api.patch(
        `/training-applications/${application.training_id}/students/${application.student_id}?status=approve`,
        {}
      );

      await loadApplications();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err.message
      );
    } finally {
      setProcessing("");
    }
  }
async function rejectApplication(application) {
  const remark = prompt("Enter rejection remark");

  if (remark === null) return;

  try {
    await api.patch(
      `/training-applications/${application.training_id}/students/${application.student_id}?status=reject`,
      {
        remarks: remark,
      }
    );

    loadApplications();

  } catch (err) {
    alert(
      err?.response?.data?.message ||
      err.message
    );
  }
}

  async function submitReject(remark) {
    if (!selectedApplication) return;

    try {
      await api.patch(
        `/training-applications/${selectedApplication.training_id}/students/${selectedApplication.student_id}?status=reject`,
        {
          remarks: remark,
        }
      );

      setRejectOpen(false);
      setSelectedApplication(null);

      loadApplications();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err.message
      );
    }
  }

  const filteredApplications = useMemo(() => {
    const keyword = search.toLowerCase();

    return applications.filter((app) => {
      return (
        app.student_table?.name
          ?.toLowerCase()
          .includes(keyword) ||
        app.training_table?.title
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [applications, search]);
    return (
    <DashboardShell
      title="Training Applications"
      subtitle="Approve or reject student applications"
    >
      <div className="space-y-6">

        {/* ===========================================
                    Statistics
        =========================================== */}

        <div className="grid gap-5 md:grid-cols-4">

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
                  Total
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {applications.length}
                </h2>
              </div>

            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-amber-500/10 p-3">
                <Clock
                  size={24}
                  className="text-amber-400"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Pending
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {
                    applications.filter(
                      (a) => a.status_id === 1
                    ).length
                  }
                </h2>
              </div>

            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-emerald-500/10 p-3">
                <CheckCircle2
                  size={24}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Approved
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {
                    applications.filter(
                      (a) => a.status_id === 2
                    ).length
                  }
                </h2>
              </div>

            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-red-500/10 p-3">
                <XCircle
                  size={24}
                  className="text-red-400"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Rejected
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {
                    applications.filter(
                      (a) => a.status_id === 3
                    ).length
                  }
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
                  placeholder="Search applications..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <Button
                variant="outline"
                icon={<RefreshCw size={16} />}
                onClick={loadApplications}
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

                Loading applications...

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
                        Training
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Student
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Submitted
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredApplications.length === 0 ? (

                      <tr>

                        <td
                          colSpan={5}
                          className="py-20 text-center text-slate-500"
                        >

                          <BookOpenCheck
                            size={40}
                            className="mx-auto mb-3 opacity-30"
                          />

                          No applications found.

                        </td>

                      </tr>

                    ) : (

                      filteredApplications.map((application) => (
                                              <tr
                        key={`${application.training_id}-${application.student_id}`}
                        className="border-b border-orbit-border hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Training */}

                        <td className="px-5 py-4">

                          <div>

                            <h3 className="font-medium text-white">

                              {application.training_table?.title ||
                                `Training #${application.training_id}`}

                            </h3>

                            <p className="mt-1 text-xs text-slate-500">

                              ID : {application.training_id}

                            </p>

                          </div>

                        </td>

                        {/* Student */}

                        <td className="px-5 py-4">

                          <div>

                            <h3 className="font-medium text-white">

                              {application.student_table?.name ||
                                `Student #${application.student_id}`}

                            </h3>

                            <p className="mt-1 text-xs text-slate-500">

                              {application.student_table?.user_table?.email ||
                                application.student_table?.email ||
                                "-"}

                            </p>

                          </div>

                        </td>

                        {/* Submission Date */}

                        <td className="px-5 py-4 text-slate-300">

                          {application.date_of_submission
                            ? new Date(
                                application.date_of_submission
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
                              STATUS_VARIANT[
                                application.status_id
                              ] || "secondary"
                            }
                          >
                            {STATUS[
                              application.status_id
                            ] || "Unknown"}
                          </Badge>

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex justify-center gap-2">

                            {application.status_id === 1 ? (

                              <>
                                <Button
                                  size="sm"
                                  loading={
                                    processing ===
                                    `${application.training_id}-${application.student_id}`
                                  }
                                  icon={
                                    <CheckCircle2 size={14} />
                                  }
                                  onClick={() =>
                                    approveApplication(
                                      application
                                    )
                                  }
                                >
                                  Approve
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  icon={<XCircle size={14} />}
                                  onClick={() =>
                                    rejectApplication(
                                      application
                                    )
                                  }
                                >
                                  Reject
                                </Button>
                              </>

                            ) : application.status_id === 2 ? (

                              <Badge variant="success">
                                Approved
                              </Badge>

                            ) : (

                              <Badge variant="destructive">
                                Rejected
                              </Badge>

                            )}

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
                Reject Remarks Modal
        =========================================== */}

     

        {/* ===========================================
                Summary
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Pending Applications */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Pending Applications
              </h2>

              {applications.filter(a => a.status_id === 1).length === 0 ? (

                <div className="flex h-40 items-center justify-center text-slate-500">
                  No pending applications.
                </div>

              ) : (

                <div className="space-y-4">

                  {applications
                    .filter(a => a.status_id === 1)
                    .slice(0, 5)
                    .map((application) => (

                      <div
                        key={`${application.training_id}-${application.student_id}`}
                        className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4"
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <h3 className="font-medium text-white">

                              {application.student_table?.name ||
                                `Student #${application.student_id}`}

                            </h3>

                            <p className="mt-1 text-xs text-slate-500">

                              {application.training_table?.title}

                            </p>

                          </div>

                          <Badge variant="warning">

                            Pending

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
                Application Statistics
              </h2>

              <div className="space-y-4">

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Total Applications
                  </span>

                  <span className="text-xl font-bold text-white">
                    {applications.length}
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Pending
                  </span>

                  <span className="text-xl font-bold text-amber-400">
                    {
                      applications.filter(
                        a => a.status_id === 1
                      ).length
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Approved
                  </span>

                  <span className="text-xl font-bold text-emerald-400">
                    {
                      applications.filter(
                        a => a.status_id === 2
                      ).length
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <span className="text-slate-400">
                    Rejected
                  </span>

                  <span className="text-xl font-bold text-red-400">
                    {
                      applications.filter(
                        a => a.status_id === 3
                      ).length
                    }
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