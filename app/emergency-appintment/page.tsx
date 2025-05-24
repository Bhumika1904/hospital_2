import { DashboardLayout } from "@/components/layout"
import { EmergencyAppointmentCreator } from "@/components/emergency-appointment-creator"
import { PatientFinder } from "@/components/patient-finder"

export default function EmergencyAppointmentPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Emergency Appointment Creator</h1>
        <p className="text-muted-foreground">
          Use this page to create appointments directly with the backend API. This bypasses all the normal validation
          and ensures all required fields are sent exactly as the backend expects.
        </p>

        <PatientFinder />

        <EmergencyAppointmentCreator />
      </div>
    </DashboardLayout>
  )
}
