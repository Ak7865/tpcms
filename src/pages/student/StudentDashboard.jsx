import { useSearchParams } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";


import DashboardView from "./view/DashboardView";
import JobsView from "./view/JobsView";
import TrainingView from "./view/TrainingView";
import ApplicationsView from "./view/ApplicationsView";
import NotificationsView from "./view/NotificationsView";
import ProfileView from "./view/ProfileView";
import AcademicView from "./view/AcademicView";
import DocumentsView from "./view/DocumentsView";
import InterviewLettersView from "./view/InterviewLettersView";

export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const views = {
    dashboard: <DashboardView />,
    jobs: <JobsView />,
    training: <TrainingView />,
    applications: <ApplicationsView />,
    notifications: <NotificationsView />,
    profile: <ProfileView />,
    academic: <AcademicView />,
    documents: <DocumentsView />,
    letters: <InterviewLettersView />,
  };

  return (
    <DashboardShell title="Student Dashboard">
      {views[view] || <DashboardView />}
    </DashboardShell>
  );
}