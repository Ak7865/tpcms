import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Button, Input } from "../../../components/ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "../../../services/api";
import MediaUpload from "../../../components/ui/MediaUpload";

const emptyForm = {
  name: "",
  roll_no: "",
  email: "",
  mobile_no: "",
  gender_id: "",
  department_id: "",
  semester_id: "",
  date_of_birth: "",
  has_backlog: false,
  is_graduate: false,
  cgpa: "",
  twelfth_division_id: "",
  tenth_division_id: "",
  category_id: "",
  resume_url: "",
  image_url: "",
};

const inputClass =
  "w-full rounded-xl border border-orbit-border bg-orbit-surface2 px-4 py-3 text-sm text-slate-200 outline-none transition-all focus:border-orbit-primary focus:ring-2 focus:ring-orbit-primary/20";

const toArray = (res) => (Array.isArray(res?.data) ? res.data : []);

const formatDate = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const findIdByLabel = (items, idKey, labelKey, label) => {
  if (!label) return "";
  const found = items.find(
    (item) =>
      String(item[labelKey] || "").toLowerCase() === String(label).toLowerCase()
  );
  return found?.[idKey] || "";
};

const toOptionalNumber = (value) =>
  value === "" || value === null || value === undefined ? undefined : Number(value);

const toOptionalString = (value) => {
  const trimmed = String(value || "").trim();
  return trimmed || undefined;
};

