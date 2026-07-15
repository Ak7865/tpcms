import DashboardShell from "../../../components/DashboardShell";
import { Card, CardHeader, CardBody } from "../../../components/ui";
import TrainingForm from "../../../components/TrainingForm";

export default function PostTraining() {
  return (
    <DashboardShell
      title="Post Training Opportunity"
      subtitle="Publish a new training program with detailed eligibility criteria"
    >
      <Card>
        <CardHeader title="Training Program Details" subtitle="Fill in the program information" />
        <CardBody>
          <TrainingForm />
        </CardBody>
      </Card>
    </DashboardShell>
  );
}