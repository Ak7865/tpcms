import DashboardShell from "../../../components/DashboardShell";
import { Card, CardHeader, CardBody } from "../../../components/ui";
import PlacementForm from "../../../components/PlacementForm";

export default function PostPlacement() {
  return (
    <DashboardShell
      title="Post Placement Notification"
      subtitle="Create a new placement drive or job notification"
    >
      <Card>
        <CardHeader title="Placement Details" subtitle="Fill in the drive information" />
        <CardBody>
          <PlacementForm />
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