export default function EditStudent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [meta, setMeta] = useState({
    departments: [],
    genders: [],
    divisions: [],
    categories: [],
    semesters: [],
  });

  const departmentNameById = useMemo(
    () =>
      meta.departments.reduce((acc, dept) => {
        acc[dept.department_id] = dept.department_name;
        return acc;
      }, {}),
    [meta.departments]
  );

  useEffect(() => {
    const load = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [studentRes, departments, genders, divisions, categories, semesters] =
          await Promise.all([
            api.get(`/students/${studentId}`),
            api.get("/departments/").catch(() => ({ data: [] })),
            api.get("/genders/").catch(() => ({ data: [] })),
            api.get("/divisions/").catch(() => ({ data: [] })),
            api.get("/categories/").catch(() => ({ data: [] })),
            api.get("/semesters/").catch(() => ({ data: [] })),
          ]);

        const nextMeta = {
          departments: toArray(departments),
          genders: toArray(genders),
          divisions: toArray(divisions),
          categories: toArray(categories),
          semesters: toArray(semesters),
        };
        const d = studentRes.data || {};

        setMeta(nextMeta);
        setForm({
          name: d.name || d.user_table?.name || "",
          roll_no: d.roll_no || "",
          email: d.email || d.user_table?.email || "",
          mobile_no: d.mobile_no || d.user_table?.mobile_no || "",
          gender_id:
            d.gender_id ||
            d.gender_table?.gender_id ||
            findIdByLabel(nextMeta.genders, "gender_id", "gender", d.gender),
          department_id:
            d.department_id ||
            d.department_table?.department_id ||
            findIdByLabel(
              nextMeta.departments,
              "department_id",
              "department_name",
              d.department
            ),
          semester_id: d.semester_id || d.semester_table?.semester_id || "",
          date_of_birth: formatDate(d.date_of_birth),
          has_backlog: Boolean(d.has_backlog),
          is_graduate: Boolean(d.is_graduate),
          cgpa: d.cgpa ?? "",
          twelfth_division_id:
            d.twelfth_division_id ||
            d.division_table_student_table_twelfth_division_idTodivision_table
              ?.division_id ||
            findIdByLabel(
              nextMeta.divisions,
              "division_id",
              "division",
              d.twelfth_division
            ),
          tenth_division_id:
            d.tenth_division_id ||
            d.division_table_student_table_tenth_division_idTodivision_table
              ?.division_id ||
            findIdByLabel(
              nextMeta.divisions,
              "division_id",
              "division",
              d.tenth_division
            ),
          category_id:
            d.category_id ||
            d.category_table?.category_id ||
            findIdByLabel(nextMeta.categories, "category_id", "category", d.category),
          resume_url: d.resume_url || "",
          image_url: d.image_url || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load student");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      roll_no: form.roll_no.trim(),
      email: form.email.trim(),
      mobile_no: toOptionalString(form.mobile_no),
      gender_id: toOptionalNumber(form.gender_id),
      department_id: toOptionalNumber(form.department_id),
      semester_id: toOptionalNumber(form.semester_id),
      date_of_birth: toOptionalString(form.date_of_birth),
      has_backlog: form.has_backlog,
      is_graduate: form.is_graduate,
      cgpa: toOptionalNumber(form.cgpa),
      twelfth_division_id: toOptionalNumber(form.twelfth_division_id),
      tenth_division_id: toOptionalNumber(form.tenth_division_id),
      category_id: toOptionalNumber(form.category_id),
      resume_url: toOptionalString(form.resume_url),
      image_url: toOptionalString(form.image_url),
    };

    try {
      await api.put(`/students/${studentId}`, payload);
      alert("Student updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  if (!studentId) {
    return (
      <DashboardShell title="Edit Student" subtitle="No student selected">
        <p className="text-sm text-slate-500">
          Select a student from the View Students page to edit.
        </p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Edit Student" subtitle="Update student details">
      {loading ? (
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
              <Loader2 size={18} className="animate-spin" />
              Loading student...
            </div>
          </CardBody>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Full Name" value={form.name} onChange={update("name")} required />
            <Input
              label="Roll Number"
              value={form.roll_no}
              onChange={update("roll_no")}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              required
            />
            <Input
              label="Mobile Number"
              value={form.mobile_no}
              onChange={update("mobile_no")}
              maxLength={10}
            />

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Gender
              </label>
              <select
                value={form.gender_id}
                onChange={update("gender_id")}
                className={inputClass}
              >
                <option value="">Select Gender</option>
                {meta.genders.map((gender) => (
                  <option key={gender.gender_id} value={gender.gender_id}>
                    {gender.gender}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Department
              </label>
              <select
                value={form.department_id}
                onChange={update("department_id")}
                className={inputClass}
              >
                <option value="">Select Department</option>
                {meta.departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Semester
              </label>
              <select
                value={form.semester_id}
                onChange={update("semester_id")}
                className={inputClass}
              >
                <option value="">Select Semester</option>
                {meta.semesters.map((semester) => (
                  <option key={semester.semester_id} value={semester.semester_id}>
                    {semester.semester}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Date of Birth"
              type="date"
              value={form.date_of_birth}
              onChange={update("date_of_birth")}
            />

            <Input
              label="CGPA"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.cgpa}
              onChange={update("cgpa")}
            />

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                10th Division
              </label>
              <select
                value={form.tenth_division_id}
                onChange={update("tenth_division_id")}
                className={inputClass}
              >
                <option value="">Select 10th Division</option>
                {meta.divisions.map((division) => (
                  <option key={division.division_id} value={division.division_id}>
                    {division.division}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                12th Division
              </label>
              <select
                value={form.twelfth_division_id}
                onChange={update("twelfth_division_id")}
                className={inputClass}
              >
                <option value="">Select 12th Division</option>
                {meta.divisions.map((division) => (
                  <option key={division.division_id} value={division.division_id}>
                    {division.division}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={update("category_id")}
                className={inputClass}
              >
                <option value="">Select Category</option>
                {meta.categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            <MediaUpload
              label="Resume"
              value={form.resume_url}
              onChange={(url) => setForm((prev) => ({ ...prev, resume_url: url }))}
              accept="image/*,application/pdf"
              uploadPath="/uploads/resume"
              hint="Upload resume file. The returned file URL is saved to the student profile."
            />
            <MediaUpload
              label="Profile Image"
              value={form.image_url}
              onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
              accept="image/*"
              uploadPath="/uploads/profile"
              hint="Upload profile image. The returned file URL is saved to the student profile."
            />

            <div className="flex flex-wrap gap-6 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.has_backlog}
                  onChange={update("has_backlog")}
                  className="h-4 w-4 rounded border-orbit-border bg-orbit-surface2"
                />
                Has Backlog
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.is_graduate}
                  onChange={update("is_graduate")}
                  className="h-4 w-4 rounded border-orbit-border bg-orbit-surface2"
                />
                Graduate / Disabled
              </label>
            </div>

            {form.department_id && (
              <p className="text-xs text-slate-500 md:col-span-2">
                Selected department: {departmentNameById[form.department_id]}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </form>
      )}
    </DashboardShell>
  );
}
