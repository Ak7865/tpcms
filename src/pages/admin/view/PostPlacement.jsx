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
  Briefcase,
  IndianRupee,
  MapPin,
  Calendar,
  Award,
  ArrowLeft,
} from "lucide-react";
import { api } from "../../../services/api";

export default function PostPlacement() {
  const navigate = useNavigate();

  const bannerRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");

  const [bannerFile, setBannerFile] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    package: "",
    location: "",
    min_cgpa: "",
    start_date: "",
    end_date: "",
    last_date_of_submission: "",
    is_active: true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handleBanner(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setBannerFile(file);

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let image_url = "";

      /* Upload banner */

      if (bannerFile) {
        const uploadRes = await api.upload(
          "/uploads/banner-media",
          bannerFile
        );

        image_url =
          uploadRes?.data?.fileUrl ||
          uploadRes?.fileUrl ||
          "";
      }

      /* Create placement */

      await api.post("/placements", {
        ...form,
        image_url,
      });

      setSuccess("Placement created successfully.");

      setTimeout(() => {
        navigate(
          "/coordinator/dashboard?view=view-placements"
        );
      }, 1000);

    } catch (err) {

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to create placement."
      );

    } finally {

      setLoading(false);

    }
  }
    return (
    <DashboardShell
      title="Post Placement"
      subtitle="Create a new placement opportunity"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ===========================================
                    Banner Upload
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-5 text-lg font-semibold text-white">
              Company Banner
            </h2>

            <div className="flex flex-col gap-6 lg:flex-row">

              <div
                onClick={() => bannerRef.current?.click()}
                className="flex h-64 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-orbit-border bg-orbit-surface2 hover:border-orbit-primary transition lg:w-96"
              >

                {preview ? (

                  <img
                    src={preview}
                    alt="Banner Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />

                ) : (

                  <div className="text-center">

                    <Upload
                      size={40}
                      className="mx-auto text-slate-500"
                    />

                    <p className="mt-3 text-slate-400">
                      Click to upload banner
                    </p>

                    <p className="text-xs text-slate-600">
                      JPG, PNG supported
                    </p>

                  </div>

                )}

              </div>

              <input
                ref={bannerRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleBanner}
              />

              <div className="flex flex-1 items-center">

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    Banner Guidelines
                  </h3>

                  <ul className="mt-4 space-y-2 text-sm text-slate-400">

                    <li>• Recommended size: 1200 × 600 px</li>

                    <li>• PNG or JPG format</li>

                    <li>• Maximum file size 5 MB</li>

                    <li>• Use a clear company banner</li>

                  </ul>

                </div>

              </div>

            </div>

          </CardBody>

        </Card>

        {/* ===========================================
                    Placement Information
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-6 text-lg font-semibold text-white">
              Placement Information
            </h2>

            <div className="grid gap-5">

              <Input
                label="Placement Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
              />

              <Textarea
                label="Description"
                rows={6}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the placement opportunity..."
                required
              />

            </div>

          </CardBody>

        </Card>

        {/* ===========================================
                    Eligibility & Job Details
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-6 text-lg font-semibold text-white">
              Job Details
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Package (CTC)"
                name="package"
                value={form.package}
                onChange={handleChange}
                placeholder="₹6 LPA"
              />

              <Input
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Bangalore"
              />

              <Input
                label="Minimum CGPA"
                type="number"
                step="0.01"
                name="min_cgpa"
                value={form.min_cgpa}
                onChange={handleChange}
                placeholder="6.5"
                required
              />

              <Input
                label="Start Date"
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
              />

              <Input
                label="End Date"
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
              />

              <Input
                label="Last Date of Application"
                type="date"
                name="last_date_of_submission"
                value={form.last_date_of_submission}
                onChange={handleChange}
                required
              />

            </div>

          </CardBody>

        </Card>
        {/* ===========================================
                    Placement Status
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-6 text-lg font-semibold text-white">
              Placement Status
            </h2>

            <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

              <div>

                <h3 className="font-medium text-white">
                  Publish Placement
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Students can apply only when the placement is active.
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

        {/* Success Message */}

        {success && (

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">

            {success}

          </div>

        )}

        {/* Error Message */}

        {error && (

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">

            {error}

          </div>

        )}

        {/* ===========================================
                    Action Buttons
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-2 text-sm text-slate-500">

                <Briefcase
                  size={18}
                  className="text-orbit-primary"
                />

                Complete all required details before publishing the placement.

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
                  icon={
                    loading ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Upload size={16} />
                    )
                  }
                >
                  {loading
                    ? "Creating..."
                    : "Create Placement"}
                </Button>

              </div>

            </div>

          </CardBody>

        </Card>

      </form>

    </DashboardShell>

  );

}