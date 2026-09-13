import { useSearchParams } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";


import DashboardView from "./view/DashboardView";
import JobsView from "./view/JobsView";
import TrainingView from "./view/TrainingView";
import ApplicationsView from "./view/ApplicationsView";
import NotificationsView from "./view/NotificationsView";
import ProfileView from "./view/ProfileView";
import SettingsPage from "../settings/SettingsPage";
import InterviewLettersView from "./view/InterviewLettersView";
import Resume from '../../utils/resumeBuilder';
import ResumePreview from './../components/Resume';
import ViewNotes from "./../components/ViewNotes";
export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const views = {
    dashboard: <DashboardView />,
    jobs: <JobsView />,
    training: <TrainingView />,
    applications: <ApplicationsView />,
    "placement-applications": <ApplicationsView filterType="Placement" />,
    "training-applications": <ApplicationsView filterType="Training" />,
    notifications: <NotificationsView />,
    shared_notes: <ViewNotes />,
    profile: <ProfileView />,
    settings: <SettingsPage />,
    letters: <InterviewLettersView />,
  };

  return (
    <DashboardShell title="Student Dashboard">
      {views[view] || <DashboardView />}
    </DashboardShell>
  );
}
