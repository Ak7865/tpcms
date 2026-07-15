import DashboardShell from '@/components/DashboardShell'
import { Card, CardHeader, CardBody } from '@/components/ui'
import PlacementForm from '@/components/PlacementForm'

export default function PostJob() {
  return (
    <DashboardShell title="Post New Job" subtitle="Create a placement with detailed eligibility criteria">
      <Card>
        <CardHeader title="Job Details" subtitle="Fill in the job and eligibility criteria information" />
        <CardBody>
          <PlacementForm />
        </CardBody>
      </Card>
    </DashboardShell>
  )
}
