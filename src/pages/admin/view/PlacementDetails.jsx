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
  Briefcase,
  Building2,
  Calendar,
  Award,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { api } from "../../../services/api";

export default function PlacementDetails() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const placementId = searchParams.get("id");

  const [loading, setLoading] = useState(true);

  const [placement, setPlacement] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (placementId) {
      loadPlacement();
    } else {
      setError("No placement ID specified.");
      setLoading(false);
    }
  }, [placementId]);

  async function loadPlacement() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/placements/${placementId}`);
      const raw = res?.data?.data || res?.data || null;

      if (raw) {
        if (raw.user_table && !raw.organization_table) {
          raw.organization_table = {
            user_table: raw.user_table
          };
        }
        setPlacement(raw);
      } else {
        setPlacement(null);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to fetch placement."
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
        title="Placement Details"
        subtitle="Loading..."
      >
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-3 py-24">
              <Loader2
                size={22}
                className="animate-spin"
              />
              Loading placement...
            </div>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell
        title="Placement Details"
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

  if (!placement) {
    return (
      <DashboardShell
        title="Placement Details"
      >
        <Card>
          <CardBody>

            Placement not found.

          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Placement Details"
      subtitle="Complete placement information"
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
              placement.is_active
                ? "success"
                : "destructive"
            }
          >
            {placement.is_active
              ? "Active"
              : "Inactive"}
          </Badge>

        </div>

        {/* ===========================================
                    Placement Overview
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orbit-primary/10">

                    <Briefcase
                      size={32}
                      className="text-orbit-primary"
                    />

                  </div>

                  <div>

                    <h1 className="text-3xl font-bold text-white">
                      {placement.title}
                    </h1>

                    <p className="mt-1 text-slate-400">
                      {placement.organization_table?.user_table?.name ||
                        "Unknown Company"}
                    </p>

                  </div>

                </div>

                <p className="max-w-4xl leading-7 text-slate-300">

                  {placement.description}

                </p>

                <div className="mt-5 flex flex-wrap gap-3">

                  <Badge variant="secondary">

                    <Award
                      size={13}
                      className="mr-1"
                    />

                    CGPA :
                    {" "}
                    {placement.min_cgpa}

                  </Badge>

                  <Badge variant="secondary">

                    <Calendar
                      size={13}
                      className="mr-1"
                    />

                    Last Date :
                    {" "}
                    {formatDate(
                      placement.last_date_of_submission
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

          {/* Company */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-blue-500/10 p-3">

                  <Building2
                    size={24}
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Company
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">

                    {placement.organization_table?.user_table?.name ||
                      "-"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Package */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-emerald-500/10 p-3">

                  <IndianRupee
                    size={24}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Package
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">

                    {placement.package || "Not Specified"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Location */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-orange-500/10 p-3">

                  <MapPin
                    size={24}
                    className="text-orange-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Location
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">

                    {placement.location || "Not Specified"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Minimum CGPA */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-violet-500/10 p-3">

                  <Award
                    size={24}
                    className="text-violet-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Minimum CGPA
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">

                    {placement.min_cgpa}

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
                Placement Description
              </h2>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="whitespace-pre-line leading-8 text-slate-300">

                  {placement.description ||
                    "No description available."}

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
                      {formatDate(placement.created_on)}
                    </h3>

                  </div>

                  <Calendar className="text-orbit-primary" />

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div>

                    <p className="text-xs uppercase text-slate-500">
                      Updated On
                    </p>

                    <h3 className="mt-1 font-medium text-white">
                      {formatDate(placement.updated_on)}
                    </h3>

                  </div>

                  <Calendar className="text-blue-400" />

                </div>

                <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                  <div>

                    <p className="text-xs uppercase text-slate-500">
                      Last Date of Application
                    </p>

                    <h3 className="mt-1 font-medium text-white">
                      {formatDate(
                        placement.last_date_of_submission
                      )}
                    </h3>

                  </div>

                  <Calendar className="text-red-400" />

                </div>

              </div>

            </CardBody>

          </Card>

        </div>

        {/* ===========================================
                    Eligibility & Company
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Eligibility */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Eligibility Criteria
              </h2>

              <div className="space-y-4">

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4 flex items-center justify-between">

                  <span className="text-slate-400">
                    Minimum CGPA
                  </span>

                  <Badge variant="success">
                    {placement.min_cgpa}
                  </Badge>

                </div>

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4 flex items-center justify-between">

                  <span className="text-slate-400">
                    Placement Status
                  </span>

                  <Badge
                    variant={
                      placement.is_active
                        ? "success"
                        : "destructive"
                    }
                  >
                    {placement.is_active
                      ? "Open"
                      : "Closed"}
                  </Badge>

                </div>

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4 flex items-center justify-between">

                  <span className="text-slate-400">
                    Location
                  </span>

                  <span className="font-medium text-white">
                    {placement.location || "-"}
                  </span>

                </div>

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4 flex items-center justify-between">

                  <span className="text-slate-400">
                    Salary Package
                  </span>

                  <span className="font-medium text-emerald-400">
                    {placement.package || "-"}
                  </span>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Company Information */}

          <Card>

            <CardBody>

              <h2 className="mb-5 text-lg font-semibold text-white">
                Company Information
              </h2>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orbit-primary/10">

                    <Building2
                      size={30}
                      className="text-orbit-primary"
                    />

                  </div>

                  <div>

                    <h3 className="text-xl font-semibold text-white">
                      {placement.organization_table?.user_table?.name ||
                        "Unknown Company"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {placement.organization_table?.user_table?.email ||
                        "Email unavailable"}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Mobile :
                      {" "}
                      {placement.organization_table?.user_table?.mobile_no ||
                        "-"}
                    </p>

                  </div>

                </div>

              </div>

            </CardBody>

          </Card>

        </div>
                {/* ===========================================
                    Placement Statistics
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-6 text-lg font-semibold text-white">
              Placement Overview
            </h2>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Placement ID
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  #{placement.placement_id}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Organization
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  {placement.organization_table?.user_table?.name ||
                    "-"}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Minimum CGPA
                </p>

                <h3 className="mt-2 text-2xl font-bold text-emerald-400">
                  {placement.min_cgpa}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Status
                </p>

                <Badge
                  className="mt-3"
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

            </div>

          </CardBody>

        </Card>

      </div>

    </DashboardShell>

  );

}