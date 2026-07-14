// Full AddStudents.jsx template using your backend routes.
// Update field names if backend schema differs.

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
} from "../../../components/ui";
import { UserPlus, ChevronDown } from "lucide-react";
import { api } from "../../../services/api";

export default function AddStudents() {
  const emptyForm = {
    rollNo: "",
    name: "",
    email: "",
    password: "",
    departmentId: "",
    semesterId: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    (async () => {
      try {
        const [d, s, g] = await Promise.all([
          api.get("/departments/"),
          api.get("/semesters/"),
        ]);
        setDepartments(d.data || []);
        setSemesters(s.data || []);
     
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.post("/students/", {
        roll_no: form.rollNo,
        name: form.name,
        email: form.email,
        password: form.password,
        department_id: Number(form.departmentId),
        semester_id: Number(form.semesterId),
      });
      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell title="Add Student" subtitle="Register a new student">
      <Card>
        <CardHeader
          title="Student Information"
          subtitle="Fill all required fields"
        />
        <CardBody>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              label="Roll Number"
              value={form.rollNo}
              onChange={update("rollNo")}
              required
            />
            <Input
              label="Full Name"
              value={form.name}
              onChange={update("name")}
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
              label="Password"
              type="password"
              value={form.password}
              onChange={update("password")}
              required
            />
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>

              <select
                value={form.departmentId}
                onChange={update("departmentId")}
                required
                className="
      w-full
      rounded-xl
      border border-orbit-border
      bg-orbit-surface2
      px-4
      py-3
      text-sm
      text-slate-200
      outline-none
      focus:border-orbit-primary
      focus:ring-2
      focus:ring-orbit-primary/20
      transition-all
    "
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <ChevronDown size={16} className="absolute right-2 top-3" />
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Semester <span className="text-red-500">*</span>
              </label>

              <select
                value={form.semesterId}
                onChange={update("semesterId")}
                required
                className="
      w-full
      rounded-xl
      border border-orbit-border
      bg-orbit-surface2
      px-4
      py-3
      text-sm
      text-slate-200
      outline-none
      focus:border-orbit-primary
      focus:ring-2
      focus:ring-orbit-primary/20
      transition-all
    "
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
                  <option key={s.semester_id} value={s.semester_id}>
                    {s.semester}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <ChevronDown size={16} className="absolute right-2 top-3" />
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Gender <span className="text-red-500">*</span>
              </label>

              <select
                value={form.genderId}
                onChange={update("genderId")}
                required
                className="
      w-full
      rounded-xl
      border border-orbit-border
      bg-orbit-surface2
      px-4
      py-3
      text-sm
      text-slate-200
      outline-none
      focus:border-orbit-primary
      focus:ring-2
      focus:ring-orbit-primary/20
      transition-all
    "
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g.gender_id} value={g.gender_id}>
                    {g.gender}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="md:col-span-2">
              {success && (
                <div className="mb-3 text-green-600">
                  Student registered successfully.
                </div>
              )}
              <Button
                type="submit"
                loading={loading}
                icon={<UserPlus size={16} />}
              >
                Add Student
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
