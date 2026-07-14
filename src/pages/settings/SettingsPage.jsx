import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Badge,
} from "../../components/ui";

import {
  User,
  Building2,
  Settings as SettingsIcon,
  Database,
  History,
  AlertTriangle,
  Save,
  Camera,
  GraduationCap,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

/* ======================================================
    Toggle Switch
====================================================== */

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition ${
        checked
          ? "bg-orbit-primary"
          : "bg-orbit-surface3"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

/* ======================================================
    Section Card
====================================================== */

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}) {
  return (
    <Card>

      <CardHeader>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-orbit-primary/10 flex items-center justify-center">

            <Icon
              size={18}
              className="text-orbit-primary-light"
            />

          </div>

          <div>

            <h2 className="font-semibold text-slate-100">

              {title}

            </h2>

            <p className="text-xs text-slate-500">

              {subtitle}

            </p>

          </div>

        </div>

      </CardHeader>

      <CardBody>

        {children}

      </CardBody>

    </Card>
  );
}

/* ======================================================
    Placeholder
====================================================== */

function Placeholder({
  title,
  Icon,
}) {
  return (
    <DashboardShell
      title="Settings"
      subtitle={title}
    >
      <Card>

        <CardBody className="py-24 text-center">

          <Icon
            size={54}
            className="mx-auto text-orbit-primary mb-5"
          />

          <h2 className="text-2xl font-semibold text-slate-200">

            {title}

          </h2>

          <p className="text-slate-500 mt-2">

            Settings for this role are coming soon.

          </p>

        </CardBody>

      </Card>
    </DashboardShell>
  );
}

/* ======================================================
    Component
====================================================== */

