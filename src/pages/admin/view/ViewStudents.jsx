import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Input,
} from "../../../components/ui";

import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  Eye,
  GraduationCap,
} from "lucide-react";

import { api } from "../../../services/api";

export default function ViewStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/students?department=current");

      setStudents(
        res?.data?.data ||
        res?.data ||
        []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase();

    return students.filter((student) => {

      return (
        student.name
          ?.toLowerCase()
          .includes(keyword) ||

        student.user_table?.email
          ?.toLowerCase()
          .includes(keyword) ||

        student.department_table?.department_name
          ?.toLowerCase()
          .includes(keyword)
      );

    });

  }, [students, search]);
    return (
    <DashboardShell
      title="Students"
      subtitle="View students of your department"
    >
      <div className="space-y-6">

        {/* ===========================================
                    Statistics
        =========================================== */}

        <div className="grid gap-5 md:grid-cols-3">

          <Card>

            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-violet-500/10 p-3">

                <Users
                  size={24}
                  className="text-violet-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total Students
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {students.length}
                </h2>

              </div>

            </CardBody>

          </Card>

          <Card>

            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-emerald-500/10 p-3">

                <GraduationCap
                  size={24}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Showing
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {filteredStudents.length}
                </h2>

              </div>

            </CardBody>

          </Card>

          <Card>

            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-cyan-500/10 p-3">

                <Search
                  size={24}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Search
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Students
                </h2>

              </div>

            </CardBody>

          </Card>

        </div>

        {/* ===========================================
                    Search Bar
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="relative w-full md:max-w-md">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <Input
                  className="pl-10"
                  placeholder="Search by name, email or department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              <Button
                variant="outline"
                icon={<RefreshCw size={16} />}
                onClick={loadStudents}
              >
                Refresh
              </Button>

            </div>

          </CardBody>

        </Card>

        {/* Error */}

        {error && (

          <Card>

            <CardBody>

              <p className="text-red-400">
                {error}
              </p>

            </CardBody>

          </Card>

        )}

        {/* Loading */}

        {loading ? (

          <Card>

            <CardBody>

              <div className="flex items-center justify-center gap-3 py-24">

                <Loader2
                  size={22}
                  className="animate-spin"
                />

                Loading students...

              </div>

            </CardBody>

          </Card>

        ) : (
            <>
          <Card>

            <CardBody className="p-0">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="border-b border-orbit-border bg-orbit-surface2">

                    <tr>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Student
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                        Department
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        Semester
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        CGPA
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredStudents.length === 0 ? (

                      <tr>

                        <td
                          colSpan={6}
                          className="py-20 text-center text-slate-500"
                        >

                          <Users
                            size={42}
                            className="mx-auto mb-3 opacity-40"
                          />

                          No students found.

                        </td>

                      </tr>

                    ) : (

                      filteredStudents.map((student) => (

                        <tr
                          key={student.student_id}
                          className="border-b border-orbit-border hover:bg-white/[0.03] transition-colors"
                        >

                          {/* Student */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orbit-primary/10 font-semibold text-orbit-primary">

                                {(student.name ||
                                  student.user_table?.name ||
                                  "S")
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <h3 className="font-medium text-white">

                                  {student.name ||
                                    student.user_table?.name ||
                                    "-"}

                                </h3>

                                <p className="mt-1 text-xs text-slate-500">

                                  {student.user_table?.email ||
                                    "-"}

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Department */}

                          <td className="px-5 py-4 text-slate-300">

                            {student.department_table
                              ?.department_name ||
                              student.department_name ||
                              "-"}

                          </td>

                          {/* Semester */}

                          <td className="px-5 py-4 text-center text-slate-300">

                            {student.semester || "-"}

                          </td>

                          {/* CGPA */}

                          <td className="px-5 py-4 text-center">

                            <Badge variant="secondary">

                              {student.cgpa || "0.00"}

                            </Badge>

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4 text-center">

                            <Badge
                              variant={
                                student.is_active === false
                                  ? "destructive"
                                  : "success"
                              }
                            >
                              {student.is_active === false
                                ? "Inactive"
                                : "Active"}
                            </Badge>

                          </td>

                          {/* Action */}

                          <td className="px-5 py-4">

                            <div className="flex justify-center">

                              <Button
                                size="sm"
                                icon={<Eye size={15} />}
                                onClick={() =>
                                  navigate(
                                    `/coordinator/dashboard?view=student-details&id=${student.student_id}`
                                  )
                                }
                              >
                                View
                              </Button>

                            </div>

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </CardBody>

          </Card>         
                    {/* Student Summary */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Overview */}

            <Card>

              <CardBody>

                <h2 className="mb-5 text-lg font-semibold text-white">
                  Student Overview
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                    <span className="text-slate-400">
                      Total Students
                    </span>

                    <span className="text-xl font-bold text-white">
                      {students.length}
                    </span>

                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                    <span className="text-slate-400">
                      Showing
                    </span>

                    <span className="text-xl font-bold text-orbit-primary">
                      {filteredStudents.length}
                    </span>

                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                    <span className="text-slate-400">
                      Active Students
                    </span>

                    <span className="text-xl font-bold text-emerald-400">
                      {
                        filteredStudents.filter(
                          (student) => student.is_active !== false
                        ).length
                      }
                    </span>

                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4">

                    <span className="text-slate-400">
                      Inactive Students
                    </span>

                    <span className="text-xl font-bold text-red-400">
                      {
                        filteredStudents.filter(
                          (student) => student.is_active === false
                        ).length
                      }
                    </span>

                  </div>

                </div>
                           

              </CardBody>

            </Card>

            {/* Department Summary */}

            <Card>

              <CardBody>

                <h2 className="mb-5 text-lg font-semibold text-white">
                  Department Summary
                </h2>

                <div className="space-y-3">

                  {[
                    ...new Set(
                      filteredStudents.map(
                        (student) =>
                          student.department_table?.department_name ||
                          student.department_name ||
                          "Unknown"
                      )
                    ),
                  ].map((department) => {

                    const count = filteredStudents.filter(
                      (student) =>
                        (
                          student.department_table?.department_name ||
                          student.department_name ||
                          "Unknown"
                        ) === department
                    ).length;

                    return (

                      <div
                        key={department}
                        className="flex items-center justify-between rounded-xl border border-orbit-border bg-orbit-surface2/40 p-4"
                      >

                        <span className="text-slate-300">
                          {department}
                        </span>

                        <span className="rounded-full bg-orbit-primary/10 px-3 py-1 text-sm font-semibold text-orbit-primary">
                          {count}
                        </span>

                      </div>

                    );

                  })}

                  {filteredStudents.length === 0 && (

                    <div className="py-8 text-center text-slate-500">
                      No department data available.
                    </div>

                  )}

                </div>

              </CardBody>

            </Card>

          </div>
          </>

        )}

      </div>

    </DashboardShell>

  );

}   