import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardShell from "../../../components/DashboardShell";

import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Switch,
} from "../../../components/ui";

import {
  Upload,
  Loader2,
  Image as ImageIcon,
  Building2,
  Briefcase,
  GraduationCap,
  CalendarDays,
  MapPin,
  IndianRupee,
  ToggleRight,
  Rocket,
  ArrowLeft,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";

import { api } from "../../../services/api";

const LABEL =
  "mb-2 block text-xs font-medium text-slate-400";

const SECTION =
  "mb-5 flex items-center gap-2 border-b border-orbit-border pb-2 text-sm font-semibold text-slate-300";

export default function PostPlacement() {

  const navigate = useNavigate();

  const bannerRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [bannerPreview, setBannerPreview] = useState("");

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");
  const role =
  JSON.parse(sessionStorage.getItem("auth_user"))?.user?.role;

const [semesters, setSemesters] = useState([]);
const [departments, setDepartments] = useState([]);
const [genders, setGenders] = useState([]);

const [eligibility, setEligibility] = useState({
  min_cgpa: "",
  allow_backlog: false,
  semester_ids: [],
  department_ids: [],
  gender_id: "",
});

  const [form, setForm] = useState({

    company_name: "",

    title: "",

    description: "",

    package: "",

    location: "",

    last_date_of_submission: "",

    image_url: "",

    is_active: true,

  });

  function update(field) {

    return (e) => {

      const value =
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value;

      setForm((prev) => ({

        ...prev,

        [field]: value,

      }));

    };

  }

  /* ==============================
            Upload Banner
  ============================== */

  async function uploadBanner(e) {

    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    setBannerPreview(
      URL.createObjectURL(file)
    );

    try {

      const res = await api.upload(
        "/uploads/banner",
        file
      );

      const url =
        res?.data?.fileUrl ||
        res?.fileUrl ||
        "";

      setForm((prev) => ({

        ...prev,

        image_url: url,

      }));

      setSuccess(
        "Banner uploaded successfully."
      );

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setUploading(false);

    }

  }

  function removeBanner() {

    setBannerPreview("");

    setForm((prev) => ({

      ...prev,

      image_url: "",

    }));

    if (bannerRef.current) {

      bannerRef.current.value = "";

    }

  }

  function validate() {

    if (!form.company_name.trim())
      return "Company name is required.";

    if (!form.title.trim())
      return "Placement title is required.";

    if (!form.description.trim())
      return "Description is required.";

    return null;

  }
    /* =====================================
              Submit Placement
  ===================================== */

  async function handleSubmit(e) {

    e.preventDefault();

    setSuccess("");
    setError("");

    const message = validate();

    if (message) {
      setError(message);
      return;
    }

    try {

      setLoading(true);

      await api.post("/placements", {
        ...form,
        package: form.package
          ? Number(form.package)
          : null,
        min_cgpa: form.min_cgpa
          ? Number(form.min_cgpa)
          : null,
      });

      setSuccess("Placement posted successfully.");

      setBannerPreview("");

      if (bannerRef.current) {
        bannerRef.current.value = "";
      }

      setForm({
        company_name: "",
        title: "",
        description: "",
        package: "",
        location: "",
        min_cgpa: "",
        last_date_of_submission: "",
        image_url: "",
        is_active: true,
      });

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <DashboardShell
      title="Post Placement"
      subtitle="Publish a new placement drive"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* =====================================
                    Company Banner
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <ImageIcon
                size={16}
                className="text-orbit-primary"
              />

              Company Banner

            </p>

            <div className="grid gap-6 lg:grid-cols-2">

              {/* Upload */}

              <div>

                {bannerPreview ? (

                  <div className="relative overflow-hidden rounded-2xl border border-orbit-border">

                    <img
                      src={bannerPreview}
                      alt="Company Banner"
                      className="h-64 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeBanner}
                      className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    >

                      <X size={16} />

                    </button>

                  </div>

                ) : (

                  <label
                    className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orbit-border bg-orbit-surface2 transition hover:border-orbit-primary hover:bg-orbit-primary/5"
                  >

                    {uploading ? (

                      <>

                        <Loader2
                          size={32}
                          className="animate-spin text-orbit-primary"
                        />

                        <p className="mt-4 text-slate-300">

                          Uploading Banner...

                        </p>

                      </>

                    ) : (

                      <>

                        <Upload
                          size={42}
                          className="text-orbit-primary"
                        />

                        <p className="mt-4 text-white font-medium">

                          Click to Upload Banner

                        </p>

                        <p className="mt-2 text-xs text-slate-500">

                          PNG • JPG • WEBP

                        </p>

                      </>

                    )}

                    <input
                      hidden
                      ref={bannerRef}
                      type="file"
                      accept="image/*"
                      onChange={uploadBanner}
                    />

                  </label>

                )}

              </div>

              {/* Banner Info */}

              <div className="space-y-5">

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2 p-5">

                  <h3 className="font-semibold text-white">

                    Banner Guidelines

                  </h3>

                  <ul className="mt-4 space-y-2 text-sm text-slate-400">

                    <li>• Recommended 1200 × 600</li>

                    <li>• Company Logo / Office</li>

                    <li>• Maximum 5 MB</li>

                    <li>• High Resolution</li>

                  </ul>

                </div>

                {form.image_url && (

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

                    <div className="flex items-center gap-2">

                      <CheckCircle2
                        size={18}
                        className="text-emerald-400"
                      />

                      <span className="font-medium text-emerald-300">

                        Banner Uploaded Successfully

                      </span>

                    </div>

                    <p className="mt-3 break-all text-xs text-slate-300">

                      {form.image_url}

                    </p>

                  </div>

                )}

              </div>

            </div>

          </CardBody>

        </Card>

        {/* =====================================
                Placement Information
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <Building2
                size={16}
                className="text-orbit-primary"
              />

              Placement Information

            </p>

            <div className="grid gap-5">

              <Input
                label="Company Name"
                placeholder="Google"
                value={form.company_name}
                onChange={update("company_name")}
              />

              <Input
                label="Job Role"
                placeholder="Software Engineer"
                value={form.title}
                onChange={update("title")}
              />

              <Textarea
                label="Job Description"
                rows={6}
                placeholder="Describe the placement..."
                value={form.description}
                onChange={update("description")}
              />

            </div>

          </CardBody>

        </Card>
                {/* =====================================
                Package & Eligibility
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <Briefcase
                size={16}
                className="text-orbit-primary"
              />

              Package & Eligibility

            </p>

            <div className="grid gap-5 md:grid-cols-3">

              <Input
                label="Package (LPA)"
                type="number"
                step="0.1"
                placeholder="8.5"
                value={form.package}
                onChange={update("package")}
              />

              <Input
                label="Location"
                placeholder="Bangalore"
                value={form.location}
                onChange={update("location")}
              />

              <Input
                label="Minimum CGPA"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="6.50"
                value={form.min_cgpa}
                onChange={update("min_cgpa")}
              />

            </div>

          </CardBody>

        </Card>

        {/* =====================================
                Application Deadline
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <CalendarDays
                size={16}
                className="text-orbit-primary"
              />

              Deadline

            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Last Date of Application"
                type="date"
                value={form.last_date_of_submission}
                onChange={update("last_date_of_submission")}
              />

              <div className="flex items-end">

                <div className="w-full rounded-xl border border-orbit-border bg-orbit-surface2 p-4">

                  <p className="text-xs text-slate-500">

                    Placement Status

                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-emerald-400">

                    {form.is_active
                      ? "Open"
                      : "Closed"}

                  </h3>

                </div>

              </div>

            </div>

          </CardBody>

        </Card>

        {/* =====================================
                Student Preview
        ===================================== */}

        <Card>

          <CardBody>

            <div className="mb-5 flex items-center justify-between">

              <p className={SECTION.replace("mb-5", "mb-0")}>

                <Eye
                  size={16}
                  className="text-orbit-primary"
                />

                Student Preview

              </p>

              <Button
                type="button"
                variant="outline"
                icon={<Eye size={15} />}
                onClick={() =>
                  setPreviewOpen(true)
                }
              >
                Full Preview
              </Button>

            </div>

            <div className="overflow-hidden rounded-2xl border border-orbit-border bg-orbit-surface2">

              {bannerPreview ? (

                <img
                  src={bannerPreview}
                  alt="Banner"
                  className="h-64 w-full object-cover"
                />

              ) : (

                <div className="flex h-64 items-center justify-center bg-orbit-surface">

                  <ImageIcon
                    size={70}
                    className="text-slate-600"
                  />

                </div>

              )}

              <div className="space-y-5 p-6">

                <h2 className="text-3xl font-bold text-white">

                  {form.company_name || "Company Name"}

                </h2>

                <p className="text-xl font-medium text-orbit-primary">

                  {form.title || "Job Role"}

                </p>

                <p className="leading-7 text-slate-400">

                  {form.description ||

                    "Placement description will appear here."}

                </p>

                <div className="grid gap-4 md:grid-cols-4">

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Package

                    </p>

                    <h3 className="mt-2 flex items-center text-xl font-bold text-emerald-400">

                      <IndianRupee
                        size={18}
                        className="mr-1"
                      />

                      {form.package || "--"} LPA

                    </h3>

                  </div>

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Location

                    </p>

                    <h3 className="mt-2 flex items-center font-semibold text-white">

                      <MapPin
                        size={16}
                        className="mr-2 text-orbit-primary"
                      />

                      {form.location || "--"}

                    </h3>

                  </div>

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Minimum CGPA

                    </p>

                    <h3 className="mt-2 text-xl font-bold text-orbit-primary">

                      {form.min_cgpa || "--"}

                    </h3>

                  </div>

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Apply Before

                    </p>

                    <h3 className="mt-2 font-semibold text-white">

                      {form.last_date_of_submission || "--"}

                    </h3>

                  </div>

                </div>

                <Button>

                  Apply Now

                </Button>

              </div>

            </div>

          </CardBody>

        </Card>

        {/* =====================================
                Visibility
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <ToggleRight
                size={16}
                className="text-orbit-primary"
              />

              Visibility

            </p>

            <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2 p-5">

              <div>

                <h3 className="font-semibold text-white">

                  Publish Placement

                </h3>

                <p className="mt-1 text-sm text-slate-500">

                  Active placements are immediately visible to students.

                </p>

              </div>

              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    is_active: checked,
                  }))
                }
              />

            </div>

          </CardBody>

        </Card>
                {/* =====================================
                Messages
        ===================================== */}

        {success && (

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">

            {success}

          </div>

        )}

        {error && (

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">

            {error}

          </div>

        )}

        {/* =====================================
                Action Buttons
        ===================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="text-sm text-slate-500">

                Verify all placement information before publishing.

              </div>

              <div className="flex gap-3">

                <Button
                  type="button"
                  variant="outline"
                  icon={<ArrowLeft size={16} />}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={uploading}
                  icon={
                    loading ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Rocket size={16} />
                    )
                  }
                >
                  {loading
                    ? "Publishing..."
                    : "Publish Placement"}
                </Button>

              </div>

            </div>

          </CardBody>

        </Card>

      </form>

      {/* =====================================
                Student Preview Modal
      ===================================== */}

      {previewOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">

          <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-orbit-border bg-orbit-surface">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-orbit-border px-6 py-4">

              <div>

                <h2 className="text-xl font-semibold text-white">

                  Placement Preview

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  This is how students will see this placement drive.

                </p>

              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-2 transition hover:bg-red-500/20"
              >
                <X className="text-red-400" />
              </button>

            </div>

            {/* Banner */}

            {bannerPreview ? (

              <img
                src={bannerPreview}
                alt="Placement Banner"
                className="h-80 w-full object-cover"
              />

            ) : (

              <div className="flex h-80 items-center justify-center bg-orbit-surface2">

                <ImageIcon
                  size={90}
                  className="text-slate-600"
                />

              </div>

            )}

            {/* Body */}

            <div className="space-y-6 p-8">

              <div>

                <h1 className="text-4xl font-bold text-white">

                  {form.company_name || "Company Name"}

                </h1>

                <h2 className="mt-2 text-2xl font-semibold text-orbit-primary">

                  {form.title || "Job Role"}

                </h2>

              </div>

              <p className="leading-8 text-slate-400">

                {form.description ||
                  "Placement description will appear here."}

              </p>

              <div className="grid gap-5 md:grid-cols-4">

                <div className="rounded-xl bg-orbit-surface2 p-5">

                  <p className="text-xs text-slate-500">

                    Package

                  </p>

                  <h3 className="mt-2 flex items-center text-xl font-bold text-emerald-400">

                    <IndianRupee
                      size={18}
                      className="mr-1"
                    />

                    {form.package || "--"} LPA

                  </h3>

                </div>

                <div className="rounded-xl bg-orbit-surface2 p-5">

                  <p className="text-xs text-slate-500">

                    Location

                  </p>

                  <h3 className="mt-2 flex items-center font-semibold text-white">

                    <MapPin
                      size={16}
                      className="mr-2 text-orbit-primary"
                    />

                    {form.location || "--"}

                  </h3>

                </div>

                <div className="rounded-xl bg-orbit-surface2 p-5">

                  <p className="text-xs text-slate-500">

                    Minimum CGPA

                  </p>

                  <h3 className="mt-2 text-xl font-bold text-orbit-primary">

                    {form.min_cgpa || "--"}

                  </h3>

                </div>

                <div className="rounded-xl bg-orbit-surface2 p-5">

                  <p className="text-xs text-slate-500">

                    Apply Before

                  </p>

                  <h3 className="mt-2 font-semibold text-white">

                    {form.last_date_of_submission || "--"}

                  </h3>

                </div>

              </div>

              <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2 p-5">

                <div>

                  <p className="text-xs text-slate-500">

                    Placement Status

                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-white">

                    {form.is_active
                      ? "Open for Applications"
                      : "Closed"}
                  </h3>

                </div>

                <Button>

                  Apply Now

                </Button>

              </div>

            </div>

          </div>

        </div>

      )}

    </DashboardShell>

  );

}