export default function SettingsPage() {

  const auth = JSON.parse(
    sessionStorage.getItem("auth_user") || "{}"
  );

  const roleId = auth?.user?.role_id;

  /* ==============================
      Other Roles
  ============================== */

  if (roleId === 2) {
    return (
      <Placeholder
        title="Student Settings"
        Icon={GraduationCap}
      />
    );
  }

  if (roleId === 3) {
    return (
      <Placeholder
        title="Coordinator Settings"
        Icon={Users}
      />
    );
  }

  if (roleId === 4) {
    return (
      <Placeholder
        title="Company Settings"
        Icon={BriefcaseBusiness}
      />
    );
  }

  /* ==============================
      States
  ============================== */

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
    mobile: auth?.user?.mobile_no || "",
  });

  const [institute, setInstitute] =
    useState({
      college: "",
      university: "",
      website: "",
      address: "",
      academicYear: "",
      placementSession: "",
    });

  const [system, setSystem] =
    useState({
      studentRegistration: true,
      companyRegistration: true,
      resumeBuilder: true,
      placementModule: true,
      maintenanceMode: false,
    });

  const auditLogs = [
    {
      time: "13 Jul 2026 10:15",
      action: "Approved Company",
      user: "Super Admin",
    },
    {
      time: "13 Jul 2026 10:30",
      action: "Added Department",
      user: "Super Admin",
    },
    {
      time: "13 Jul 2026 11:05",
      action: "Posted Placement",
      user: "Super Admin",
    },
  ];

  async function handleSave() {

    try {

      setSaving(true);

      // Future API
      // await api.put("/settings", {
      //   profile,
      //   institute,
      //   system
      // });

      await new Promise(resolve =>
        setTimeout(resolve, 800)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);

    } finally {

      setSaving(false);

    }

  }

  return (
    <DashboardShell
      title="Super Admin Settings"
      subtitle="Manage portal configuration"
    >
            <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-slate-100">

              Super Admin Settings

            </h1>

            <p className="text-slate-500 mt-1">

              Configure the Training & Placement Management System.

            </p>

          </div>

          <Button
            onClick={handleSave}
            loading={saving}
            icon={<Save size={16} />}
          >
            {saved ? "Saved!" : "Save Changes"}
          </Button>

        </div>

        {saved && (

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">

            Settings saved successfully.

          </div>

        )}

        {/* ===========================================
                ADMIN PROFILE
        =========================================== */}

        <SectionCard
          icon={User}
          title="Admin Profile"
          subtitle="Manage administrator account."
        >

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="flex flex-col items-center">

              <div className="relative">

                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-orbit-primary to-violet-600 flex items-center justify-center text-4xl font-bold text-white">

                  {profile.name
                    ? profile.name.charAt(0).toUpperCase()
                    : "A"}

                </div>

                <button
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-orbit-primary flex items-center justify-center"
                >

                  <Camera
                    size={15}
                    className="text-white"
                  />

                </button>

              </div>

              <Badge
                variant="success"
                className="mt-4"
              >
                Super Admin
              </Badge>

            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-5">

              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e)=>
                  setProfile({
                    ...profile,
                    name:e.target.value,
                  })
                }
              />

              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e)=>
                  setProfile({
                    ...profile,
                    email:e.target.value,
                  })
                }
              />

              <Input
                label="Mobile Number"
                value={profile.mobile}
                onChange={(e)=>
                  setProfile({
                    ...profile,
                    mobile:e.target.value,
                  })
                }
              />

              <Input
                label="Role"
                value="Super Admin"
                disabled
              />

            </div>

          </div>

        </SectionCard>

        {/* ===========================================
                INSTITUTE SETTINGS
        =========================================== */}

        <SectionCard
          icon={Building2}
          title="Institute Settings"
          subtitle="Manage institute information."
        >

          <div className="grid md:grid-cols-2 gap-5">

            <Input
              label="Institute Name"
              value={institute.college}
              onChange={(e)=>
                setInstitute({
                  ...institute,
                  college:e.target.value,
                })
              }
            />

            <Input
              label="University"
              value={institute.university}
              onChange={(e)=>
                setInstitute({
                  ...institute,
                  university:e.target.value,
                })
              }
            />

            <Input
              label="Website"
              value={institute.website}
              onChange={(e)=>
                setInstitute({
                  ...institute,
                  website:e.target.value,
                })
              }
            />

            <Input
              label="Academic Year"
              value={institute.academicYear}
              onChange={(e)=>
                setInstitute({
                  ...institute,
                  academicYear:e.target.value,
                })
              }
            />

            <Input
              label="Placement Session"
              value={institute.placementSession}
              onChange={(e)=>
                setInstitute({
                  ...institute,
                  placementSession:e.target.value,
                })
              }
            />

            <Input
              label="Institute Address"
              value={institute.address}
              onChange={(e)=>
                setInstitute({
                  ...institute,
                  address:e.target.value,
                })
              }
            />

          </div>

        </SectionCard>
                {/* ===========================================
                SYSTEM SETTINGS
        =========================================== */}

        <SectionCard
          icon={SettingsIcon}
          title="System Settings"
          subtitle="Enable or disable portal features."
        >

          <div className="space-y-5">

            <div className="flex items-center justify-between border-b border-orbit-border pb-4">
              <div>
                <h4 className="font-medium text-slate-200">
                  Student Registration
                </h4>
                <p className="text-xs text-slate-500">
                  Allow students to register.
                </p>
              </div>

              <Toggle
                checked={system.studentRegistration}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    studentRegistration: value,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between border-b border-orbit-border pb-4">
              <div>
                <h4 className="font-medium text-slate-200">
                  Company Registration
                </h4>
                <p className="text-xs text-slate-500">
                  Allow companies to register.
                </p>
              </div>

              <Toggle
                checked={system.companyRegistration}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    companyRegistration: value,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between border-b border-orbit-border pb-4">
              <div>
                <h4 className="font-medium text-slate-200">
                  Resume Builder
                </h4>
                <p className="text-xs text-slate-500">
                  Enable student resume builder.
                </p>
              </div>

              <Toggle
                checked={system.resumeBuilder}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    resumeBuilder: value,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between border-b border-orbit-border pb-4">
              <div>
                <h4 className="font-medium text-slate-200">
                  Placement Module
                </h4>
                <p className="text-xs text-slate-500">
                  Enable placement drives.
                </p>
              </div>

              <Toggle
                checked={system.placementModule}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    placementModule: value,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-300">
                  Maintenance Mode
                </h4>
                <p className="text-xs text-slate-500">
                  Disable the portal temporarily.
                </p>
              </div>

              <Toggle
                checked={system.maintenanceMode}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    maintenanceMode: value,
                  })
                }
              />
            </div>

          </div>

        </SectionCard>

        {/* ===========================================
                BACKUP & RESTORE
        =========================================== */}

        <SectionCard
          icon={Database}
          title="Backup & Restore"
          subtitle="Database management."
        >

          <div className="flex flex-wrap gap-4">

            <Button>

              Backup Database

            </Button>

            <Button variant="secondary">

              Download Backup

            </Button>

            <Button variant="outline">

              Restore Backup

            </Button>

          </div>

          <div className="mt-6 rounded-xl border border-orbit-border bg-orbit-surface2 p-4">

            <p className="text-sm text-slate-300">

              Last Backup

            </p>

            <p className="text-xs text-slate-500 mt-1">

              13 July 2026 • 03:45 PM

            </p>

          </div>

        </SectionCard>

        {/* ===========================================
                AUDIT LOGS
        =========================================== */}

        <SectionCard
          icon={History}
          title="Audit Logs"
          subtitle="Recent administrator activities."
        >

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-orbit-border">

                  <th className="text-left py-3 text-slate-400">
                    Time
                  </th>

                  <th className="text-left py-3 text-slate-400">
                    User
                  </th>

                  <th className="text-left py-3 text-slate-400">
                    Action
                  </th>

                  <th className="text-left py-3 text-slate-400">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {auditLogs.map((log, index) => (

                  <tr
                    key={index}
                    className="border-b border-orbit-border"
                  >

                    <td className="py-4 text-slate-400">
                      {log.time}
                    </td>

                    <td className="py-4 text-slate-300">
                      {log.user}
                    </td>

                    <td className="py-4 text-slate-300">
                      {log.action}
                    </td>

                    <td className="py-4">

                      <Badge variant="success">

                        Success

                      </Badge>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </SectionCard>
                {/* ===========================================
                DANGER ZONE
        =========================================== */}

        <SectionCard
          icon={AlertTriangle}
          title="Danger Zone"
          subtitle="These actions permanently affect the system."
        >

          <div className="space-y-4">

            <div className="flex items-center justify-between p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5">

              <div>

                <h4 className="font-semibold text-yellow-300">

                  Clear System Cache

                </h4>

                <p className="text-xs text-slate-500 mt-1">

                  Remove cached files to improve performance.

                </p>

              </div>

              <Button
                variant="outline"
                onClick={() => alert("Cache cleared.")}
              >
                Clear Cache
              </Button>

            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-orange-500/30 bg-orange-500/5">

              <div>

                <h4 className="font-semibold text-orange-300">

                  Reset Settings

                </h4>

                <p className="text-xs text-slate-500 mt-1">

                  Restore all settings to default values.

                </p>

              </div>

              <Button
                variant="secondary"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset all settings?"
                    )
                  ) {
                    alert("Settings reset.");
                  }
                }}
              >
                Reset
              </Button>

            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/30 bg-red-500/5">

              <div>

                <h4 className="font-semibold text-red-300">

                  Disable Placement Portal

                </h4>

                <p className="text-xs text-slate-500 mt-1">

                  Disable access for students, coordinators and companies.

                </p>

              </div>

              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    window.confirm(
                      "Disable placement portal?"
                    )
                  ) {
                    alert("Portal disabled.");
                  }
                }}
              >
                Disable Portal
              </Button>

            </div>

          </div>

        </SectionCard>

      </div>

    </DashboardShell>

  );

}