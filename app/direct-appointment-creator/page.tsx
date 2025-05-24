import { DashboardLayout } from "@/components/layout"
import { StandaloneAppointmentList } from "@/components/standalone-appointment-list"

export default function DirectAppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Direct Appointments View</h1>
        <p className="text-muted-foreground">
          This page shows appointments directly from the backend API, bypassing the data context.
        </p>

        <StandaloneAppointmentList />
      </div>
    </DashboardLayout>
  )
}
