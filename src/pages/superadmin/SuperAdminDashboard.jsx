import { useSearchParams } from "react-router-dom";

import DashboardHome from './view/Dashboard';


import ViewStudents from "./view/ViewStudents";
import AddStudent from "./view/AddStudents";
import EditStudent from "./view/EditStudent";
import DisableStudent from "./view/DisableStudents";

import ViewCompanies from "./view/ViewCompanies";
import ApprovedCompanies from "./view/ApprovedCompanies";
import RejectedCompanies from "./view/RejectedCompanies";

import ViewDepartments from "./view/ViewDepartments";
import AddDepartment from "./view/AddDepartment";
import EditDepartment from "./view/EditDepartment";

import ViewCoordinators from "./view/ViewCoordinators";
import AddCoordinator from "./view/AddCoordinator";
import EditCoordinator from "./view/EditCoordinator";

import PlacementActivity from "./view/PlacementActivity";
import PostPlacement from "./view/PostPlacement";
import ViewTrainingActivity from "./view/ViewTrainingActivity";
import PostTraining from "./view/PostTraining";
import TrainingApplications from "./view/TrainingApplications";
import PlacementApplications from "./view/PlacementApplications";
import ShareNotes from "./view/ShareNotes";
import Reports from "./view/Reports";
import Partners from "./view/Partners";

import SettingsPage from "../settings/SettingsPage";

export default function SuperAdminDashboard() {

const [searchParams] = useSearchParams();

const view = searchParams.get("view") || "dashboard";

switch (view) {
  case "view-students":
    return <ViewStudents />;

  case "add-students":
    return <AddStudent />;

case "edit-students":
    return <EditStudent />;
  case "disable-students":
    return <DisableStudent />;

  case "view-companies":
    return <ViewCompanies />;

  case "approved-companies":
    return <ApprovedCompanies />;

  case "rejected-companies":
    return <RejectedCompanies />;

  case "view-departments":
    return <ViewDepartments />;

  case "add-department":
    return <AddDepartment />;

  case "edit-department":
    return <EditDepartment />;

  case "view-coordinators":
    return <ViewCoordinators />;

  case "add-coordinator":
    return <AddCoordinator />;

  case "edit-coordinator":
    return <EditCoordinator />;

  case "placement-activity":
    return <PlacementActivity />;

  case "post-placement":
    return <PostPlacement />;

  case "training-activity":
    return <ViewTrainingActivity />;

  case "post-training-admin":
    return <PostTraining />;

  case "training-applications":
    return <TrainingApplications />;

  case "placement-applications":
    return <PlacementApplications />;

  case "share-notes":
    return <ShareNotes />;

  case "reports":
    return <Reports />;

  case "partners":
    return <Partners />;

  case "settings":
    return <SettingsPage />;

  case "dashboard":
  default:
    return <DashboardHome />;
}

}
