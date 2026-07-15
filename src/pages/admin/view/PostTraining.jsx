import { useEffect, useRef, useState } from "react";
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
  BookOpenCheck,
  GraduationCap,
  CalendarDays,
  ToggleRight,
  Rocket,
  ArrowLeft,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";

import { api } from "../../../services/api";

const SECTION =
  "mb-5 flex items-center gap-2 border-b border-orbit-border pb-2 text-sm font-semibold text-slate-300";

export default function PostTraining() {

  const navigate = useNavigate();

  const bannerRef = useRef(null);

  const role =
    JSON.parse(
      sessionStorage.getItem("auth_user")
    )?.user?.role || "";

  /* -------------------------
      Loading
  -------------------------- */

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [bannerPreview, setBannerPreview] =
    useState("");

  /* -------------------------
      Master Data
  -------------------------- */

  const [semesters, setSemesters] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [genders, setGenders] =
    useState([]);
    /* -------------------------
      Training Form
  -------------------------- */

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    start_date: "",
    end_date: "",
    last_date_of_submission: "",
    is_active: true,
  });

  /* -------------------------
      Eligibility
  -------------------------- */

  const [eligibility, setEligibility] = useState({
    min_cgpa: "",
    allow_backlog: false,
    semester_ids: [],
    department_ids: [],
    gender_id: "",
  });

  /* -------------------------
      Load Master Data
  -------------------------- */

  useEffect(() => {
    loadMasters();
  }, []);

  async function loadMasters() {
    try {
      const [
        semesterRes,
        departmentRes,
        genderRes,
      ] = await Promise.all([
        api.get("/semesters"),
        api.get("/departments"),
        api.get("/genders"),
      ]);

      setSemesters(semesterRes.data || []);
      setDepartments(departmentRes.data || []);
      setGenders(genderRes.data || []);

    } catch (err) {
      console.error(err);
    }
  }

  /* -------------------------
      Update Form
  -------------------------- */

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

  /* -------------------------
      Toggle Semester
  -------------------------- */

  function toggleSemester(id) {

    setEligibility((prev) => {

      const exists =
        prev.semester_ids.includes(id);

      return {
        ...prev,
        semester_ids: exists
          ? prev.semester_ids.filter(
              (item) => item !== id
            )
          : [...prev.semester_ids, id],
      };

    });

  }

  /* -------------------------
      Toggle Department
  -------------------------- */

  function toggleDepartment(id) {

    setEligibility((prev) => {

      const exists =
        prev.department_ids.includes(id);

      return {
        ...prev,
        department_ids: exists
          ? prev.department_ids.filter(
              (item) => item !== id
            )
          : [...prev.department_ids, id],
      };

    });

  }
    /* -------------------------
      Upload Banner
  -------------------------- */

  async function uploadBanner(e) {

    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    setBannerPreview(
      URL.createObjectURL(file)
    );

    try {

      const res = await api.upload(
        "/uploads/banner",
        file
      );

      const imageUrl =
        res?.data?.fileUrl ||
        res?.data?.url ||
        res?.data?.image_url ||
        res?.fileUrl ||
        "";

      setForm((prev) => ({
        ...prev,
        image_url: imageUrl,
      }));

      setSuccess(
        "Banner uploaded successfully."
      );

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message ||
        "Banner upload failed."
      );

      setBannerPreview("");

    } finally {

      setUploading(false);

    }

  }

  /* -------------------------
      Remove Banner
  -------------------------- */

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

  /* -------------------------
      Validation
  -------------------------- */

  function validate() {

    if (!form.title.trim())
      return "Training title is required.";

    if (!form.description.trim())
      return "Training description is required.";

    if (!form.image_url)
      return "Please upload a banner.";

    if (!eligibility.min_cgpa)
      return "Minimum CGPA is required.";

    if (
      eligibility.semester_ids.length === 0
    )
      return "Select at least one eligible semester.";

    if (
      role === "Super Admin" &&
      eligibility.department_ids.length === 0
    )
      return "Select at least one department.";

    return null;

  }

  /* -------------------------
      Submit Training
  -------------------------- */

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setSuccess("");

    const message = validate();

    if (message) {
      setError(message);
      return;
    }

    try {

      setLoading(true);

      const payload = {

        ...form,

        min_cgpa: Number(
          eligibility.min_cgpa
        ),

        allow_backlog:
          eligibility.allow_backlog,

        semester_ids:
          eligibility.semester_ids,

        gender_id:
          eligibility.gender_id || null,

      };

      if (role === "Super Admin") {

        payload.department_ids =
          eligibility.department_ids;

      }
            await api.post("/trainings", payload);

      setSuccess("Training posted successfully.");

      setForm({
        title: "",
        description: "",
        image_url: "",
        start_date: "",
        end_date: "",
        last_date_of_submission: "",
        is_active: true,
      });

      setEligibility({
        min_cgpa: "",
        allow_backlog: false,
        semester_ids: [],
        department_ids: [],
        gender_id: "",
      });

      setBannerPreview("");

      if (bannerRef.current) {
        bannerRef.current.value = "";
      }

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to post training."
      );

    } finally {

      setLoading(false);

    }

  }

  /* =====================================
              JSX
  ===================================== */

  return (

    <DashboardShell
      title="Post Training"
      subtitle="Create a new training program"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
               {/* =====================================
                  Banner Upload
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <ImageIcon size={16} />

              Training Banner

            </p>

            <div className="grid gap-6 lg:grid-cols-2">

              {/* Upload */}

              <div>

                {bannerPreview ? (

                  <div className="relative overflow-hidden rounded-2xl border border-orbit-border">

                    <img
                      src={bannerPreview}
                      alt="Training Banner"
                      className="h-72 w-full object-cover"
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
                    className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orbit-border bg-orbit-surface2 transition hover:border-orbit-primary hover:bg-orbit-primary/5"
                  >

                    {uploading ? (

                      <>

                        <Loader2
                          size={34}
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

                        <p className="mt-4 text-lg font-medium">

                          Click to Upload Banner

                        </p>

                        <p className="mt-2 text-sm text-slate-500">

                          JPG • PNG • WEBP

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

              {/* Right Side */}

              <div className="space-y-5">

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2 p-5">

                  <h3 className="font-semibold text-white">

                    Banner Guidelines

                  </h3>

                  <ul className="mt-4 space-y-2 text-sm text-slate-400">

                    <li>• Recommended 1200 × 600</li>

                    <li>• PNG, JPG or WEBP</li>

                    <li>• Maximum size 5 MB</li>

                    <li>• High quality banner</li>

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
              Training Information
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <BookOpenCheck
                size={16}
                className="text-orbit-primary"
              />

              Training Information

            </p>

            <div className="grid gap-5">

              <Input
                label="Training Title"
                placeholder="React Bootcamp 2026"
                value={form.title}
                onChange={update("title")}
              />

              <Textarea
                label="Training Description"
                rows={8}
                placeholder="Write complete training details..."
                value={form.description}
                onChange={update("description")}
              />

            </div>

          </CardBody>

        </Card>

        {/* =====================================
              Status
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <ToggleRight
                size={16}
                className="text-orbit-primary"
              />

              Training Status

            </p>

            <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2 p-5">

              <div>

                <h3 className="font-semibold text-white">

                  Publish Training

                </h3>

                <p className="mt-1 text-sm text-slate-500">

                  Students can only see active trainings.

                </p>

              </div>

              <Switch
                checked={form.is_active}
                onCheckedChange={(checked)=>
                  setForm(prev=>({
                    ...prev,
                    is_active: checked,
                  }))
                }
              />

            </div>

          </CardBody>

        </Card>
                {/* =====================================
                Eligibility Criteria
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <GraduationCap
                size={16}
                className="text-orbit-primary"
              />

              Eligibility Criteria

            </p>

            <div className="space-y-8">

              {/* ============================
                    Minimum CGPA
              ============================ */}

              <Input
                label="Minimum CGPA"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="6.50"
                value={eligibility.min_cgpa}
                onChange={(e)=>
                  setEligibility(prev=>({
                    ...prev,
                    min_cgpa:e.target.value,
                  }))
                }
              />

              {/* ============================
                    Current Backlog
              ============================ */}

              <div>

                <label className="mb-3 block text-sm font-medium">

                  Current Backlog

                </label>

                <div className="grid gap-3 md:grid-cols-2">

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-orbit-border p-4 hover:border-orbit-primary">

                    <input
                      type="radio"
                      name="backlog"
                      checked={!eligibility.allow_backlog}
                      onChange={()=>
                        setEligibility(prev=>({
                          ...prev,
                          allow_backlog:false,
                        }))
                      }
                    />

                    <div>

                      <p className="font-medium">

                        Not Allowed

                      </p>

                      <p className="text-xs text-slate-500">

                        Students having backlog cannot apply.

                      </p>

                    </div>

                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-orbit-border p-4 hover:border-orbit-primary">

                    <input
                      type="radio"
                      name="backlog"
                      checked={eligibility.allow_backlog}
                      onChange={()=>
                        setEligibility(prev=>({
                          ...prev,
                          allow_backlog:true,
                        }))
                      }
                    />

                    <div>

                      <p className="font-medium">

                        Allowed

                      </p>

                      <p className="text-xs text-slate-500">

                        Students with backlog can apply.

                      </p>

                    </div>

                  </label>

                </div>

              </div>

              {/* ============================
                    Eligible Semester
              ============================ */}

              <div>

                <label className="mb-3 block text-sm font-medium">

                  Eligible Semesters

                </label>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                  {semesters.map((semester)=>(

                    <label
                      key={semester.semester_id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-orbit-border p-3 hover:border-orbit-primary"
                    >

                      <input
                        type="checkbox"
                        checked={eligibility.semester_ids.includes(
                          semester.semester_id
                        )}
                        onChange={()=>
                          toggleSemester(
                            semester.semester_id
                          )
                        }
                      />

                      <span className="text-sm">

                        {semester.semester_name}

                      </span>

                    </label>

                  ))}

                </div>

              </div>
                            {/* ============================
                    Eligible Department
              ============================ */}

              {role === "Super Admin" && (

                <div>

                  <label className="mb-3 block text-sm font-medium">

                    Eligible Departments

                  </label>

                  <div className="grid grid-cols-2 gap-3">

                    {departments.map((department) => (

                      <label
                        key={department.department_id}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-orbit-border p-3 hover:border-orbit-primary"
                      >

                        <input
                          type="checkbox"
                          checked={eligibility.department_ids.includes(
                            department.department_id
                          )}
                          onChange={() =>
                            toggleDepartment(
                              department.department_id
                            )
                          }
                        />

                        <span className="text-sm">

                          {department.department_name}

                        </span>

                      </label>

                    ))}

                  </div>

                </div>

              )}

              {/* ============================
                    Gender
              ============================ */}

              <div>

                <label className="mb-3 block text-sm font-medium">

                  Gender

                </label>

                <select
                  className="w-full rounded-xl border border-orbit-border bg-orbit-surface p-3 outline-none"
                  value={eligibility.gender_id}
                  onChange={(e)=>
                    setEligibility(prev=>({
                      ...prev,
                      gender_id:e.target.value,
                    }))
                  }
                >

                  <option value="">

                    All Students

                  </option>

                  {genders.map((gender)=>(

                    <option
                      key={gender.gender_id}
                      value={gender.gender_id}
                    >

                      {gender.gender_name}

                    </option>

                  ))}

                </select>

              </div>

            </div>

          </CardBody>

        </Card>

        {/* =====================================
                Schedule
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <CalendarDays
                size={16}
                className="text-orbit-primary"
              />

              Training Schedule

            </p>

            <div className="grid gap-5 md:grid-cols-3">

              <Input
                label="Application Deadline"
                type="date"
                value={form.last_date_of_submission}
                onChange={update("last_date_of_submission")}
              />

              <Input
                label="Training Start Date"
                type="date"
                value={form.start_date}
                onChange={update("start_date")}
              />

              <Input
                label="Training End Date"
                type="date"
                value={form.end_date}
                onChange={update("end_date")}
              />

            </div>

          </CardBody>

        </Card>
                {/* =====================================
                Student Preview
        ===================================== */}

        <Card>

          <CardBody>

            <div className="mb-5 flex items-center justify-between">

              <p className={SECTION.replace("mb-5","mb-0")}>

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

              <div className="space-y-6 p-6">

                <h2 className="text-3xl font-bold text-white">

                  {form.title || "Training Title"}

                </h2>

                <p className="leading-7 text-slate-400">

                  {form.description ||
                    "Training description will appear here."}

                </p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Minimum CGPA

                    </p>

                    <h3 className="mt-2 text-xl font-bold text-orbit-primary">

                      {eligibility.min_cgpa || "--"}

                    </h3>

                  </div>

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Backlog

                    </p>

                    <h3 className="mt-2 font-semibold">

                      {eligibility.allow_backlog
                        ? "Allowed"
                        : "Not Allowed"}

                    </h3>

                  </div>

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Gender

                    </p>

                    <h3 className="mt-2 font-semibold">

                      {genders.find(
                        g =>
                          String(g.gender_id) ===
                          String(
                            eligibility.gender_id
                          )
                      )?.gender_name || "All"}

                    </h3>

                  </div>

                </div>

                <div>

                  <h3 className="mb-3 text-lg font-semibold">

                    Eligible Semesters

                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {eligibility.semester_ids.length ===
                    0 ? (

                      <span className="text-slate-500">

                        None Selected

                      </span>

                    ) : (

                      semesters
                        .filter(sem =>
                          eligibility.semester_ids.includes(
                            sem.semester_id
                          )
                        )
                        .map(sem => (

                          <span
                            key={sem.semester_id}
                            className="rounded-full bg-orbit-primary px-3 py-1 text-xs text-white"
                          >

                            {sem.semester_name}

                          </span>

                        ))

                    )}

                  </div>

                </div>

                {role === "Super Admin" && (

                  <div>

                    <h3 className="mb-3 text-lg font-semibold">

                      Eligible Departments

                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {departments
                        .filter(dep =>
                          eligibility.department_ids.includes(
                            dep.department_id
                          )
                        )
                        .map(dep => (

                          <span
                            key={dep.department_id}
                            className="rounded-full bg-green-600 px-3 py-1 text-xs text-white"
                          >

                            {dep.department_name}

                          </span>

                        ))}

                    </div>

                  </div>

                )}

                <div className="grid gap-4 md:grid-cols-3">

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Start Date

                    </p>

                    <h3 className="mt-2">

                      {form.start_date || "--"}

                    </h3>

                  </div>

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      End Date

                    </p>

                    <h3 className="mt-2">

                      {form.end_date || "--"}

                    </h3>

                  </div>

                  <div className="rounded-xl bg-orbit-surface p-4">

                    <p className="text-xs text-slate-500">

                      Last Date

                    </p>

                    <h3 className="mt-2">

                      {form.last_date_of_submission ||
                        "--"}

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
                Alerts
        ===================================== */}

        {success && (

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">

            <div className="flex items-center gap-3">

              <CheckCircle2
                size={20}
                className="text-emerald-400"
              />

              <p className="font-medium text-emerald-300">

                {success}

              </p>

            </div>

          </div>

        )}

        {error && (

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">

            <div className="flex items-center gap-3">

              <X
                size={20}
                className="text-red-400"
              />

              <p className="font-medium text-red-300">

                {error}

              </p>

            </div>

          </div>

        )}

        {/* =====================================
                Footer Buttons
        ===================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-col gap-4 md:flex-row md:justify-end">

              <Button
                type="button"
                variant="outline"
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate(-1)}
              >

                Cancel

              </Button>

              <Button
                type="button"
                variant="outline"
                icon={<Eye size={16} />}
                onClick={() => setPreviewOpen(true)}
              >

                Preview

              </Button>

              <Button
                type="submit"
                disabled={loading}
                icon={
                  loading
                    ? <Loader2 className="animate-spin" size={16} />
                    : <Rocket size={16} />
                }
              >

                {loading
                  ? "Publishing..."
                  : "Publish Training"}

              </Button>

            </div>

          </CardBody>

        </Card>
                {/* =====================================
                Preview Modal
        ===================================== */}

        {previewOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

            <div className="relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-orbit-background border border-orbit-border">

              {/* Header */}

              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-orbit-border bg-orbit-background px-6 py-4">

                <h2 className="text-xl font-bold">

                  Training Preview

                </h2>

                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-lg p-2 transition hover:bg-orbit-surface"
                >

                  <X size={20} />

                </button>

              </div>

              {/* Banner */}

              {bannerPreview ? (

                <img
                  src={bannerPreview}
                  alt="Training Banner"
                  className="h-72 w-full object-cover"
                />

              ) : (

                <div className="flex h-72 items-center justify-center bg-orbit-surface">

                  <ImageIcon
                    size={70}
                    className="text-slate-600"
                  />

                </div>

              )}

              <div className="space-y-8 p-8">

                <div>

                  <h1 className="text-4xl font-bold">

                    {form.title || "Training Title"}

                  </h1>

                  <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-300">

                    {form.description ||
                      "Training description..."}

                  </p>

                </div>

                <div className="grid gap-5 md:grid-cols-3">

                  <Card>

                    <CardBody>

                      <p className="text-xs text-slate-500">

                        Minimum CGPA

                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-orbit-primary">

                        {eligibility.min_cgpa || "--"}

                      </h3>

                    </CardBody>

                  </Card>

                  <Card>

                    <CardBody>

                      <p className="text-xs text-slate-500">

                        Backlog

                      </p>

                      <h3 className="mt-2 font-semibold">

                        {eligibility.allow_backlog
                          ? "Allowed"
                          : "Not Allowed"}

                      </h3>

                    </CardBody>

                  </Card>

                  <Card>

                    <CardBody>

                      <p className="text-xs text-slate-500">

                        Gender

                      </p>

                      <h3 className="mt-2 font-semibold">

                        {genders.find(
                          g =>
                            String(g.gender_id) ===
                            String(
                              eligibility.gender_id
                            )
                        )?.gender_name || "All"}

                      </h3>

                    </CardBody>

                  </Card>

                </div>

                <div className="flex justify-end">

                  <Button
                    type="button"
                    onClick={() =>
                      setPreviewOpen(false)
                    }
                  >

                    Close Preview

                  </Button>

                </div>

              </div>

            </div>

          </div>

        )}

      </form>

    </DashboardShell>

  );

}