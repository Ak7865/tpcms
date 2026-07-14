
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardShell from "../../../components/DashboardShell";
import { Card, CardHeader, CardBody, Button, Badge } from "../../../components/ui";

import {
  Users,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  ClipboardList,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  Loader2,
} from "lucide-react";

import { api } from "../../../services/api";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    studentCount: 0,
    departmentCount: 0,
    organizationCount: 0,
    trainingCount: 0,
    placementCount: 0,
    trainingPercentage: 0,
    placementPercentage: 0,
  });

  const [pendingApprovals, setPendingApprovals] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [dashboardRes, pendingRes] = await Promise.all([
          api.get("/dashboards"),
          api.get("/organizations?status=pending"),
        ]);

        setMetrics(dashboardRes.data?.data || {});

        setPendingApprovals(pendingRes.data?.data || []);
      } catch (err) {
        console.error(err);

        setError(err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Students",
      value: metrics.studentCount,
      icon: Users,
      color: "text-violet-400",
    },

    {
      title: "Departments",
      value: metrics.departmentCount,
      icon: GraduationCap,
      color: "text-amber-400",
    },

    {
      title: "Organizations",
      value: metrics.organizationCount,
      icon: Building2,
      color: "text-cyan-400",
    },

    {
      title: "Training",
      value: metrics.trainingCount,
      icon: ClipboardList,
      color: "text-emerald-400",
    },

    {
      title: "Placements",
      value: metrics.placementCount,
      icon: BriefcaseBusiness,
      color: "text-pink-400",
    },
  ];

  if (loading) {
    return (
      <DashboardShell title="Super Admin Dashboard" subtitle="Loading...">
        <Card>
          <CardBody>
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin" size={22} />
              Loading Dashboard...
            </div>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Super Admin Dashboard"
      subtitle="Training & Placement Management System"
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
            {error}
          </div>
        )}
        {/* ===========================================
                Statistics Cards
        =========================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Card key={card.title}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{card.title}</p>

                      <h2 className="text-3xl font-bold mt-2 text-slate-100">
                        {card.value}
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-orbit-surface2 flex items-center justify-center">
                      <Icon size={24} className={card.color} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* ===========================================
                Dashboard Overview
        =========================================== */}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>Training Overview</CardHeader>

            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">Total Trainings</p>

                  <h2 className="text-4xl font-bold mt-2">
                    {metrics.trainingCount}
                  </h2>
                </div>

                <Badge variant="success">{metrics.trainingPercentage}%</Badge>
              </div>

              <div className="mt-6 h-3 rounded-full bg-orbit-surface2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${metrics.trainingPercentage}%`,
                  }}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Placement Overview</CardHeader>

            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">Total Placements</p>

                  <h2 className="text-4xl font-bold mt-2">
                    {metrics.placementCount}
                  </h2>
                </div>

                <Badge variant="success">{metrics.placementPercentage}%</Badge>
              </div>

              <div className="mt-6 h-3 rounded-full bg-orbit-surface2 overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{
                    width: `${metrics.placementPercentage}%`,
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </div>


        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span>Pending Organizations</span>

                <Badge variant="warning">{pendingApprovals.length}</Badge>
              </div>
            </CardHeader>

            <CardBody>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No pending organizations.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.slice(0, 5).map((company) => (
                    <div
                      key={company.user_id}
                      className="flex items-center justify-between border-b border-orbit-border pb-3 last:border-none"
                    >
                      <div>
                        <h4 className="font-medium text-slate-200">
                          {company.name}
                        </h4>

                        <p className="text-xs text-slate-500">
                          {company.user_table?.email}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate("/super-admin/dashboard?view=view-companies")
                        }
                      >
                        <Eye size={15} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Quick Actions</CardHeader>

            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  icon={<Plus size={16} />}
                  onClick={() =>
                    navigate("/super-admin/dashboard?view=add-students")
                  }
                >
                  Add Student
                </Button>

                <Button
                  icon={<Plus size={16} />}
                  onClick={() =>
                    navigate("/super-admin/dashboard?view=add-department")
                  }
                >
                  Department
                </Button>

                <Button
                  icon={<Plus size={16} />}
                  onClick={() =>
                    navigate("/super-admin/dashboard?view=post-placement")
                  }
                >
                  Placement
                </Button>

                <Button
                  icon={<Eye size={16} />}
                  onClick={() =>
                    navigate("/super-admin/dashboard?view=view-companies")
                  }
                >
                  Companies
                </Button>

                <Button
                  icon={<Eye size={16} />}
                  onClick={() =>
                    navigate("/super-admin/dashboard?view=reports")
                  }
                >
                  Reports
                </Button>

                <Button
                  icon={<Eye size={16} />}
                  onClick={() =>
                    navigate("/super-admin/dashboard?view=settings")
                  }
                >
                  Settings
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader>System Status</CardHeader>

          <CardBody>
            <div className="grid md:grid-cols-4 gap-5">
              <div className="rounded-xl bg-orbit-surface2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Server</span>

                  <Badge variant="success">Online</Badge>
                </div>
              </div>

              <div className="rounded-xl bg-orbit-surface2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Database</span>

                  <Badge variant="success">Connected</Badge>
                </div>
              </div>

              <div className="rounded-xl bg-orbit-surface2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">API</span>

                  <Badge variant="success">Running</Badge>
                </div>
              </div>

              <div className="rounded-xl bg-orbit-surface2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Portal</span>

                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Summary</CardHeader>

          <CardBody>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-xl border border-orbit-border p-5">
                <p className="text-slate-500">Training Success</p>

                <h2 className="text-3xl font-bold mt-2 text-emerald-400">
                  {metrics.trainingPercentage}%
                </h2>
              </div>

              <div className="rounded-xl border border-orbit-border p-5">
                <p className="text-slate-500">Placement Success</p>

                <h2 className="text-3xl font-bold mt-2 text-violet-400">
                  {metrics.placementPercentage}%
                </h2>
              </div>

              <div className="rounded-xl border border-orbit-border p-5">
                <p className="text-slate-500">Pending Companies</p>

                <h2 className="text-3xl font-bold mt-2 text-amber-400">
                  {pendingApprovals.length}
                </h2>
              </div>

              <div className="rounded-xl border border-orbit-border p-5">
                <p className="text-slate-500">Total Organizations</p>

                <h2 className="text-3xl font-bold mt-2 text-cyan-400">
                  {metrics.organizationCount}
                </h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
