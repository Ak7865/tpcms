import { useRef, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Button, Input } from "../../../components/ui";
import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  ImageIcon,
  AlignLeft,
  Rocket,
  ToggleRight,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { api } from "../../../services/api";

const SELECT_CLS =
  "w-full rounded-xl border border-orbit-border bg-orbit-surface2 px-4 py-3 text-slate-200 appearance-none outline-none focus:border-orbit-primary transition-colors";

const LABEL_CLS = "block text-xs font-medium text-slate-400 mb-1.5";

const SECTION_CLS =
  "text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4 pb-2 border-b border-orbit-border/50";

export default function PostPlacement() {
  const [loading, setLoading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    min_cgpa: "",
    last_date_of_submission: "",
    start_date: "",
    end_date: "",
    image_url: "",
    is_active: true,
  });

  const update = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ── Banner Upload ── */
  async function handleBannerChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerPreview(URL.createObjectURL(file));
    try {
      setBannerUploading(true);
      const res = await api.upload("/uploads/banner", file);
      const url = res?.data?.fileUrl || res?.fileUrl || "";
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError("Banner upload failed: " + (err.message || "Unknown error"));
    } finally {
      setBannerUploading(false);
    }
  }

  function removeBanner() {
    setBannerPreview("");
    setForm((prev) => ({ ...prev, image_url: "" }));
    if (fileRef.current) fileRef.current.value = "";
  }

  function validate() {
    if (!form.title.trim()) return "Placement title is required.";
    if (form.min_cgpa && (isNaN(form.min_cgpa) || Number(form.min_cgpa) < 0 || Number(form.min_cgpa) > 10))
      return "Min CGPA must be a number between 0 and 10.";
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      return "End date cannot be before start date.";
    if (form.last_date_of_submission && form.start_date && form.last_date_of_submission > form.start_date)
      return "Last date of submission should be before or on start date.";
    return null;
  }

  function buildPayload() {
    const payload = {
      title: form.title.trim(),
      is_active: form.is_active,
    };

    if (form.description.trim()) payload.description = form.description.trim();
    if (form.min_cgpa) payload.min_cgpa = Number(form.min_cgpa);
    if (form.last_date_of_submission)
      payload.last_date_of_submission = new Date(form.last_date_of_submission).toISOString();
    if (form.start_date)
      payload.start_date = new Date(form.start_date).toISOString();
    if (form.end_date)
      payload.end_date = new Date(form.end_date).toISOString();
    if (form.image_url.trim()) payload.image_url = form.image_url.trim();

    return payload;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    setError("");

    const msg = validate();
    if (msg) { setError(msg); return; }

    try {
      setLoading(true);
      await api.post("/placements", buildPayload());
      setSuccess("Placement notification posted successfully!");
      setBannerPreview("");
      if (fileRef.current) fileRef.current.value = "";
      setForm({
        title: "",
        description: "",
        min_cgpa: "",
        last_date_of_submission: "",
        start_date: "",
        end_date: "",
        image_url: "",
        is_active: true,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to post placement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell
      title="Post Placement Notification"
      subtitle="Create a new placement drive or job notification"
    >
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Alerts ── */}
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

            {/* ── Banner Upload ── */}
            <div>
              <p className={SECTION_CLS}>
                <ImageIcon size={16} className="text-orbit-primary" />
                Banner Image <span className="text-slate-600 text-xs font-normal ml-1">(optional)</span>
              </p>
              {bannerPreview ? (
                <div className="relative w-full max-w-lg h-48 rounded-2xl overflow-hidden border border-orbit-border">
                  <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
                  {bannerUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 text-white text-sm">
                      <Loader2 size={18} className="animate-spin" /> Uploading...
                    </div>
                  )}
                  {!bannerUploading && (
                    <button type="button" onClick={removeBanner} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  {form.image_url && !bannerUploading && (
                    <div className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded text-emerald-300">✓ Uploaded</div>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full max-w-lg h-36 rounded-2xl border-2 border-dashed border-orbit-border hover:border-orbit-primary cursor-pointer transition-colors bg-orbit-surface2/30 hover:bg-orbit-primary/5">
                  <Upload size={24} className="text-slate-500 mb-2" />
                  <span className="text-sm text-slate-500">Click to upload banner image</span>
                  <span className="text-xs text-slate-600 mt-1">PNG, JPG, WebP supported</span>
                  <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleBannerChange} />
                </label>
              )}
            </div>

            {/* ── Basic Info ── */}
            <div>
              <p className={SECTION_CLS}>
                <BriefcaseBusiness size={16} className="text-orbit-primary" />
                Basic Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Title – required */}
                <div className="md:col-span-2">
                  <label className={LABEL_CLS}>
                    Placement Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.title}
                    onChange={update("title")}
                    placeholder="e.g. Software Engineer Intern"
                  />
                </div>

                {/* Min CGPA */}
                <div>
                  <label className={LABEL_CLS}>
                    <span className="flex items-center gap-1">
                      <GraduationCap size={12} />
                      Minimum CGPA <span className="text-slate-600 ml-1">(optional)</span>
                    </span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={form.min_cgpa}
                    onChange={update("min_cgpa")}
                    placeholder="e.g. 7.5"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className={LABEL_CLS}>
                    <span className="flex items-center gap-1">
                      <ImageIcon size={12} />
                      Banner Image URL <span className="text-slate-600 ml-1">(optional)</span>
                    </span>
                  </label>
                  <Input
                    value={form.image_url}
                    onChange={update("image_url")}
                    placeholder="https://example.com/banner.png"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className={LABEL_CLS}>
                    <span className="flex items-center gap-1">
                      <AlignLeft size={12} />
                      Description <span className="text-slate-600 ml-1">(optional)</span>
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={update("description")}
                    className="w-full rounded-xl border border-orbit-border bg-orbit-surface2 px-4 py-3 text-slate-200 outline-none resize-none focus:border-orbit-primary transition-colors"
                    placeholder="Describe the role, requirements, and selection process..."
                  />
                </div>

              </div>
            </div>

            {/* ── Dates ── */}
            <div>
              <p className={SECTION_CLS}>
                <CalendarDays size={16} className="text-orbit-primary" />
                Schedule &amp; Deadlines <span className="text-slate-600 text-xs font-normal ml-1">(all optional)</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div>
                  <label className={LABEL_CLS}>Last Date of Application</label>
                  <Input
                    type="date"
                    value={form.last_date_of_submission}
                    onChange={update("last_date_of_submission")}
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>Drive Start Date</label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={update("start_date")}
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>Drive End Date</label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={update("end_date")}
                  />
                </div>

              </div>
            </div>

            {/* ── Status ── */}
            <div>
              <p className={SECTION_CLS}>
                <ToggleRight size={16} className="text-orbit-primary" />
                Visibility
              </p>
              <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                <div
                  onClick={() =>
                    setForm((prev) => ({ ...prev, is_active: !prev.is_active }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                    form.is_active ? "bg-orbit-primary" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                      form.is_active ? "left-5.5 translate-x-0.5" : "left-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-slate-300">
                  {form.is_active
                    ? "Active — visible to students immediately"
                    : "Inactive — hidden from students"}
                </span>
              </label>
            </div>

            {/* ── Submit ── */}
            <div className="flex justify-end pt-2 border-t border-orbit-border">
              <Button
                type="submit"
                loading={loading}
                icon={<Rocket size={16} />}
              >
                Publish Placement
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
