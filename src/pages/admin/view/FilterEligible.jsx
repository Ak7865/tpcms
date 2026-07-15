import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Input,
  Button,
} from "../../../components/ui";
import {
  Search,
  Filter,
  Loader2,
  RefreshCw,
  Users,
  GraduationCap,
  Award,
} from "lucide-react";
import { api } from "../../../services/api";

export default function FilterEligible() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [minCgpa, setMinCgpa] = useState("6");

  const [semester, setSemester] = useState("");

  const [department, setDepartment] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);

      const res = await api.get("/students");

      setStudents(res?.data?.data || []);

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setLoading(false);

    }
  }

  const filteredStudents = useMemo(() => {

    return students.filter((student) => {

      const matchesSearch =
        (student.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (student.user_table?.email || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCgpa =
        Number(student.cgpa || 0) >= Number(minCgpa);

      const matchesSemester =
        semester === "" ||
        String(student.semester) === semester;

      const matchesDepartment =
        department === "" ||
        student.department_name === department;

      return (
        matchesSearch &&
        matchesCgpa &&
        matchesSemester &&
        matchesDepartment
      );

    });

  }, [
    students,
    search,
    minCgpa,
    semester,
    department,
  ]);
    return (
    <DashboardShell
      title="Filter Eligible Students"
      subtitle="Find students eligible for training and placement drives"
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

                <Award
                  size={24}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Eligible Students
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {filteredStudents.length}
                </h2>

              </div>

            </CardBody>

          </Card>

          <Card>

            <CardBody className="flex items-center gap-4">

              <div className="rounded-xl bg-blue-500/10 p-3">

                <GraduationCap
                  size={24}
                  className="text-blue-400"
                />

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Minimum CGPA
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {minCgpa}
                </h2>

              </div>

            </CardBody>

          </Card>

        </div>

        {/* ===========================================
                    Filter Section
        =========================================== */}

        <Card>

          <CardBody>

            <div className="grid gap-4 md:grid-cols-4">

              <Input
                placeholder="Search student..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                leftIcon={<Search size={16} />}
              />

              <Input
                type="number"
                placeholder="Minimum CGPA"
                value={minCgpa}
                onChange={(e) =>
                  setMinCgpa(e.target.value)
                }
              />

              <Input
                placeholder="Semester"
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value)
                }
              />

              <Input
                placeholder="Department"
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              />

            </div>

            <div className="mt-5 flex justify-end">

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

    {/* Table */}

    <Card>

      <CardBody className="p-0">

        {/* your complete table goes here */}

      </CardBody>

    </Card>

    {/* Eligibility Summary */}

    <div className="grid gap-6 lg:grid-cols-2">

      {/* CGPA Summary */}

      <Card>
        ...
      </Card>

      {/* Department Summary */}

      <Card>
        ...
      </Card>

    </div>

  </>

)}
                            </div>
  </DashboardShell>

  );
}

