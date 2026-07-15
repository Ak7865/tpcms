import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Button,
  Badge,
} from "../../../components/ui";
import {
  ArrowLeft,
  Loader2,
  BookOpenCheck,
  Calendar,
  Award,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "../../../services/api";

export default function TrainingDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const trainingId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (trainingId) {
      loadTraining();
    } else {
      setError("No training ID specified.");
      setLoading(false);
    }
  }, [trainingId]);

  async function loadTraining() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/trainings/${trainingId}`);
      const raw = res?.data?.data || res?.data || null;

      if (raw) {
        if (raw.user_table && !raw.creator_table) {
          raw.creator_table = raw.user_table;
        }
        setTraining(raw);
      } else {
        setTraining(null);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to fetch training."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <DashboardShell
        title="Training Details"
        subtitle="Loading..."
      >
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-3 py-24">
              <Loader2
                size={22}
                className="animate-spin"
              />
              Loading training...
            </div>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell
        title="Training Details"
        subtitle="Error"
      >
        <Card>
          <CardBody>

            <p className="text-red-400">
              {error}
            </p>

            <Button
              className="mt-5"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </Button>

          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  if (!training) {
    return (
      <DashboardShell
        title="Training Details"
      >
        <Card>
          <CardBody>

            Training not found.

          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Training Details"
      subtitle="Complete training information"
    >
      <div className="space-y-6">
                {/* ===========================================
                    Header
        =========================================== */}

        <div className="flex items-center justify-between">

          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

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

        </div>

        {/* ===========================================
                    Banner & Overview
        =========================================== */}

        <Card>

          <CardBody>

            {training.image_url ? (

              <img
                src={training.image_url}
                alt={training.title}
                className="mb-6 h-72 w-full rounded-xl object-cover"
              />

            ) : (

              <div className="mb-6 flex h-72 items-center justify-center rounded-xl bg-orbit-surface2">

                <ImageIcon
                  size={70}
                  className="text-slate-600"
                />

              </div>

            )}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h1 className="text-3xl font-bold text-white">

                  {training.title}

                </h1>

                <p className="mt-3 max-w-3xl text-slate-400">

                  {training.description}

                </p>

                <div className="mt-5 flex flex-wrap gap-3">

                  <Badge variant="secondary">

                    <Award
                      size={13}
                      className="mr-1"
                    />

                    Minimum CGPA :
                    {" "}
                    {training.min_cgpa}

                  </Badge>

                  <Badge variant="secondary">

                    <Calendar
                      size={13}
                      className="mr-1"
                    />

                    Last Date :
                    {" "}
                    {formatDate(
                      training.last_date_of_submission
                    )}

                  </Badge>

                </div>

              </div>

            </div>

          </CardBody>

        </Card>

        {/* ===========================================
                    Summary Cards
        =========================================== */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Minimum CGPA */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-emerald-500/10 p-3">

                  <Award
                    size={24}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    Minimum CGPA

                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-white">

                    {training.min_cgpa}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Start Date */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-blue-500/10 p-3">

                  <Calendar
                    size={24}
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    Start Date

                  </p>

                  <h3 className="mt-1 text-base font-semibold text-white">

                    {formatDate(training.start_date)}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* End Date */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-orange-500/10 p-3">

                  <Calendar
                    size={24}
                    className="text-orange-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    End Date

                  </p>

                  <h3 className="mt-1 text-base font-semibold text-white">

                    {formatDate(training.end_date)}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Status */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-violet-500/10 p-3">

                  <BookOpenCheck
                    size={24}
                    className="text-violet-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    Status

                  </p>

                  <h3 className="mt-1 text-base font-semibold text-white">

                    {training.is_active
                      ? "Active"
                      : "Inactive"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

        </div>
                {/* ===========================================
                    Description & Important Dates
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Description */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Training Description
              </h2>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="leading-8 text-slate-300 whitespace-pre-line">

                  {training.description || "No description available."}

                </p>

              </div>

            </CardBody>

          </Card>

          {/* Important Dates */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Important Dates
              </h2>

              <div className="space-y-4">

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div>

                    <p className="text-xs uppercase text-slate-500">

                      Created On

                    </p>

                    <h3 className="mt-1 font-medium text-white">

                      {formatDate(training.created_on)}

                    </h3>

                  </div>

                  <Calendar className="text-orbit-primary" />

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div>

                    <p className="text-xs uppercase text-slate-500">

                      Start Date

                    </p>

                    <h3 className="mt-1 font-medium text-white">

                      {formatDate(training.start_date)}

                    </h3>

                  </div>

                  <Calendar className="text-blue-400" />

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div>

                    <p className="text-xs uppercase text-slate-500">

                      End Date

                    </p>

                    <h3 className="mt-1 font-medium text-white">

                      {formatDate(training.end_date)}

                    </h3>

                  </div>

                  <Calendar className="text-red-400" />

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div>

                    <p className="text-xs uppercase text-slate-500">

                      Last Submission

                    </p>

                    <h3 className="mt-1 font-medium text-white">

                      {formatDate(
                        training.last_date_of_submission
                      )}

                    </h3>

                  </div>

                  <Calendar className="text-green-400" />

                </div>

              </div>

            </CardBody>

          </Card>

        </div>

        {/* ===========================================
                Eligibility & Creator
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Eligibility */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">

                Eligibility

              </h2>

              <div className="space-y-4">

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-slate-500">

                      Minimum CGPA

                    </span>

                    <Badge variant="success">

                      {training.min_cgpa}

                    </Badge>

                  </div>

                </div>

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-slate-500">

                      Training Status

                    </span>

                    <Badge
                      variant={
                        training.is_active
                          ? "success"
                          : "destructive"
                      }
                    >

                      {training.is_active
                        ? "Open"
                        : "Closed"}

                    </Badge>

                  </div>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Creator */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">

                Creator Information

              </h2>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orbit-primary/10">

                    <User
                      size={26}
                      className="text-orbit-primary"
                    />

                  </div>

                  <div>

                    <p className="text-xs uppercase text-slate-500">

                      Created By

                    </p>

                    <h3 className="mt-1 font-semibold text-white">

                      {training.creator_table?.name ||
                        `User #${training.creator_id}`}

                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

                      {training.creator_table?.email ||
                        "Email unavailable"}

                    </p>

                  </div>

                </div>

              </div>

            </CardBody>

          </Card>

        </div>
                {/* ===========================================
                    Training Statistics
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-6 text-lg font-semibold text-white">
              Training Overview
            </h2>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Training ID
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  #{training.training_id}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Creator ID
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  {training.creator_id}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Minimum CGPA
                </p>

                <h3 className="mt-2 text-2xl font-bold text-emerald-400">
                  {training.min_cgpa}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Status
                </p>

                <Badge
                  className="mt-3"
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

              </div>

            </div>

          </CardBody>

        </Card>

        {/* ===========================================
                    Bottom Actions
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-wrap justify-end gap-3">

              <Button
                variant="outline"
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>

              {training.image_url && (

                <Button
                  asChild
                  icon={<ImageIcon size={16} />}
                >
                  <a
                    href={training.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Banner
                  </a>
                </Button>

              )}

            </div>

          </CardBody>

        </Card>

      </div>

    </DashboardShell>

  );

}