import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Button,
  Badge,
} from "../../../components/ui";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  VenusAndMars,
  IdCard,
  Download,
  Award,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../../services/api";

export default function StudentDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const studentId = parseInt(searchParams.get("id"));

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (studentId) {
      loadStudent();
    } else {
      setError("No student ID specified.");
      setLoading(false);
    }
  }, [studentId]);

  async function loadStudent() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/students/${studentId}`);
      const raw = res?.data?.data || res?.data || null;

      if (raw) {
        const mapped = {
          ...raw,
          name: raw.name,
          roll_no: raw.roll_no,
          cgpa: raw.cgpa,
          is_graduate: raw.is_graduate || false,
          resume_url: raw.resume_url,
          image_url: raw.image_url,
          age: raw.age,
          user_table: {
            user_id: studentId,
            name: raw.name,
            email: raw.email,
            mobile_no: raw.mobile_no,
            created_on: raw.created_on,
            updated_on: raw.updated_on,
            last_login: raw.last_login,
          },
          department_table: {
            department_name: raw.department,
          },
          semester_table: {
            semester_name: raw.semester ? `Semester ${raw.semester}` : '',
          },
          gender_table: {
            gender: raw.gender,
          },
          category_table: {
            category: raw.category,
          },
          division_table_student_table_tenth_division_idTodivision_table: {
            division: raw.tenth_division,
          },
          division_table_student_table_twelfth_division_idTodivision_table: {
            division: raw.twelfth_division,
          },
          student_skill_table: Array.isArray(raw.skill)
            ? raw.skill.map((skName) => ({ skill_table: { skill: skName } }))
            : [],
        };
        setStudent(mapped);
      } else {
        setStudent(null);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to load student."
      );
    } finally {
      setLoading(false);
    }
  }

  function getInitials(name = "") {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  if (loading) {
    return (
      <DashboardShell
        title="Student Details"
        subtitle="Loading..."
      >
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-3 py-24">
              <Loader2
                size={22}
                className="animate-spin"
              />
              Loading student...
            </div>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell
        title="Student Details"
        subtitle="Error"
      >
        <Card>
          <CardBody>

            <p className="text-red-400">
              {error}
            </p>

            <Button
              className="mt-5"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </Button>

          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  if (!student) {
    return (
      <DashboardShell
        title="Student Details"
      >
        <Card>
          <CardBody>

            Student not found.

          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Student Profile"
      subtitle="Complete academic profile"
    >
      <div className="space-y-6">
                {/* ===========================================
                    Profile Header
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-6">

                {/* Avatar */}

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orbit-primary to-violet-600 text-4xl font-bold text-white shadow-xl">

                  {getInitials(student?.user_table?.name)}

                </div>

                {/* Student Details */}

                <div>

                  <h1 className="text-3xl font-bold text-white">

                    {student.user_table.name}

                  </h1>

                  <p className="mt-2 text-slate-400">

                    Roll Number :
                    {" "}
                    <span className="font-medium text-slate-200">

                      {student.roll_no}

                    </span>

                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">

                    <Badge
                      variant={
                        student.is_graduate
                          ? "destructive"
                          : "success"
                      }
                    >
                      {student.is_graduate
                        ? "Graduated"
                        : "Active"}
                    </Badge>

                    <Badge variant="secondary">

                      <Building2
                        size={13}
                        className="mr-1"
                      />

                      {student.department_table
                        ?.department_name ||
                        "Department"}

                    </Badge>

                    <Badge variant="secondary">

                      <GraduationCap
                        size={13}
                        className="mr-1"
                      />

                      Semester{" "}
                      {student.semester_table
                        ?.semester_name ||
                        student.semester_id}

                    </Badge>

                    <Badge variant="secondary">

                      <IdCard
                        size={13}
                        className="mr-1"
                      />

                      ID #{student.student_id}

                    </Badge>

                  </div>

                </div>

              </div>

              {/* Right Buttons */}

              <div className="flex flex-wrap gap-3">

                {student.resume_url && (

                  <Button
                    asChild
                    icon={<Download size={16} />}
                  >

                    <a
                      href={student.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >

                      Download Resume

                    </a>

                  </Button>

                )}

                <Button
                  variant="outline"
                  icon={<ArrowLeft size={16} />}
                  onClick={() => navigate(-1)}
                >

                  Back

                </Button>

              </div>

            </div>

          </CardBody>

        </Card>

        {/* ===========================================
                    Academic Summary
        =========================================== */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Department */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-blue-500/10 p-3">

                  <Building2
                    size={24}
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    Department

                  </p>

                  <h3 className="mt-1 font-semibold text-white">

                    {student.department_table
                      ?.department_name || "-"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Semester */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-violet-500/10 p-3">

                  <GraduationCap
                    size={24}
                    className="text-violet-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    Semester

                  </p>

                  <h3 className="mt-1 font-semibold text-white">

                    {student.semester_table
                      ?.semester_name ||
                      student.semester_id ||
                      "-"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* CGPA */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-emerald-500/10 p-3">

                  <Award
                    size={24}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    CGPA

                  </p>

                  <h3 className="mt-1 font-semibold text-white">

                    {student.cgpa ?? "N/A"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Status */}

          <Card>

            <CardBody>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-green-500/10 p-3">

                  <CheckCircle2
                    size={24}
                    className="text-green-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">

                    Status

                  </p>

                  <h3 className="mt-1 font-semibold text-white">

                    {student.is_graduate
                      ? "Graduated"
                      : "Active"}

                  </h3>

                </div>

              </div>

            </CardBody>

          </Card>

        </div>
                {/* ===========================================
                Personal & Academic Information
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Personal Information */}

          <Card>

            <CardBody>

              <h2 className="mb-6 text-lg font-semibold text-white">
                Personal Information
              </h2>

              <div className="space-y-5">

                <div className="flex items-center justify-between border-b border-orbit-border pb-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <User size={16} />
                    Full Name
                  </span>

                  <span className="font-medium text-slate-200">
                    {student.name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-orbit-border pb-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <IdCard size={16} />
                    Roll Number
                  </span>

                  <span className="font-medium text-slate-200">
                    {student.roll_no}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-orbit-border pb-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <VenusAndMars size={16} />
                    Gender
                  </span>

                  <span className="font-medium text-slate-200">
                    {student.gender_table?.gender ||
                      student.gender ||
                      "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Calendar size={16} />
                    Age
                  </span>

                  <span className="font-medium text-slate-200">
                    {student.age || "-"}
                  </span>
                </div>

              </div>

            </CardBody>

          </Card>

          {/* Academic Information */}

          <Card>

            <CardBody>

              <h2 className="mb-6 text-lg font-semibold text-white">
                Academic Information
              </h2>

              <div className="space-y-5">

                <div className="flex items-center justify-between border-b border-orbit-border pb-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Building2 size={16} />
                    Department
                  </span>

                  <span className="font-medium text-slate-200">
                    {student.department_table?.department_name ||
                      "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-orbit-border pb-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <GraduationCap size={16} />
                    Semester
                  </span>

                  <span className="font-medium text-slate-200">
                    {student.semester_table?.semester_name ||
                      student.semester_id ||
                      "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-orbit-border pb-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Award size={16} />
                    CGPA
                  </span>

                  <span className="font-medium text-emerald-400">
                    {student.cgpa ?? "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500">
                    <CheckCircle2 size={16} />
                    Academic Status
                  </span>

                  <Badge
                    variant={
                      student.is_graduate
                        ? "destructive"
                        : "success"
                    }
                  >
                    {student.is_graduate
                      ? "Graduated"
                      : "Studying"}
                  </Badge>
                </div>

              </div>

            </CardBody>

          </Card>

        </div>

        {/* ===========================================
                Contact Information
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-6 text-lg font-semibold text-white">
              Contact Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <div className="flex items-center gap-3">

                  <Mail
                    size={20}
                    className="text-orbit-primary"
                  />

                  <div>

                    <p className="text-xs text-slate-500">
                      Email Address
                    </p>

                    <p className="mt-1 font-medium text-slate-200 break-all">
                      {student.user_table?.email || "-"}
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <div className="flex items-center gap-3">

                  <Phone
                    size={20}
                    className="text-orbit-primary"
                  />

                  <div>

                    <p className="text-xs text-slate-500">
                      Mobile Number
                    </p>

                    <p className="mt-1 font-medium text-slate-200">
                      {student.user_table?.mobile_no ||
                        student.mobile_no ||
                        "-"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </CardBody>

        </Card>
                {/* ===========================================
                    Progress & Resume
        =========================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Academic Progress */}

          <Card>

            <CardBody>

              <h2 className="mb-6 text-lg font-semibold text-white">
                Academic Progress
              </h2>

              <div className="flex flex-col items-center">

                <div className="relative h-36 w-36">

                  <svg
                    className="h-36 w-36 -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#243041"
                      strokeWidth="10"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={327}
                      strokeDashoffset={
                        327 -
                        ((student.cgpa || 0) / 10) * 327
                      }
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">

                    <p className="text-3xl font-bold text-white">
                      {student.cgpa ?? "N/A"}
                    </p>

                    <span className="text-xs text-slate-500">
                      CGPA
                    </span>

                  </div>

                </div>

                <div className="mt-8 w-full space-y-4">

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Department
                    </span>

                    <span className="font-medium text-white">
                      {student.department_table?.department_name ||
                        "-"}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Semester
                    </span>

                    <span className="font-medium text-white">
                      {student.semester_table?.semester_name ||
                        student.semester_id}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Status
                    </span>

                    <Badge
                      variant={
                        student.is_graduate
                          ? "destructive"
                          : "success"
                      }
                    >
                      {student.is_graduate
                        ? "Graduated"
                        : "Active"}
                    </Badge>

                  </div>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* Resume */}

          <Card>

            <CardBody>

              <h2 className="mb-6 text-lg font-semibold text-white">
                Resume
              </h2>

              {student.resume_url ? (

                <div className="rounded-xl border border-orbit-border bg-orbit-surface2 p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-medium text-white">
                        Resume Uploaded
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Click below to download.
                      </p>

                    </div>

                    <Button
                      asChild
                      icon={<Download size={16} />}
                    >

                      <a
                        href={student.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>

                    </Button>

                  </div>

                </div>

              ) : (

                <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-orbit-border text-slate-500">

                  No Resume Uploaded

                </div>

              )}

            </CardBody>

          </Card>

        </div>

        {/* ===========================================
                    Account Information
        =========================================== */}

        <Card>

          <CardBody>

            <h2 className="mb-6 text-lg font-semibold text-white">
              Account Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  User ID
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  {student.user_table?.user_id || "-"}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Created On
                </p>

                <h3 className="mt-2 text-base font-semibold text-white">
                  {student.user_table?.created_on
                    ? new Date(
                        student.user_table.created_on
                      ).toLocaleDateString()
                    : "-"}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Updated On
                </p>

                <h3 className="mt-2 text-base font-semibold text-white">
                  {student.user_table?.updated_on
                    ? new Date(
                        student.user_table.updated_on
                      ).toLocaleDateString()
                    : "-"}
                </h3>

              </div>

              <div className="rounded-xl border border-orbit-border bg-orbit-surface2/40 p-5">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Last Login
                </p>

                <h3 className="mt-2 text-base font-semibold text-white">
                  {student.user_table?.last_login
                    ? new Date(
                        student.user_table.last_login
                      ).toLocaleDateString()
                    : "Never"}
                </h3>

              </div>

            </div>

          </CardBody>

        </Card>

      </div>

    </DashboardShell>

  );

}