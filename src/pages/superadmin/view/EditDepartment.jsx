import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Button, Input } from "../../../components/ui";
import { ArrowLeft, Save, Building2, UserRound } from "lucide-react";

import { fetchDepartment, updateDepartment } from "./departmentApi";

export default function EditDepartment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const departmentId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    department_name: "",
    coordinator_name: "",
    email: "",
    is_active: true,
  });

  useEffect(() => {
    if (departmentId) {
      loadDepartment();
    } else {
      setLoading(false);
    }
  }, [departmentId]);

  async function loadDepartment() {
    try {
      setLoading(true);
      const data = await fetchDepartment(departmentId);
      setForm({
        department_name: data.department_name || "",
        coordinator_name: data.user_table?.name || "",
        email: data.user_table?.email || "",
        is_active: data.is_active ?? true,
      });
    } catch (err) {
      setError(err.message || "Failed to load department.");
    } finally {
      setLoading(false);
    }
  }

  const update = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  function validate() {
    if (!form.department_name.trim()) return "Department name is required.";
    if (!form.coordinator_name.trim()) return "Coordinator name is required.";
    if (!form.email.trim()) return "Email is required.";
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(form.email.trim())) return "Enter a valid email address.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const msg = validate();
    if (msg) { setError(msg); return; }

    try {
      setSaving(true);
      await updateDepartment(departmentId, {
        department_name: form.department_name.trim(),
        coordinator_name: form.coordinator_name.trim(),
        email: form.email.trim(),
        is_active: form.is_active,
      });
      setSuccess("Department updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update department.");
    } finally {
      setSaving(false);
    }
  }

  /* ─── No ID guard ────────────────────────────────────────────── */
  if (!departmentId) {
    return (
      <DashboardShell
        title="Edit Department"
        subtitle="No department selected"
      >
        <Card>
          <CardBody>
            <p className="text-slate-400">
              Please select a department to edit from the View Departments page.
            </p>
            <div className="mt-4">
              <Button
                variant="ghost"
                icon={<ArrowLeft size={16} />}
                onClick={() =>
                  navigate(
                    "/super-admin/dashboard?view=view-departments"
                  )
                }
              >
                Back to Departments
              </Button>
            </div>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Edit Department"
      subtitle={`Editing department #${departmentId}`}
    >
      <Card>
        <CardBody>
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
              <svg
                className="animate-spin w-5 h-5 text-orbit-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Loading department...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* ── Alerts ── */}
              {success && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {success}
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* ── Department section ── */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-200 mb-4">
                  <Building2 size={17} className="text-orbit-primary" />
                  Department Information
                </h3>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Department Name
                  </label>
                  <Input
                    placeholder="e.g. Computer Science"
                    value={form.department_name}
                    onChange={update("department_name")}
                  />
                </div>
              </div>

              {/* ── Coordinator section ── */}
              <div className="pt-4 border-t border-orbit-border">
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-200 mb-4">
                  <UserRound size={17} className="text-orbit-primary" />
                  Coordinator Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Coordinator Name
                    </label>
                    <Input
                      placeholder="Full name"
                      value={form.coordinator_name}
                      onChange={update("coordinator_name")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="coordinator@college.edu"
                      value={form.email}
                      onChange={update("email")}
                    />
                  </div>
                </div>
              </div>

              {/* ── Status ── */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={update("is_active")}
                    className="w-4 h-4 rounded border-orbit-border accent-orbit-primary"
                  />
                  <span className="text-sm text-slate-300">
                    Department Active
                  </span>
                </label>
              </div>

              {/* ── Actions ── */}
              <div className="flex justify-between items-center pt-4 border-t border-orbit-border">
                <Button
                  type="button"
                  variant="ghost"
                  icon={<ArrowLeft size={16} />}
                  onClick={() =>
                    navigate(
                      "/super-admin/dashboard?view=view-departments"
                    )
                  }
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  loading={saving}
                  icon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
