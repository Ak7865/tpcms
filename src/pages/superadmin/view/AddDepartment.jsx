import { useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Button, Input } from "../../../components/ui";
import { Building2, UserPlus } from "lucide-react";

import { api } from "../../../services/api";
import { createCoordinator } from "./coordinatorApi";

export default function AddDepartment() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    department_name: "",

    coordinator_name: "",

    email: "",

    password: "",

    is_active: true,
  });

  const update = (field) => (e) => {
    setForm((prev) => ({
      ...prev,

      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  };

  function validate() {
    if (!form.department_name.trim()) {
      return "Department name is required.";
    }

    if (!form.coordinator_name.trim()) {
      return "Coordinator name is required.";
    }

    if (!form.email.trim()) {
      return "Email is required.";
    }

    if (!form.password.trim()) {
      return "Password is required.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    setSuccess("");

    const validation = validate();

    if (validation) {
      setError(validation);

      return;
    }

    try {
      setLoading(true);
    } catch (err) {
      console.error(err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell
      title="Add Department"
      subtitle="Create Department & Coordinator"
    >
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                <Building2 size={18} />
                Department Information
              </h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Department Name
              </label>

              <Input
                placeholder="Computer Science"
                value={form.department_name}
                onChange={update("department_name")}
              />
            </div>

            <div className="pt-4 border-t border-orbit-border">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                <UserPlus size={18} />
                Coordinator Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Coordinator Name
                </label>

                <Input
                  placeholder="John Doe"
                  value={form.coordinator_name}
                  onChange={update("coordinator_name")}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Email
                </label>

                <Input
                  type="email"
                  placeholder="john@college.edu"
                  value={form.email}
                  onChange={update("email")}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Password
                </label>

                <Input
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={update("password")}
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={update("is_active")}
                  className="w-4 h-4"
                />

                <span className="text-sm text-slate-300">
                  Coordinator Active
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-orbit-border">
              <Button
                type="submit"
                loading={loading}
                icon={<UserPlus size={16} />}
              >
                Create Department
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  );

  /* ===========================================
      Submit Logic
  =========================================== */

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validation = validate();

    if (validation) {
      setError(validation);
      return;
    }

    try {
      setLoading(true);

      const deptRes = await api.post("/departments/register", {
        department_name: form.department_name.trim(),

        name: form.coordinator_name.trim(),

        email: form.email.trim(),

        password: form.password,

        is_active: form.is_active,
      });
      
      const departmentId = deptRes.data?.department_id;

      if (!departmentId) {
        throw new Error(
          "Department created but department_id was not returned.",
        );
      }

    
      /* -----------------------------
         Success
      ------------------------------ */

      setSuccess("Department and Coordinator created successfully.");

      setForm({
        department_name: "",

        coordinator_name: "",

        email: "",

        password: "",

        is_active: true,
      });
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to create department.");
    } finally {
      setLoading(false);
    }
  }
}
