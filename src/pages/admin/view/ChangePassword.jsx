import { useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Button,
  Input,
} from "../../../components/ui";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { api } from "../../../services/api";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      form.new_password !==
      form.confirm_password
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.patch("/users/change-password", {
        old_password: form.old_password,
        new_password: form.new_password,
      });

      setSuccess(
        "Password changed successfully."
      );

      setForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch (err) {

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to change password."
      );

    } finally {

      setLoading(false);

    }
  }
    return (
    <DashboardShell
      title="Change Password"
      subtitle="Update your account password securely"
    >
      <div className="mx-auto max-w-3xl space-y-6">

        {/* ===========================================
                    Change Password Form
        =========================================== */}

        <Card>

          <CardBody>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Old Password */}

              <div className="relative">

                <Input
                  label="Current Password"
                  type={showOld ? "text" : "password"}
                  name="old_password"
                  value={form.old_password}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowOld(!showOld)
                  }
                  className="absolute right-4 top-[42px] text-slate-500 hover:text-white"
                >
                  {showOld ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {/* New Password */}

              <div className="relative">

                <Input
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNew(!showNew)
                  }
                  className="absolute right-4 top-[42px] text-slate-500 hover:text-white"
                >
                  {showNew ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {/* Confirm Password */}

              <div className="relative">

                <Input
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-4 top-[42px] text-slate-500 hover:text-white"
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {/* Success */}

              {success && (

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">

                  {success}

                </div>

              )}

              {/* Error */}

              {error && (

                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">

                  {error}

                </div>

              )}

              {/* Buttons */}

              <div className="flex justify-end gap-3">

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
                      <ShieldCheck size={16} />
                    )
                  }
                >
                  {loading
                    ? "Changing..."
                    : "Change Password"}
                </Button>

              </div>

            </form>

          </CardBody>

        </Card>

        {/* ===========================================
                    Password Guidelines
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-orbit-primary/10 p-3">

                <Lock
                  size={22}
                  className="text-orbit-primary"
                />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-white">
                  Password Guidelines
                </h2>

                <ul className="mt-4 space-y-2 text-sm text-slate-400">

                  <li>• Minimum 8 characters</li>

                  <li>• Include uppercase and lowercase letters</li>

                  <li>• Include at least one number</li>

                  <li>• Include at least one special character</li>

                  <li>• Avoid using old passwords</li>

                </ul>

              </div>

            </div>

          </CardBody>

        </Card>

      </div>

    </DashboardShell>

  );

}