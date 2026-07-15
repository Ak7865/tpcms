import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody } from '@/components/ui'
import TrainingForm from '@/components/TrainingForm'

export default function PostTraining() {
  return (
    <DashboardShell title="Post New Training" subtitle="Create a training program with detailed eligibility criteria">
      <Card>
        <CardHeader title="Training Details" subtitle="Fill in the training and eligibility criteria information" />
        <CardBody>
          <TrainingForm />
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
